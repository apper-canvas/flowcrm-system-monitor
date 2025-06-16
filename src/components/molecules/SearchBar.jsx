import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { customerService, leadService, taskService } from '@/services'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchData = async () => {
      if (query.length < 2) {
        setResults([])
        setIsOpen(false)
        return
      }

      setLoading(true)
      try {
        const [customers, leads, tasks] = await Promise.all([
          customerService.search(query),
          leadService.getAll(),
          taskService.getAll()
        ])

        const filteredLeads = leads.filter(lead =>
          lead.customerName.toLowerCase().includes(query.toLowerCase()) ||
          lead.company.toLowerCase().includes(query.toLowerCase())
        )

        const filteredTasks = tasks.filter(task =>
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description.toLowerCase().includes(query.toLowerCase())
        )

        const searchResults = [
          ...customers.slice(0, 3).map(item => ({ ...item, type: 'customer' })),
          ...filteredLeads.slice(0, 3).map(item => ({ ...item, type: 'lead' })),
          ...filteredTasks.slice(0, 3).map(item => ({ ...item, type: 'task' }))
        ]

        setResults(searchResults)
        setIsOpen(true)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchData, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const getTypeIcon = (type) => {
    switch (type) {
      case 'customer': return 'User'
      case 'lead': return 'Target'
      case 'task': return 'CheckSquare'
      default: return 'Search'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'customer': return 'text-blue-600'
      case 'lead': return 'text-purple-600'
      case 'task': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <input
          type="text"
          placeholder="Search customers, leads, tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        />
        {loading && (
          <ApperIcon 
            name="Loader2" 
            size={16} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" 
          />
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-2">
              {results.map((item, index) => (
                <motion.div
                  key={`${item.type}-${item.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setQuery('')
                    setIsOpen(false)
                  }}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 mr-3`}>
                    <ApperIcon 
                      name={getTypeIcon(item.type)} 
                      size={16} 
                      className={getTypeColor(item.type)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name || item.customerName || item.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {item.type === 'customer' && item.company}
                      {item.type === 'lead' && `${item.company} • ${item.stage}`}
                      {item.type === 'task' && item.assignedTo}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {item.type}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar