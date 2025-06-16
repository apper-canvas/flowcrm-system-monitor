import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const [profileData, setProfileData] = useState({
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    role: 'Sales Manager',
    department: 'Sales'
  })

  const [pipelineStages, setPipelineStages] = useState([
    { id: 1, name: 'New', color: '#6B7280' },
    { id: 2, name: 'Qualified', color: '#3B82F6' },
    { id: 3, name: 'Proposal', color: '#F59E0B' },
    { id: 4, name: 'Negotiation', color: '#EF4444' },
    { id: 5, name: 'Closed Won', color: '#10B981' },
    { id: 6, name: 'Closed Lost', color: '#6B7280' }
  ])

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'John Smith', email: 'john.smith@company.com', role: 'Sales Manager', active: true },
    { id: 2, name: 'Emily Davis', email: 'emily.davis@company.com', role: 'Sales Rep', active: true },
    { id: 3, name: 'Mark Wilson', email: 'mark.wilson@company.com', role: 'Sales Rep', active: true }
  ])

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskReminders: true,
    leadUpdates: true,
    weeklyReports: false,
    systemAlerts: true
  })

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSavePipeline = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Pipeline stages updated successfully')
    } catch (error) {
      toast.error('Failed to update pipeline stages')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Notification preferences updated successfully')
    } catch (error) {
      toast.error('Failed to update notification preferences')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'pipeline', label: 'Pipeline', icon: 'GitBranch' },
    { id: 'team', label: 'Team', icon: 'Users' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' }
  ]

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account, team, and application preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <ApperIcon name={tab.icon} size={18} className="mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
                  <p className="text-gray-600 mb-6">Update your personal information and contact details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                  
                  <Input
                    label="Phone Number"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  
                  <Input
                    label="Role"
                    value={profileData.role}
                    onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={profileData.department}
                    onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full md:w-64 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Support">Support</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button onClick={handleSaveProfile} loading={saving}>
                    Save Profile
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Pipeline Settings */}
            {activeTab === 'pipeline' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Pipeline Stages</h2>
                  <p className="text-gray-600 mb-6">Customize your sales pipeline stages and colors</p>
                </div>

                <div className="space-y-4">
                  {pipelineStages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500 w-8">{index + 1}.</span>
                        <input
                          type="color"
                          value={stage.color}
                          onChange={(e) => {
                            const newStages = [...pipelineStages]
                            newStages[index].color = e.target.value
                            setPipelineStages(newStages)
                          }}
                          className="w-8 h-8 rounded border border-gray-300"
                        />
                      </div>
                      
                      <Input
                        value={stage.name}
                        onChange={(e) => {
                          const newStages = [...pipelineStages]
                          newStages[index].name = e.target.value
                          setPipelineStages(newStages)
                        }}
                        className="flex-1"
                      />
                      
                      <button
                        onClick={() => {
                          setPipelineStages(prev => prev.filter((_, i) => i !== index))
                        }}
                        className="text-gray-400 hover:text-error transition-colors p-2"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  icon="Plus"
                  onClick={() => {
                    setPipelineStages(prev => [
                      ...prev,
                      { id: Date.now(), name: 'New Stage', color: '#6B7280' }
                    ])
                  }}
                >
                  Add Stage
                </Button>

                <div className="pt-4 border-t border-gray-200">
                  <Button onClick={handleSavePipeline} loading={saving}>
                    Save Pipeline
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Team Settings */}
            {activeTab === 'team' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Team Members</h2>
                    <p className="text-gray-600">Manage your team members and their roles</p>
                  </div>
                  <Button icon="UserPlus">
                    Add Member
                  </Button>
                </div>

                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600">{member.role}</span>
                        <div className="flex items-center space-x-1">
                          <span className={`w-2 h-2 rounded-full ${member.active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          <span className="text-sm text-gray-600">{member.active ? 'Active' : 'Inactive'}</span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <ApperIcon name="MoreHorizontal" size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                  <p className="text-gray-600 mb-6">Choose how you want to be notified about important updates</p>
                </div>

                <div className="space-y-6">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {key === 'emailNotifications' && 'Receive email notifications for all activities'}
                          {key === 'taskReminders' && 'Get reminders for upcoming task deadlines'}
                          {key === 'leadUpdates' && 'Notifications when leads change status'}
                          {key === 'weeklyReports' && 'Weekly summary reports via email'}
                          {key === 'systemAlerts' && 'Important system and security alerts'}
                        </p>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotifications(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button onClick={handleSaveNotifications} loading={saving}>
                    Save Preferences
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings