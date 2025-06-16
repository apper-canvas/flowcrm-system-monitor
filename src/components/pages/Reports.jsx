import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { leadService, customerService, taskService } from '@/services'

const Reports = () => {
  const [reportData, setReportData] = useState({
    leadsByStage: [],
    revenueByMonth: [],
    customersByStatus: [],
    taskCompletion: []
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('last30days')

  useEffect(() => {
    loadReportData()
  }, [dateRange])

  const loadReportData = async () => {
    setLoading(true)
    try {
      const [leads, customers, tasks] = await Promise.all([
        leadService.getAll(),
        customerService.getAll(),
        taskService.getAll()
      ])

      // Process leads by stage
      const stageData = {}
      leads.forEach(lead => {
        stageData[lead.stage] = (stageData[lead.stage] || 0) + 1
      })

      // Process revenue by month (mock data for demo)
      const revenueData = [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 61000 },
        { month: 'Apr', revenue: 58000 },
        { month: 'May', revenue: 67000 },
        { month: 'Jun', revenue: 73000 }
      ]

      // Process customers by status
      const statusData = {}
      customers.forEach(customer => {
        statusData[customer.status] = (statusData[customer.status] || 0) + 1
      })

      // Process task completion
      const completedTasks = tasks.filter(task => task.completed).length
      const totalTasks = tasks.length

      setReportData({
        leadsByStage: Object.entries(stageData).map(([stage, count]) => ({ stage, count })),
        revenueByMonth: revenueData,
        customersByStatus: Object.entries(statusData).map(([status, count]) => ({ status, count })),
        taskCompletion: { completed: completedTasks, total: totalTasks }
      })
    } catch (error) {
      console.error('Error loading report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = () => {
    // Mock export functionality
    const data = JSON.stringify(reportData, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crm-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Chart configurations
  const leadsPipelineChart = {
    options: {
      chart: {
        type: 'donut',
        toolbar: { show: false }
      },
      colors: ['#6366F1', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#6B7280'],
      labels: reportData.leadsByStage.map(item => item.stage),
      legend: {
        position: 'bottom',
        horizontalAlign: 'center'
      },
      plotOptions: {
        pie: {
          donut: {
            size: '60%'
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
    series: reportData.leadsByStage.map(item => item.count)
  }

  const revenueChart = {
    options: {
      chart: {
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      colors: ['#6366F1'],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1
        }
      },
      xaxis: {
        categories: reportData.revenueByMonth.map(item => item.month),
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          formatter: (val) => `$${(val / 1000).toFixed(0)}K`
        }
      },
      grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 3
      }
    },
    series: [{
      name: 'Revenue',
      data: reportData.revenueByMonth.map(item => item.revenue)
    }]
  }

  const customerStatusChart = {
    options: {
      chart: {
        type: 'bar',
        toolbar: { show: false }
      },
      colors: ['#10B981', '#F59E0B', '#EF4444'],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          columnWidth: '60%'
        }
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: reportData.customersByStatus.map(item => item.status),
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          formatter: (val) => Math.floor(val)
        }
      },
      grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 3
      }
    },
    series: [{
      name: 'Customers',
      data: reportData.customersByStatus.map(item => item.count)
    }]
  }

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
            <p className="text-gray-600">Analyze your sales performance and customer data</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last3months">Last 3 Months</option>
              <option value="last6months">Last 6 Months</option>
              <option value="lastyear">Last Year</option>
            </select>
            
            <Button onClick={handleExportReport} icon="Download">
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary to-secondary rounded-lg p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold">$356K</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">24.5%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Deal Size</p>
                <p className="text-2xl font-bold text-gray-900">$59K</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" size={24} className="text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Task Completion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.taskCompletion.total > 0 
                    ? Math.round((reportData.taskCompletion.completed / reportData.taskCompletion.total) * 100)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={24} className="text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leads Pipeline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Stage</h3>
            {reportData.leadsByStage.length > 0 ? (
              <Chart
                options={leadsPipelineChart.options}
                series={leadsPipelineChart.series}
                type="donut"
                height={300}
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </motion.div>

          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <Chart
              options={revenueChart.options}
              series={revenueChart.series}
              type="area"
              height={300}
            />
          </motion.div>

          {/* Customer Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customers by Status</h3>
            {reportData.customersByStatus.length > 0 ? (
              <Chart
                options={customerStatusChart.options}
                series={customerStatusChart.series}
                type="bar"
                height={300}
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <ApperIcon name="Users" size={20} className="text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">Total Customers</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {reportData.customersByStatus.reduce((sum, item) => sum + item.count, 0)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <ApperIcon name="Target" size={20} className="text-purple-600 mr-3" />
                  <span className="font-medium text-gray-900">Active Leads</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {reportData.leadsByStage.reduce((sum, item) => sum + item.count, 0)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <ApperIcon name="CheckSquare" size={20} className="text-green-600 mr-3" />
                  <span className="font-medium text-gray-900">Completed Tasks</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {reportData.taskCompletion.completed}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <ApperIcon name="Clock" size={20} className="text-orange-600 mr-3" />
                  <span className="font-medium text-gray-900">Average Response Time</span>
                </div>
                <span className="text-xl font-bold text-gray-900">2.4h</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Reports