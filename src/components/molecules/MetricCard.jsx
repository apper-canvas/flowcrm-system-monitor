import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  gradient = false,
  className = '',
  ...props 
}) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `$${(val / 1000000).toFixed(1)}M`
      } else if (val >= 1000) {
        return `$${(val / 1000).toFixed(0)}K`
      } else if (title.toLowerCase().includes('rate') || title.toLowerCase().includes('%')) {
        return `${val}%`
      } else if (title.toLowerCase().includes('revenue') || title.toLowerCase().includes('value')) {
        return `$${val.toLocaleString()}`
      }
      return val.toLocaleString()
    }
    return val
  }

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success'
    if (changeType === 'negative') return 'text-error'
    return 'text-gray-500'
  }

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp'
    if (changeType === 'negative') return 'TrendingDown'
    return 'Minus'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        ${gradient 
          ? 'bg-gradient-to-br from-primary to-secondary text-white' 
          : 'bg-white border border-gray-200'
        } 
        rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 
        ${className}
      `}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-gray-600'} mb-1`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${gradient ? 'text-white' : 'text-gray-900'} mb-2`}>
            {formatValue(value)}
          </p>
          {change !== undefined && (
            <div className="flex items-center">
              <ApperIcon 
                name={getChangeIcon()} 
                size={14} 
                className={`mr-1 ${gradient ? 'text-white/80' : getChangeColor()}`}
              />
              <span className={`text-sm font-medium ${gradient ? 'text-white/80' : getChangeColor()}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className={`text-sm ${gradient ? 'text-white/60' : 'text-gray-500'} ml-1`}>
                vs last month
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`
            p-3 rounded-lg 
            ${gradient 
              ? 'bg-white/20' 
              : 'bg-gradient-to-br from-primary/10 to-secondary/10'
            }
          `}>
            <ApperIcon 
              name={icon} 
              size={24} 
              className={gradient ? 'text-white' : 'text-primary'}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MetricCard