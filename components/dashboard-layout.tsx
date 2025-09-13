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
    <div className="min-h-screen text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Image src="/Josh Final Logo.png" alt="JOSH Logo" width={40} height={40} className="h-10 w-auto" />
                <h1 className="text-xl font-bold text-secondary soft-glow">District Culturals 2025</h1>
              </div>
              {userRole && (
                <span className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary-foreground rounded-full capitalize border border-primary/30">
                  {userRole.replace(/(\\d+)/, " $1")}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.seion.digital/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <p className="text-sm text-muted-foreground">Powered by SEION</p>
                <Image src="/seion-logo-new.png" alt="SEION Logo" width={80} height={20} className="h-5 w-auto" />
              </a>
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
          <h2 className="text-3xl font-bold text-secondary soft-glow">{title}</h2>
        </div>
        {children}
      </main>
      <footer className="border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center items-center">
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
      </footer>
    </div>
  )
}
