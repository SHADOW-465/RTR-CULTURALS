"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { LogOut, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  userRole?: string
}

export function DashboardLayout({ children, title, userRole }: DashboardLayoutProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Force redirect even if API call fails
      router.push("/auth/login")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-8 h-8 text-secondary" />
                <h1 className="text-xl font-bold text-secondary">JOSH District Culturals 2025</h1>
              </div>
              {userRole && (
                <span className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary-foreground rounded-full capitalize border border-primary/30">
                  {userRole.replace(/(\\d+)/, " $1")}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut className="w-4 h-4 mr-2" />
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-secondary">{title}</h2>
        </div>
        {children}
      </main>
    </div>
  )
}
