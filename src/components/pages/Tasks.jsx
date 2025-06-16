import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import TaskList from '@/components/organisms/TaskList'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services'

const Tasks = () => {
  const [filter, setFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  })

  useEffect(() => {
    loadTaskStats()
  }, [])

  const loadTaskStats = async () => {
    try {
      const tasks = await taskService.getAll()
      const now = new Date()
      
      setTaskStats({
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pending: tasks.filter(t => !t.completed).length,
        overdue: tasks.filter(t => !t.completed && new Date(t.dueDate) < now).length
      })
    } catch (error) {
      console.error('Error loading task stats:', error)
    }
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setShowAddModal(true)
  }

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, taskData)
        toast.success('Task updated successfully')
      } else {
        await taskService.create(taskData)
        toast.success('Task created successfully')
      }
      setShowAddModal(false)
      setEditingTask(null)
      loadTaskStats()
    } catch (error) {
      toast.error('Failed to save task')
    }
  }

  const filterOptions = [
    { value: 'all', label: 'All Tasks', count: taskStats.total },
    { value: 'pending', label: 'Pending', count: taskStats.pending },
    { value: 'completed', label: 'Completed', count: taskStats.completed },
    { value: 'overdue', label: 'Overdue', count: taskStats.overdue },
    { value: 'today', label: 'Due Today', count: 0 }
  ]

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
            <p className="text-gray-600">Manage your tasks and track progress</p>
          </div>
          <Button onClick={handleAddTask} icon="Plus">
            Add Task
          </Button>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.completed}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" size={20} className="text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{taskStats.overdue}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertCircle" size={20} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Filter Tasks</h3>
            <div className="space-y-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${filter === option.value
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <span>{option.label}</span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${filter === option.value
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-500'
                    }
                  `}>
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Task List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {filterOptions.find(f => f.value === filter)?.label || 'Tasks'}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ApperIcon name="Filter" size={16} />
                  <span>
                    {filterOptions.find(f => f.value === filter)?.count || 0} tasks
                  </span>
                </div>
              </div>
              
              <TaskList filter={filter} />
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <TaskModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setEditingTask(null)
          }}
          onSave={handleSaveTask}
          task={editingTask}
        />
      </div>
    </div>
  )
}

// Task Modal Component
const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    relatedTo: '',
    assignedTo: 'John Smith',
    dueDate: '',
    priority: 'Medium'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        dueDate: new Date(task.dueDate).toISOString().split('T')[0]
      })
    } else {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      setFormData({
        title: '',
        description: '',
        relatedTo: '',
        assignedTo: 'John Smith',
        dueDate: tomorrow.toISOString().split('T')[0],
        priority: 'Medium'
      })
    }
  }, [task, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      }
      await onSave(taskData)
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
              {task ? 'Edit Task' : 'Add Task'}
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
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                placeholder="Task description..."
              />
            </div>
            
            <Input
              label="Related To (Customer/Lead ID)"
              value={formData.relatedTo}
              onChange={(e) => setFormData(prev => ({ ...prev, relatedTo: e.target.value }))}
              placeholder="Optional"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
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
                {task ? 'Update' : 'Create'} Task
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Tasks