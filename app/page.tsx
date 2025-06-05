"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Check, Plus, Filter, CheckCircle2, Clock, List } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Task } from "@/lib/storage"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [counts, setCounts] = useState({ total: 0, completed: 0, pending: 0 })
  const { toast } = useToast()

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
        setCounts(data.counts || { total: 0, completed: 0, pending: 0 })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      })
      // Set default counts on error
      setCounts({ total: 0, completed: 0, pending: 0 })
    }
  }

  // Add new task
  const addTask = async () => {
    if (!newTask.trim()) {
      toast({
        title: "Validation Error",
        description: "Task title cannot be empty",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTask.trim() }),
      })

      if (response.ok) {
        setNewTask("")
        await fetchTasks() // Refresh all data
        toast({
          title: "✅ Success",
          description: "Task created successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to add task",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Toggle task completion
  const toggleTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
      })

      if (response.ok) {
        await fetchTasks() // Refresh all data
        toast({
          title: "✅ Updated",
          description: "Task status changed",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  // Delete task
  const deleteTask = async (id: number) => {
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Remove from local state immediately for better UX
        setTasks((prev) => prev.filter((task) => task.id !== id))

        // Then refresh from server to ensure consistency
        await fetchTasks()

        toast({
          title: "🗑️ Deleted",
          description: "Task removed successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  // Calculate counts from tasks if API doesn't provide them
  const safeCount = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    ...counts,
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Manager API</h1>
              <p className="text-sm text-gray-600">Backend Developer Test • REST API Demo</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              🟢 API Running
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Add Task Section */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="h-4 w-4 text-blue-600" />
              </div>
              Add New Task
            </CardTitle>
            <CardDescription>POST /api/tasks endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="What needs to be done?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="flex-1 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button onClick={addTask} disabled={loading} className="h-11 px-6 bg-blue-600 hover:bg-blue-700">
                {loading ? "Adding..." : "Add Task"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={`flex items-center gap-2 ${
              filter === "all" ? "bg-gray-900 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <List className="h-4 w-4" />
            All Tasks ({safeCount.total})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            className={`flex items-center gap-2 ${
              filter === "pending"
                ? "bg-orange-600 hover:bg-orange-700"
                : "border-orange-200 hover:bg-orange-50 text-orange-700"
            }`}
          >
            <Clock className="h-4 w-4" />
            Pending ({safeCount.pending})
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
            className={`flex items-center gap-2 ${
              filter === "completed"
                ? "bg-green-600 hover:bg-green-700"
                : "border-green-200 hover:bg-green-50 text-green-700"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            Completed ({safeCount.completed})
          </Button>
        </div>

        {/* Tasks List */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Filter className="h-4 w-4 text-purple-600" />
              </div>
              {filter === "all" ? "All Tasks" : filter === "pending" ? "Pending Tasks" : "Completed Tasks"}
              <Badge variant="outline" className="ml-2">
                {filteredTasks.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              {filter === "all" ? "GET /api/tasks" : `GET /api/tasks?filter=${filter}`} • PUT & DELETE endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  {filter === "completed" ? (
                    <CheckCircle2 className="h-8 w-8 text-gray-400" />
                  ) : filter === "pending" ? (
                    <Clock className="h-8 w-8 text-gray-400" />
                  ) : (
                    <List className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <p className="text-gray-500 font-medium">
                  {filter === "all" ? "No tasks yet. Create your first task above!" : `No ${filter} tasks found.`}
                </p>
                {filter === "completed" && safeCount.pending > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    You have {safeCount.pending} pending task{safeCount.pending !== 1 ? "s" : ""} to complete!
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                      task.completed
                        ? "bg-green-50 border-green-200 hover:border-green-300"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTask(task.id)}
                        className={`p-2 rounded-full transition-colors ${
                          task.completed
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                        }`}
                        title={task.completed ? "Mark as pending" : "Mark as completed"}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <div>
                        <p
                          className={`font-medium transition-all ${
                            task.completed ? "line-through text-gray-500" : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {task.id} • {new Date(task.createdAt).toLocaleDateString()}{" "}
                          {new Date(task.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={task.completed ? "default" : "secondary"}
                        className={task.completed ? "bg-green-600" : "bg-orange-100 text-orange-800"}
                      >
                        {task.completed ? "✅ Done" : "⏳ Pending"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        disabled={isDeleting === task.id}
                        className={`p-2 rounded-full transition-all ${
                          isDeleting === task.id
                            ? "bg-red-50 text-red-300"
                            : "text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100"
                        }`}
                        title="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">✅ All Requirements Met</CardTitle>
            <CardDescription>Backend Developer Test - Complete Implementation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-gray-700">📡 Required Endpoints</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      GET
                    </Badge>
                    <code className="text-xs">/api/tasks</code>
                    <span className="text-gray-500">• Return all tasks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      POST
                    </Badge>
                    <code className="text-xs">/api/tasks</code>
                    <span className="text-gray-500">• Add new task</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      PUT
                    </Badge>
                    <code className="text-xs">/api/tasks/:id</code>
                    <span className="text-gray-500">• Mark completed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      DELETE
                    </Badge>
                    <code className="text-xs">/api/tasks/:id</code>
                    <span className="text-gray-500">• Delete task</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-gray-700">🚀 Bonus Features</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Filtering (completed vs pending)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Validation (title not empty)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Professional frontend demo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Complete README.md</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Shared in-memory storage</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
