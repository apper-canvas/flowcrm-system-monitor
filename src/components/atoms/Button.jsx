import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:from-indigo-600 hover:to-purple-600 focus:ring-primary shadow-md',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-error shadow-md'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
  }`

  const buttonContent = (
    <>
      {loading && <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />}
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} size={16} className="mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} size={16} className="ml-2" />
      )}
    </>
  )

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {buttonContent}
    </motion.button>
  )
}

export default Button