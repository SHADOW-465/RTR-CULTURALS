"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { BorderBeam } from "./ui/border-beam";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface Club {
  id: string;
  name: string;
  type: string;
  group_number: number;
  achieved_registrations: number;
}

interface TopPerformersCardProps {
  collegeClubs: Club[];
  communityClubs: Club[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export function TopPerformersCard({
  collegeClubs,
  communityClubs,
}: TopPerformersCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Card className="lg:col-span-1 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-secondary soft-glow">
          <Trophy className="w-6 h-6" />
          <span>Top Performers</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-6"
          variants={!shouldReduceMotion ? containerVariants : undefined}
          initial={!shouldReduceMotion ? "hidden" : "show"}
          animate="show"
        >
          <div>
            <h4 className="font-medium text-foreground mb-3">
              Top College-Based Clubs
            </h4>
            <motion.div className="space-y-2" variants={!shouldReduceMotion ? containerVariants : undefined}>
              {collegeClubs.map((club, index) => (
                <motion.div key={club.id} variants={!shouldReduceMotion ? itemVariants : undefined} className="relative">
                  {index === 0 && !shouldReduceMotion && <BorderBeam duration={3} delay={1} />}
                  <div
                    className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant="secondary"
                        className="w-7 h-7 rounded-full p-0 flex items-center justify-center text-sm font-bold"
                      >
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="font-semibold text-sm">{club.name}</div>
                        <Badge
                          variant="outline"
                          className="text-xs border-secondary/50 text-muted-foreground"
                        >
                          Group {club.group_number}
                        </Badge>
                      </div>
                    </div>
                    <div className="font-bold text-lg text-secondary soft-glow">
                      {club.achieved_registrations}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-3">
              Top Community-Based Clubs
            </h4>
            <motion.div className="space-y-2" variants={containerVariants}>
              {communityClubs.map((club, index) => (
                <motion.div key={club.id} variants={itemVariants} className="relative">
                   {index === 0 && <BorderBeam duration={3} delay={1.5} colorFrom="var(--accent)" colorTo="var(--secondary)" />}
                  <div
                    className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant="secondary"
                        className="w-7 h-7 rounded-full p-0 flex items-center justify-center text-sm font-bold"
                      >
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="font-semibold text-sm">{club.name}</div>
                        <Badge
                          variant="outline"
                          className="text-xs border-secondary/50 text-muted-foreground"
                        >
                          Group {club.group_number}
                        </Badge>
                      </div>
                    </div>
                    <div className="font-bold text-lg text-secondary soft-glow">
                      {club.achieved_registrations}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
