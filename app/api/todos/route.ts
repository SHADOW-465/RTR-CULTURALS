import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/get-current-user"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const supabase = await createServerClient()
    const { data: todos, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error (todos):", error)
      return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 })
    }

    return NextResponse.json({ data: todos }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { task } = await request.json()

    if (!task) {
      return NextResponse.json({ error: "Missing required field: task" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const { data: newTodo, error } = await supabase
      .from("todos")
      .insert({ task, user_id: user.id })
      .select()
      .single()

    if (error) {
      console.error("Database error (todos):", error)
      return NextResponse.json({ error: "Failed to create todo" }, { status: 500 })
    }

    return NextResponse.json({ data: newTodo }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
