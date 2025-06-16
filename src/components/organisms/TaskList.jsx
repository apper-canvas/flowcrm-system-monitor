import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import EmptyState from '@/components/molecules/EmptyState'
import { taskService } from '@/services'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

const TaskList = ({ filter = 'all', limit }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    try {
      const data = await taskService.getAll()
      setTasks(data)
    } catch (error) {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId)
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? updatedTask : task
        )
      )
      toast.success('Task updated')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
      toast.success('Task deleted')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const getFilteredTasks = () => {
    let filtered = tasks

    switch (filter) {
      case 'completed':
        filtered = tasks.filter(task => task.completed)
        break
      case 'pending':
        filtered = tasks.filter(task => !task.completed)
        break
      case 'overdue':
        filtered = tasks.filter(task => !task.completed && isPast(new Date(task.dueDate)))
        break
      case 'today':
        filtered = tasks.filter(task => !task.completed && isToday(new Date(task.dueDate)))
        break
      default:
        filtered = tasks
    }

    return limit ? filtered.slice(0, limit) : filtered
  }

  const getPriorityVariant = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const getDateDisplay = (dueDate) => {
    const date = new Date(dueDate)
    
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return 'Overdue'
    return format(date, 'MMM d')
  }

  const getDateColor = (dueDate, completed) => {
    if (completed) return 'text-gray-400'
    
    const date = new Date(dueDate)
    if (isPast(date)) return 'text-error'
    if (isToday(date)) return 'text-warning'
    return 'text-gray-600'
  }

  const filteredTasks = getFilteredTasks()

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="flex items-center space-x-2">
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                  <div className="h-5 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredTasks.length === 0) {
    return (
      <EmptyState
        icon="CheckSquare"
        title="No tasks found"
        description="No tasks match the current filter criteria"
      />
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.05 }}
            className={`
              bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200
              ${task.completed ? 'opacity-75' : ''}
            `}
          >
            <div className="flex items-start space-x-3">
              <button
                onClick={() => handleToggleComplete(task.id)}
                className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                  ${task.completed 
                    ? 'bg-success border-success text-white' 
                    : 'border-gray-300 hover:border-primary'
                  }
                `}
              >
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <ApperIcon name="Check" size={14} />
                  </motion.div>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <h4 className={`
                  font-medium mb-1 
                  ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}
                `}>
                  {task.title}
                </h4>
                
                {task.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityVariant(task.priority)} size="sm">
                      {task.priority}
                    </Badge>
                    <span className={`text-sm font-medium ${getDateColor(task.dueDate, task.completed)}`}>
                      {getDateDisplay(task.dueDate)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{task.assignedTo}</span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-gray-400 hover:text-error transition-colors p-1"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList