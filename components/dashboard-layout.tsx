"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { LogOut, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

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
      <header className="relative border-b border-white/10 bg-background/50 backdrop-blur-sm z-10">
        <div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"
          style={{ boxShadow: "0 0 10px 0 var(--secondary)" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/josh-logo.jpg"
                  alt="JOSH Logo"
                  width={48}
                  height={48}
                  className="h-12 w-auto rounded-full border-2 border-secondary/50"
                />
                <h1 className="text-2xl font-bold text-emboss golden-glow tracking-wider">District Culturals 2025</h1>
              </div>
              {userRole === "admin" && (
                <span
                  className="px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary
                             bg-secondary/10 rounded-full border border-secondary/30
                             backdrop-filter backdrop-blur-sm shadow-lg shadow-secondary/10"
                >
                  Admin
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 opacity-80">
                <p className="text-sm text-muted-foreground">Powered by</p>
                <Image src="/seion-logo-new.png" alt="SEION Logo" width={80} height={20} className="h-5 w-auto" />
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isLoggingOut} className="group">
                <LogOut className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-75" />
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-emboss golden-glow tracking-wide">{title}</h2>
        </div>
        {children}
      </main>
    </div>
  )
}
