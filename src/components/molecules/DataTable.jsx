import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const DataTable = ({ 
  data = [], 
  columns = [], 
  loading = false,
  onEdit,
  onDelete,
  onRowClick,
  className = '' 
}) => {
  const [sortBy, setSortBy] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')

  const handleSort = (column) => {
    if (!column.sortable) return
    
    if (sortBy === column.key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column.key)
      setSortOrder('asc')
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortBy || !data.length) return data

    return [...data].sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]

      // Handle different data types
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortBy, sortOrder])

  const renderCell = (item, column) => {
    const value = item[column.key]

    if (column.render) {
      return column.render(value, item)
    }

    if (column.type === 'badge') {
      const variant = column.getBadgeVariant ? column.getBadgeVariant(value) : 'default'
      return <Badge variant={variant}>{value}</Badge>
    }

    if (column.type === 'currency') {
      return `$${value.toLocaleString()}`
    }

    if (column.type === 'date') {
      return new Date(value).toLocaleDateString()
    }

    return value
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                  }`}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ApperIcon
                          name="ChevronUp"
                          size={12}
                          className={`${
                            sortBy === column.key && sortOrder === 'asc'
                              ? 'text-primary'
                              : 'text-gray-400'
                          }`}
                        />
                        <ApperIcon
                          name="ChevronDown"
                          size={12}
                          className={`-mt-1 ${
                            sortBy === column.key && sortOrder === 'desc'
                              ? 'text-primary'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`hover:bg-gray-50 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {renderCell(item, column)}
                    </div>
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Edit"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(item)
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(item)
                        }}
                        className="text-error hover:text-error hover:bg-error/10"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable