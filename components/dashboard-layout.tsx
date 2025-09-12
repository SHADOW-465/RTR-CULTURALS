"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { BorderBeam } from "./ui/border-beam";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  userRole?: string;
}

export function DashboardLayout({
  children,
  title,
  userRole,
}: DashboardLayoutProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/auth/login");
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(220,20,60,0.2),transparent_40%)]"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,rgba(255,215,0,0.15),transparent_40%)]"></div>

      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Image
                  src="/josh-logo.jpg"
                  alt="JOSH Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto rounded-full border-2 border-secondary/50"
                />
                <h1 className="text-xl font-bold text-secondary soft-glow tracking-wider">
                  District Culturals 2025
                </h1>
              </div>
              {userRole && (
                <span
                  className="px-4 py-1.5 text-xs font-semibold bg-secondary/10 text-secondary rounded-full capitalize border border-secondary/20
                             shadow-[0_0_10px_rgba(255,215,0,0.4)] backdrop-blur-sm"
                >
                  {userRole.replace(/(\\d+)/, " $1")}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="hover:bg-primary/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary soft-glow">
            {title}
          </h2>
        </div>
        {children}
      </main>

      <footer className="relative mt-16 py-8 border-t border-border/50">
        <BorderBeam colorFrom="var(--primary)" colorTo="var(--secondary)" duration={5} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <p className="text-sm text-muted-foreground mr-2">Powered by</p>
          <Image
            src="/seion-logo-new.png"
            alt="SEION Logo"
            width={100}
            height={25}
            className="h-6 w-auto"
          />
        </div>
      </footer>
    </div>
  );
}
