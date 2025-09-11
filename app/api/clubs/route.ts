import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, group_number, target_registrations, achieved_registrations } = body

    if (!name || !type || !group_number) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Insert into clubs table
    const { data: clubData, error: clubError } = await supabase
      .from("clubs")
      .insert({ name, type, group_number })
      .select()
      .single()

    if (clubError) {
      console.error("Database error (clubs):", clubError)
      return NextResponse.json({ error: "Failed to create club" }, { status: 500 })
    }

    // Insert into club_registrations table
    const { error: registrationError } = await supabase.from("club_registrations").insert({
      club_id: clubData.id,
      target_registrations: target_registrations || 0,
      achieved_registrations: achieved_registrations || 0,
    })

    if (registrationError) {
      console.error("Database error (registrations):", registrationError)
      // Rollback club creation? For now, just return an error.
      return NextResponse.json({ error: "Failed to create club registration data" }, { status: 500 })
    }

    return NextResponse.json({ data: clubData }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, type, group_number, target_registrations, achieved_registrations } = body

    if (!id || !name || !type || !group_number) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Update clubs table
    const { data: clubData, error: clubError } = await supabase
      .from("clubs")
      .update({ name, type, group_number })
      .eq("id", id)
      .select()
      .single()

    if (clubError) {
      console.error("Database error (clubs):", clubError)
      return NextResponse.json({ error: "Failed to update club" }, { status: 500 })
    }

    // Update club_registrations table
    const { error: registrationError } = await supabase
      .from("club_registrations")
      .update({
        target_registrations: target_registrations || 0,
        achieved_registrations: achieved_registrations || 0,
      })
      .eq("club_id", id)

    if (registrationError) {
      console.error("Database error (registrations):", registrationError)
      return NextResponse.json({ error: "Failed to update club registration data" }, { status: 500 })
    }

    return NextResponse.json({ data: clubData }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
