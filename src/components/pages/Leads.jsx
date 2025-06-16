import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import PipelineBoard from '@/components/organisms/PipelineBoard'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { leadService } from '@/services'

const Leads = () => {
  const [viewMode, setViewMode] = useState('pipeline') // 'pipeline' or 'list'
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)

  const handleAddLead = () => {
    setEditingLead(null)
    setShowAddModal(true)
  }

  const handleSaveLead = async (leadData) => {
    try {
      if (editingLead) {
        await leadService.update(editingLead.id, leadData)
        toast.success('Lead updated successfully')
      } else {
        await leadService.create(leadData)
        toast.success('Lead created successfully')
      }
      setShowAddModal(false)
      setEditingLead(null)
      // Refresh the pipeline board
      window.location.reload()
    } catch (error) {
      toast.error('Failed to save lead')
    }
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leads</h1>
            <p className="text-gray-600">Track your leads through the sales pipeline</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('pipeline')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === 'pipeline'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ApperIcon name="Columns" size={16} className="inline mr-1" />
                Pipeline
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ApperIcon name="List" size={16} className="inline mr-1" />
                List
              </button>
            </div>
            
            <Button onClick={handleAddLead} icon="Plus">
              Add Lead
            </Button>
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Qualified</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Filter" size={20} className="text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" size={20} className="text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closed Won</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Board */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <PipelineBoard />
        </div>

        {/* Add/Edit Modal */}
        <LeadModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setEditingLead(null)
          }}
          onSave={handleSaveLead}
          lead={editingLead}
        />
      </div>
    </div>
  )
}

// Lead Modal Component
const LeadModal = ({ isOpen, onClose, onSave, lead }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    company: '',
    email: '',
    phone: '',
    stage: 'New',
    value: 0,
    probability: 25,
    assignedTo: 'John Smith'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (lead) {
      setFormData(lead)
    } else {
      setFormData({
        customerName: '',
        company: '',
        email: '',
        phone: '',
        stage: 'New',
        value: 0,
        probability: 25,
        assignedTo: 'John Smith'
      })
    }
  }, [lead, isOpen])

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
              {lead ? 'Edit Lead' : 'Add Lead'}
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
              label="Customer Name"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              required
            />
            
            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="New">New</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Lead Value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
              />
              
              <Input
                label="Probability (%)"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => setFormData(prev => ({ ...prev, probability: parseInt(e.target.value) || 0 }))}
              />
            </div>

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
                {lead ? 'Update' : 'Create'} Lead
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Leads