"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { SnakeBorderCard } from "@/components/ui/snake-border-card"
import Image from "next/image"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Redirect based on role
      if (data.user.role === "admin") {
        router.push("/dashboard/admin")
      } else if (data.user.role === "regcom") {
        router.push("/dashboard/regcom")
      } else if (data.user.role.startsWith("group")) {
        router.push("/dashboard/group")
      } else {
        router.push("/dashboard")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <SnakeBorderCard>
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-secondary soft-glow">RID 3233 Culturals JOSH</CardTitle>
            <CardDescription>Registration Portal Login</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 text-sm text-destructive-foreground bg-destructive/20 border border-destructive/30 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Use your assigned username and password to access the portal
            </div>
            <div className="mt-6 text-center">
              <a
                href="https://www.seion.digital/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Powered by</span>
                <Image src="/seion-logo-new.png" alt="SEION Logo" width={80} height={20} className="h-5 w-auto" />
              </a>
            </div>
          </CardContent>
        </SnakeBorderCard>
      </div>
    </div>
  )
}
