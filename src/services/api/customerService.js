import customersData from '@/services/mockData/customers.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let customers = [...customersData]

const customerService = {
  async getAll() {
    await delay(300)
    return [...customers]
  },

  async getById(id) {
    await delay(200)
    const customer = customers.find(c => c.id === id)
    return customer ? { ...customer } : null
  },

  async create(customerData) {
    await delay(400)
    const newCustomer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    customers.push(newCustomer)
    return { ...newCustomer }
  },

  async update(id, data) {
    await delay(300)
    const index = customers.findIndex(c => c.id === id)
    if (index !== -1) {
      customers[index] = { ...customers[index], ...data }
      return { ...customers[index] }
    }
    throw new Error('Customer not found')
  },

  async delete(id) {
    await delay(300)
    const index = customers.findIndex(c => c.id === id)
    if (index !== -1) {
      customers.splice(index, 1)
      return true
    }
    throw new Error('Customer not found')
  },

  async search(query) {
    await delay(200)
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(query.toLowerCase()) ||
      customer.email.toLowerCase().includes(query.toLowerCase()) ||
      customer.company.toLowerCase().includes(query.toLowerCase())
    )
    return [...filtered]
  }
}

export default customerService