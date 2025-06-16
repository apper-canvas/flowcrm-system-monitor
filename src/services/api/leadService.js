import leadsData from '@/services/mockData/leads.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let leads = [...leadsData]

const leadService = {
  async getAll() {
    await delay(300)
    return [...leads]
  },

  async getById(id) {
    await delay(200)
    const lead = leads.find(l => l.id === id)
    return lead ? { ...lead } : null
  },

  async create(leadData) {
    await delay(400)
    const newLead = {
      ...leadData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    }
    leads.push(newLead)
    return { ...newLead }
  },

  async update(id, data) {
    await delay(300)
    const index = leads.findIndex(l => l.id === id)
    if (index !== -1) {
      leads[index] = { ...leads[index], ...data, lastActivity: new Date().toISOString() }
      return { ...leads[index] }
    }
    throw new Error('Lead not found')
  },

  async delete(id) {
    await delay(300)
    const index = leads.findIndex(l => l.id === id)
    if (index !== -1) {
      leads.splice(index, 1)
      return true
    }
    throw new Error('Lead not found')
  },

  async updateStage(id, newStage) {
    await delay(250)
    const index = leads.findIndex(l => l.id === id)
    if (index !== -1) {
      leads[index] = { 
        ...leads[index], 
        stage: newStage, 
        lastActivity: new Date().toISOString() 
      }
      return { ...leads[index] }
    }
    throw new Error('Lead not found')
  },

  async getByStage(stage) {
    await delay(200)
    const filtered = leads.filter(lead => lead.stage === stage)
    return [...filtered]
  }
}

export default leadService