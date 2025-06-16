import tasksData from '@/services/mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let tasks = [...tasksData]

const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.id === id)
    return task ? { ...task } : null
  },

  async create(taskData) {
    await delay(400)
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, data) {
    await delay(300)
    const index = tasks.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...data }
      return { ...tasks[index] }
    }
    throw new Error('Task not found')
  },

  async delete(id) {
    await delay(300)
    const index = tasks.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.splice(index, 1)
      return true
    }
    throw new Error('Task not found')
  },

  async toggleComplete(id) {
    await delay(200)
    const index = tasks.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], completed: !tasks[index].completed }
      return { ...tasks[index] }
    }
    throw new Error('Task not found')
  },

  async getOverdue() {
    await delay(200)
    const now = new Date()
    const overdue = tasks.filter(task => 
      !task.completed && 
      new Date(task.dueDate) < now
    )
    return [...overdue]
  }
}

export default taskService