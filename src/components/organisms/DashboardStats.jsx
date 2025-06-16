import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/molecules/MetricCard'
import { customerService, leadService, taskService } from '@/services'

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    conversionRate: 0,
    totalRevenue: 0,
    activeTasks: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [customers, leads, tasks] = await Promise.all([
          customerService.getAll(),
          leadService.getAll(),
          taskService.getAll()
        ])

        const closedWonLeads = leads.filter(lead => lead.stage === 'Closed Won')
        const conversionRate = leads.length > 0 ? Math.round((closedWonLeads.length / leads.length) * 100) : 0
        const totalRevenue = closedWonLeads.reduce((sum, lead) => sum + lead.value, 0)
        const activeTasks = tasks.filter(task => !task.completed).length

        setStats({
          totalLeads: leads.length,
          conversionRate,
          totalRevenue,
          activeTasks
        })
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const metrics = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      change: 12,
      changeType: 'positive',
      icon: 'Target',
      gradient: true
    },
    {
      title: 'Conversion Rate',
      value: stats.conversionRate,
      change: 5,
      changeType: 'positive',
      icon: 'TrendingUp'
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      change: 18,
      changeType: 'positive',
      icon: 'DollarSign'
    },
    {
      title: 'Active Tasks',
      value: stats.activeTasks,
      change: -3,
      changeType: 'negative',
      icon: 'CheckSquare'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MetricCard {...metric} />
        </motion.div>
      ))}
    </div>
  )
}

export default DashboardStats