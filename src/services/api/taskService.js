import { toast } from 'react-toastify'

const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'title', 'description', 'related_to', 'assigned_to', 'due_date', 'priority', 'completed', 'Tags', 'CreatedOn', 'ModifiedOn']
      }
      
      const response = await apperClient.fetchRecords('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to load tasks')
      return []
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: ['Name', 'title', 'description', 'related_to', 'assigned_to', 'due_date', 'priority', 'completed', 'Tags', 'CreatedOn', 'ModifiedOn']
      }
      
      const response = await apperClient.getRecordById('task', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error)
      return null
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: taskData.title || taskData.Name,
          title: taskData.title,
          description: taskData.description,
          related_to: taskData.relatedTo || taskData.related_to,
          assigned_to: taskData.assignedTo || taskData.assigned_to,
          due_date: taskData.dueDate || taskData.due_date,
          priority: taskData.priority || 'Medium',
          completed: taskData.completed || false
        }]
      }
      
      const response = await apperClient.createRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  },

  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: data.title || data.Name,
          title: data.title,
          description: data.description,
          related_to: data.relatedTo || data.related_to,
          assigned_to: data.assignedTo || data.assigned_to,
          due_date: data.dueDate || data.due_date,
          priority: data.priority,
          completed: data.completed
        }]
      }
      
      const response = await apperClient.updateRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  },

  async toggleComplete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // First get the current task to toggle its completed status
      const currentTask = await this.getById(id)
      if (!currentTask) {
        throw new Error('Task not found')
      }
      
      const params = {
        records: [{
          Id: parseInt(id),
          completed: !currentTask.completed
        }]
      }
      
      const response = await apperClient.updateRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
    } catch (error) {
      console.error('Error toggling task completion:', error)
      throw error
    }
  },

  async getOverdue() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const now = new Date().toISOString()
      
      const params = {
        Fields: ['Name', 'title', 'description', 'related_to', 'assigned_to', 'due_date', 'priority', 'completed'],
        where: [
          {
            FieldName: 'completed',
            Operator: 'ExactMatch',
            Values: [false]
          },
          {
            FieldName: 'due_date',
            Operator: 'LessThan',
            Values: [now]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('task', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching overdue tasks:', error)
      return []
    }
  }
}

export default taskService