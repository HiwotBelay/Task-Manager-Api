import { type NextRequest, NextResponse } from "next/server"
import { taskStorage } from "@/lib/storage"

// GET /api/tasks - Return all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter")

    const tasks = taskStorage.getFilteredTasks(filter || undefined)
    const counts = taskStorage.getTaskCount()

    return NextResponse.json({
      success: true,
      tasks,
      counts,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

// POST /api/tasks - Add a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title } = body

    // Validation: title must not be empty
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required and must not be empty" }, { status: 400 })
    }

    // Create new task
    const newTask = taskStorage.addTask(title)

    return NextResponse.json(
      {
        success: true,
        task: newTask,
        message: "Task created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON or server error" }, { status: 400 })
  }
}
