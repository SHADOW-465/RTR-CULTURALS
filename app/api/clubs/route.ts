import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, group_number, estimated_count, actual_count } = body

    if (!name || !type || !group_number) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("clubs")
      .insert({
        name,
        type,
        group_number,
        estimated_count: estimated_count || 0,
        actual_count: actual_count || 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create club" }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
