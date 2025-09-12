import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("glow-pulse-effect", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-warm-white/90">{title}</CardTitle>
        {Icon && (
          <div className="p-2 bg-primary-red-2/20 rounded-full" style={{ filter: "drop-shadow(0 0 5px var(--primary-red-1))" }}>
            <Icon className="h-5 w-5 text-secondary-gold-1" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-gold soft-glow">{value}</div>
        {subtitle && <p className="text-xs text-warm-white/70 mt-1">{subtitle}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={`text-xs font-medium ${trend.isPositive ? "text-green-400" : "text-red-400"}`}>
              {trend.isPositive ? "▲" : "▼"} {trend.value}%
            </span>
            <span className="text-xs text-warm-white/60 ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
