// Shared in-memory storage for tasks
export interface Task {
  id: number
  title: string
  completed: boolean
  createdAt: string
}

// Create a singleton instance that will be shared across all API routes
class TaskStorage {
  private tasks: Task[] = []
  private nextId = 1

  getAllTasks(): Task[] {
    return [...this.tasks]
  }

  getFilteredTasks(filter?: string): Task[] {
    if (filter === "completed") {
      return this.tasks.filter((task) => task.completed)
    } else if (filter === "pending") {
      return this.tasks.filter((task) => !task.completed)
    }
    return [...this.tasks]
  }

  addTask(title: string): Task {
    const newTask: Task = {
      id: this.nextId++,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    this.tasks.push(newTask)
    return newTask
  }

  findTaskById(id: number): Task | undefined {
    return this.tasks.find((task) => task.id === id)
  }

  updateTask(id: number): Task | null {
    const task = this.findTaskById(id)
    if (!task) return null

    task.completed = !task.completed
    return task
  }

  deleteTask(id: number): Task | null {
    const taskIndex = this.tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) return null

    const deletedTask = this.tasks.splice(taskIndex, 1)[0]
    return deletedTask
  }

  getTaskCount() {
    return {
      total: this.tasks.length,
      completed: this.tasks.filter((t) => t.completed).length,
      pending: this.tasks.filter((t) => !t.completed).length,
    }
  }
}

// Export a single instance to be used across all API routes
export const taskStorage = new TaskStorage()
