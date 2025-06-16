import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const EmptyState = ({
  icon = 'Package',
  title = 'No data available',
  description = 'Get started by adding your first item',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: 'easeInOut'
        }}
        className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4"
      >
        <ApperIcon name={icon} size={24} className="text-gray-400" />
      </motion.div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      
      {actionLabel && onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onAction} icon="Plus">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState