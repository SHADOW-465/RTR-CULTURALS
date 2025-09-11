import { createServerClient } from "@/lib/supabase/server"

export interface User {
  id: string
  username: string
  email: string
  role: string
  group_name: string
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const supabase = await createServerClient()

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single()

  if (error || !user) {
    return null
  }

  return user
}

export async function createSession(userId: string): Promise<string> {
  const supabase = await createServerClient()
  const sessionToken = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await supabase.from("user_sessions").insert({
    user_id: userId,
    session_token: sessionToken,
    expires_at: expiresAt.toISOString(),
  })

  return sessionToken
}

export async function getUserFromSession(sessionToken: string): Promise<User | null> {
  const supabase = await createServerClient()

  const { data: session, error } = await supabase
    .from("user_sessions")
    .select(`
      user_id,
      expires_at,
      users (*)
    `)
    .eq("session_token", sessionToken)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (error || !session || !session.users) {
    return null
  }

  return session.users as User
}

export async function deleteSession(sessionToken: string): Promise<void> {
  const supabase = await createServerClient()

  await supabase.from("user_sessions").delete().eq("session_token", sessionToken)
}

export function hasPermission(userRole: string, action: string, groupNumber?: number): boolean {
  switch (userRole) {
    case "admin":
      // Admin has view-only access to all data
      return action === "view"

    case "regcom":
      // RegCom can view all and add/edit external clubs
      return true

    case "group1":
    case "group2":
    case "group3":
    case "group4":
    case "group5":
      // Group users can add/edit clubs within their group only
      const userGroupNumber = Number.parseInt(userRole.replace("group", ""))
      return groupNumber === userGroupNumber || action === "view"

    default:
      return false
  }
}
