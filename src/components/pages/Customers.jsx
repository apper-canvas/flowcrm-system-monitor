import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import DataTable from '@/components/molecules/DataTable'
import EmptyState from '@/components/molecules/EmptyState'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { customerService } from '@/services'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const data = await customerService.getAll()
      setCustomers(data)
    } catch (error) {
      toast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setShowAddModal(true)
  }

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer)
    setShowAddModal(true)
  }

  const handleDeleteCustomer = async (customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      try {
        await customerService.delete(customer.id)
        setCustomers(prev => prev.filter(c => c.id !== customer.id))
        toast.success('Customer deleted successfully')
      } catch (error) {
        toast.error('Failed to delete customer')
      }
    }
  }

  const handleSaveCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        const updated = await customerService.update(editingCustomer.id, customerData)
        setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? updated : c))
        toast.success('Customer updated successfully')
      } else {
        const newCustomer = await customerService.create(customerData)
        setCustomers(prev => [newCustomer, ...prev])
        toast.success('Customer created successfully')
      }
      setShowAddModal(false)
      setEditingCustomer(null)
    } catch (error) {
      toast.error('Failed to save customer')
    }
  }

  const getFilteredCustomers = () => {
    let filtered = customers

    if (searchQuery) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => 
        customer.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    return filtered
  }

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success'
      case 'prospect': return 'warning'
      case 'inactive': return 'error'
      default: return 'default'
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      getBadgeVariant: getStatusVariant,
      sortable: true
    },
    {
      key: 'value',
      label: 'Value',
      type: 'currency',
      sortable: true
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      sortable: true
    },
    {
      key: 'createdAt',
      label: 'Created',
      type: 'date',
      sortable: true
    }
  ]

  const filteredCustomers = getFilteredCustomers()

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
            <p className="text-gray-600">Manage your customer relationships and contact information</p>
          </div>
          <Button onClick={handleAddCustomer} icon="Plus">
            Add Customer
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                icon="Search"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="prospect">Prospect</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredCustomers.length === 0 && !loading ? (
          <EmptyState
            icon="Users"
            title="No customers found"
            description={searchQuery || statusFilter !== 'all' ? "No customers match your search criteria" : "Get started by adding your first customer"}
            actionLabel={!searchQuery && statusFilter === 'all' ? "Add Customer" : undefined}
            onAction={!searchQuery && statusFilter === 'all' ? handleAddCustomer : undefined}
          />
        ) : (
          <DataTable
            data={filteredCustomers}
            columns={columns}
            loading={loading}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        )}

        {/* Add/Edit Modal */}
        <CustomerModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setEditingCustomer(null)
          }}
          onSave={handleSaveCustomer}
          customer={editingCustomer}
        />
      </div>
    </div>
  )
}

// Customer Modal Component
const CustomerModal = ({ isOpen, onClose, onSave, customer }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Prospect',
    assignedTo: 'John Smith',
    value: 0
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (customer) {
      setFormData(customer)
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'Prospect',
        assignedTo: 'John Smith',
        value: 0
      })
    }
  }, [customer, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {customer ? 'Edit Customer' : 'Add Customer'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
            
            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Prospect">Prospect</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <Input
              label="Customer Value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="John Smith">John Smith</option>
                <option value="Emily Davis">Emily Davis</option>
                <option value="Mark Wilson">Mark Wilson</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                {customer ? 'Update' : 'Create'} Customer
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Customers