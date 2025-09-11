import { deleteSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const sessionToken = cookies().get("session_token")?.value

    if (sessionToken) {
      await deleteSession(sessionToken)
    }

    // Clear session cookie
    cookies().delete("session_token")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
