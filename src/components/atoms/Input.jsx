import React, { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false)

  const hasValue = value && value.length > 0
  const shouldFloat = focused || hasValue

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            <ApperIcon name={icon} size={16} />
          </div>
        )}
        
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`
            w-full px-3 py-3 border rounded-lg transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-error focus:border-error focus:ring-error' 
              : 'border-gray-300 focus:border-primary focus:ring-primary'
            }
            focus:ring-2 focus:ring-opacity-20 focus:outline-none
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
            ${shouldFloat ? 'pt-6 pb-2' : ''}
          `}
          placeholder={shouldFloat ? placeholder : ''}
          required={required}
          {...props}
        />
        
        {label && (
          <label
            className={`
              absolute left-3 transition-all duration-200 pointer-events-none
              ${icon ? 'left-10' : 'left-3'}
              ${shouldFloat 
                ? 'top-1 text-xs text-gray-500 font-medium' 
                : 'top-1/2 -translate-y-1/2 text-gray-400'
              }
              ${error && shouldFloat ? 'text-error' : ''}
            `}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Input