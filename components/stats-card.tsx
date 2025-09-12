"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/ui/border-beam";
import { motion } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  glowing?: boolean;
  suffix?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  glowing = false,
  suffix,
}: StatsCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={!shouldReduceMotion ? { scale: 1.05, y: -5 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative"
    >
      <Card
        className={cn(
          "bg-card/80 backdrop-blur-sm transition-all duration-300 ease-in-out",
          "hover:bg-card/90 hover:shadow-2xl hover:shadow-primary/20",
          className
        )}
      >
        {glowing && (
          <BorderBeam
            colorFrom="var(--secondary)"
            colorTo="var(--primary)"
            duration={4}
          />
        )}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-secondary soft-glow flex items-baseline">
            <AnimatedCounter value={value} />
            {suffix && <span className="text-2xl">{suffix}</span>}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {trend.isPositive ? "▲" : "▼"} {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                from last month
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
