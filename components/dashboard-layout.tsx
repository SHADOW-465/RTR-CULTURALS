"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { LogOut, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import ParticleEffect from "./particle-effect"

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
    <div className="min-h-screen bg-background text-warm-white relative overflow-hidden">
      {/* Particle background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" id="particle-container" />
      <ParticleEffect />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Image src="/images/josh-logo.png" alt="JOSH Logo" width={48} height={48} className="soft-glow" />
                <h1 className="text-2xl font-bold text-gold soft-glow">JOSH District Culturals 2025</h1>
              </div>
              {userRole && (
                <span
                  className="px-4 py-2 text-sm font-medium rounded-full capitalize
                             bg-white/10 text-gold border border-gold/30
                             backdrop-filter backdrop-blur-sm shadow-lg"
                >
                  {userRole.replace(/(\\d+)/, " $1")}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">Powered by SEION </p>
                <Image src="/seion-logo-new.png" alt="SEION Logo" width={80} height={20} className="h-5 w-auto" />
              </div>
              <Button
                className="premium-button text-sm"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full h-0.5 bg-gradient-to-r from-primary-red-1 via-secondary-gold-1 to-accent-orange-1" />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10 relative">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gold soft-glow">{title}</h2>
        </div>
        {children}
      </main>
    </div>
  )
}