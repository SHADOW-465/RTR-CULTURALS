"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { BorderBeam } from "./ui/border-beam";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface GroupStats {
  group_number: number;
  target_total: number;
  achieved_total: number;
  club_count: number;
}

interface GroupPerformanceCardProps {
  groups: GroupStats[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1 },
};

export function GroupPerformanceCard({ groups }: GroupPerformanceCardProps) {
    const shouldReduceMotion = useReducedMotion();
    const sortedGroups = [...groups].sort((a, b) => {
        const percentageA = a.target_total > 0 ? (a.achieved_total / a.target_total) * 100 : 0;
        const percentageB = b.target_total > 0 ? (b.achieved_total / b.target_total) * 100 : 0;
        return percentageB - percentageA;
    });

  return (
    <Card className="lg:col-span-1 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-secondary soft-glow">
          <Users className="w-6 h-6" />
          <span>Group Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-4"
          variants={!shouldReduceMotion ? containerVariants : undefined}
          initial={!shouldReduceMotion ? "hidden" : "show"}
          animate="show"
        >
          {sortedGroups.map((group, index) => {
            const percentage =
              group.target_total > 0
                ? Math.round((group.achieved_total / group.target_total) * 100)
                : 0;
            return (
              <motion.div
                key={group.group_number}
                variants={!shouldReduceMotion ? itemVariants : undefined}
                className="relative p-4 bg-muted/50 rounded-lg border border-border/50 space-y-2"
              >
                {index === 0 && !shouldReduceMotion && <BorderBeam duration={4} delay={0.5} />}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="outline"
                      className="border-secondary text-muted-foreground"
                    >
                      Group {group.group_number}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {group.club_count} clubs
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {group.achieved_total}/{group.target_total}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {group.target_total > 0
                        ? `${percentage}% complete`
                        : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3 mt-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}
