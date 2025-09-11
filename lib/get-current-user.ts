import { getUserFromSession } from "@/lib/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const sessionToken = cookies().get("session_token")?.value

  if (!sessionToken) {
    redirect("/auth/login")
  }

  const user = await getUserFromSession(sessionToken)

  if (!user) {
    redirect("/auth/login")
  }

  return user
}
