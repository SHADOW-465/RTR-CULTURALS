import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile to determine redirect
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (profile?.role === "admin") {
    redirect("/dashboard/admin")
  } else if (profile?.role === "regcom") {
    redirect("/dashboard/regcom")
  } else if (profile?.role?.startsWith("group")) {
    redirect("/dashboard/group")
  } else {
    redirect("/auth/login")
  }
}
