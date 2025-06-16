import { toast } from 'react-toastify'

const customerService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'email', 'phone', 'company', 'status', 'assigned_to', 'value', 'Tags', 'CreatedOn', 'ModifiedOn']
      }
      
      const response = await apperClient.fetchRecords('Customer1', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('Failed to load customers')
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
        fields: ['Name', 'email', 'phone', 'company', 'status', 'assigned_to', 'value', 'Tags', 'CreatedOn', 'ModifiedOn']
      }
      
      const response = await apperClient.getRecordById('Customer1', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error)
      return null
    }
  },

  async create(customerData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: customerData.name || customerData.Name,
          email: customerData.email,
          phone: customerData.phone,
          company: customerData.company,
          status: customerData.status,
          assigned_to: customerData.assignedTo || customerData.assigned_to,
          value: parseFloat(customerData.value) || 0
        }]
      }
      
      const response = await apperClient.createRecord('Customer1', params)
      
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
      console.error('Error creating customer:', error)
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
          Name: data.name || data.Name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          status: data.status,
          assigned_to: data.assignedTo || data.assigned_to,
          value: parseFloat(data.value) || 0
        }]
      }
      
      const response = await apperClient.updateRecord('Customer1', params)
      
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
      console.error('Error updating customer:', error)
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
      
      const response = await apperClient.deleteRecord('Customer1', params)
      
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
      console.error('Error deleting customer:', error)
      throw error
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'email', 'phone', 'company', 'status', 'assigned_to', 'value'],
        where: [
          {
            FieldName: 'Name',
            Operator: 'Contains',
            Values: [query]
          }
        ],
        whereGroups: [
          {
            operator: 'OR',
            SubGroups: [
              {
                conditions: [
                  {
                    FieldName: 'email',
                    Operator: 'Contains',
                    Values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    FieldName: 'company',
                    Operator: 'Contains',
                    Values: [query]
                  }
                ]
              }
            ]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('Customer1', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error searching customers:', error)
      return []
    }
  }
}

export default customerService