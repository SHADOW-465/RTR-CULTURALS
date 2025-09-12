import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/get-current-user"
import { createServerClient } from "@/lib/supabase/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = params
    const { task, is_completed } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const { data: updatedTodo, error } = await supabase
      .from("todos")
      .update({ task, is_completed })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Database error (todos):", error)
      return NextResponse.json({ error: "Failed to update todo" }, { status: 500 })
    }

    return NextResponse.json({ data: updatedTodo }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = params

    if (!id) {
        return NextResponse.json({ error: "Missing required field: id" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const { error } = await supabase.from("todos").delete().eq("id", id)

    if (error) {
      console.error("Database error (todos):", error)
      return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
