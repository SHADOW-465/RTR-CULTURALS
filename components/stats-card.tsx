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
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium uppercase tracking-wider">{title}</CardTitle>
          {subtitle && <p className="text-xs text-muted-foreground/80">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-3 bg-secondary/10 rounded-lg shadow-inner shadow-secondary/10">
            <Icon className="h-6 w-6 text-secondary" />
          </div>
        )}
      </CardHeader>
      <CardContent className="mt-2">
        <div className="text-4xl font-bold golden-glow">{value}</div>
        {trend && (
          <div className="flex items-center mt-2">
            <span className={`text-xs font-medium ${trend.isPositive ? "text-green-400" : "text-red-400"}`}>
              {trend.isPositive ? "▲" : "▼"} {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-2">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
