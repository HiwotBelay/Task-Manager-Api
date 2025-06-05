import { type NextRequest, NextResponse } from "next/server"
import { taskStorage } from "@/lib/storage"

// PUT /api/tasks/:id - Mark a task as completed (toggle)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskId = Number.parseInt(params.id)

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    const updatedTask = taskStorage.updateTask(taskId)

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      task: updatedTask,
      message: `Task marked as ${updatedTask.completed ? "completed" : "pending"}`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// DELETE /api/tasks/:id - Delete a task
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskId = Number.parseInt(params.id)

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    const deletedTask = taskStorage.deleteTask(taskId)

    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      task: deletedTask,
      message: "Task deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
