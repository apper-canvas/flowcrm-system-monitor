import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardStats from '@/components/organisms/DashboardStats'
import TaskList from '@/components/organisms/TaskList'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { leadService, communicationService } from '@/services'

const Dashboard = () => {
  const [recentActivity, setRecentActivity] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [communications] = await Promise.all([
        communicationService.getAll()
      ])

      // Get recent activity (last 5 communications)
      const sortedComms = communications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
      
      setRecentActivity(sortedComms)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'call': return 'Phone'
      case 'email': return 'Mail'
      case 'meeting': return 'Calendar'
      default: return 'MessageCircle'
    }
  }

  const getActivityColor = (type) => {
    switch (type.toLowerCase()) {
      case 'call': return 'text-blue-600 bg-blue-50'
      case 'email': return 'text-green-600 bg-green-50'
      case 'meeting': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your sales.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" icon="Download">
              Export Report
            </Button>
            <Button icon="Plus">
              Quick Add
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <DashboardStats />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-start space-x-3 animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        <ApperIcon name={getActivityIcon(activity.type)} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 truncate">
                            {activity.subject}
                          </p>
                          <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {activity.notes}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          by {activity.createdBy}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tasks Widget */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Today's Tasks</h2>
                <Button variant="ghost" size="sm" icon="Plus">
                  Add Task
                </Button>
              </div>
              <TaskList filter="today" limit={5} />
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="secondary" 
                  className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-white/30"
                  icon="UserPlus"
                >
                  Add New Customer
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-white/30"
                  icon="Target"
                >
                  Create Lead
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-white/30"
                  icon="Calendar"
                >
                  Schedule Meeting
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard