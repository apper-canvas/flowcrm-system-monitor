import communicationsData from '@/services/mockData/communications.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let communications = [...communicationsData]

const communicationService = {
  async getAll() {
    await delay(300)
    return [...communications]
  },

  async getById(id) {
    await delay(200)
    const communication = communications.find(c => c.id === id)
    return communication ? { ...communication } : null
  },

  async create(communicationData) {
    await delay(400)
    const newCommunication = {
      ...communicationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    communications.push(newCommunication)
    return { ...newCommunication }
  },

  async update(id, data) {
    await delay(300)
    const index = communications.findIndex(c => c.id === id)
    if (index !== -1) {
      communications[index] = { ...communications[index], ...data }
      return { ...communications[index] }
    }
    throw new Error('Communication not found')
  },

  async delete(id) {
    await delay(300)
    const index = communications.findIndex(c => c.id === id)
    if (index !== -1) {
      communications.splice(index, 1)
      return true
    }
    throw new Error('Communication not found')
  },

  async getByRelatedTo(relatedId) {
    await delay(200)
    const filtered = communications.filter(comm => comm.relatedTo === relatedId)
    return [...filtered]
  }
}

export default communicationService