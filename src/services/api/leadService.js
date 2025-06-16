import { toast } from 'react-toastify'

const leadService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'customer_id', 'customer_name', 'company', 'stage', 'value', 'probability', 'assigned_to', 'last_activity', 'email', 'phone', 'Tags', 'CreatedOn', 'ModifiedOn']
      }
      
      const response = await apperClient.fetchRecords('lead', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast.error('Failed to load leads')
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
        fields: ['Name', 'customer_id', 'customer_name', 'company', 'stage', 'value', 'probability', 'assigned_to', 'last_activity', 'email', 'phone', 'Tags', 'CreatedOn', 'ModifiedOn']
      }
      
      const response = await apperClient.getRecordById('lead', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching lead with ID ${id}:`, error)
      return null
    }
  },

  async create(leadData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: leadData.customerName || leadData.customer_name || leadData.Name,
          customer_id: leadData.customerId || leadData.customer_id || '',
          customer_name: leadData.customerName || leadData.customer_name,
          company: leadData.company,
          stage: leadData.stage || 'New',
          value: parseFloat(leadData.value) || 0,
          probability: parseInt(leadData.probability) || 25,
          assigned_to: leadData.assignedTo || leadData.assigned_to,
          last_activity: new Date().toISOString(),
          email: leadData.email,
          phone: leadData.phone
        }]
      }
      
      const response = await apperClient.createRecord('lead', params)
      
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
      console.error('Error creating lead:', error)
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
          Name: data.customerName || data.customer_name || data.Name,
          customer_id: data.customerId || data.customer_id,
          customer_name: data.customerName || data.customer_name,
          company: data.company,
          stage: data.stage,
          value: parseFloat(data.value) || 0,
          probability: parseInt(data.probability) || 0,
          assigned_to: data.assignedTo || data.assigned_to,
          last_activity: new Date().toISOString(),
          email: data.email,
          phone: data.phone
        }]
      }
      
      const response = await apperClient.updateRecord('lead', params)
      
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
      console.error('Error updating lead:', error)
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
      
      const response = await apperClient.deleteRecord('lead', params)
      
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
      console.error('Error deleting lead:', error)
      throw error
    }
  },

  async updateStage(id, newStage) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Id: parseInt(id),
          stage: newStage,
          last_activity: new Date().toISOString()
        }]
      }
      
      const response = await apperClient.updateRecord('lead', params)
      
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
      console.error('Error updating lead stage:', error)
      throw error
    }
  },

  async getByStage(stage) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'customer_id', 'customer_name', 'company', 'stage', 'value', 'probability', 'assigned_to', 'last_activity', 'email', 'phone'],
        where: [
          {
            FieldName: 'stage',
            Operator: 'ExactMatch',
            Values: [stage]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('lead', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching leads by stage:', error)
      return []
    }
  }
}

export default leadService