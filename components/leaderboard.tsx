import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Club {
  id: string
  name: string
  achieved_registrations: number
}

interface LeaderboardProps {
  title: string
  clubs: Club[]
}

export function Leaderboard({ title, clubs }: LeaderboardProps) {
  const sortedClubs = [...clubs]
    .sort((a, b) => b.achieved_registrations - a.achieved_registrations)
    .slice(0, 5) // Show top 5

  const rankIcons = [
    <Trophy className="w-5 h-5 text-secondary" />,
    <Award className="w-5 h-5 text-primary" />,
    <Star className="w-5 h-5 text-white/70" />,
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-secondary golden-glow">
          <Trophy className="w-6 h-6 mr-3" />
          <span className="text-xl">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedClubs.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No data available yet.</p>
        ) : (
          <ol className="space-y-3">
            {sortedClubs.map((club, index) => (
              <li
                key={club.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-all duration-300",
                  {
                    "bg-secondary/20 border-secondary/50 shadow-lg shadow-secondary/10 transform scale-105": index === 0,
                    "bg-primary/15 border-primary/30": index === 1,
                    "bg-white/10 border-white/20": index === 2,
                    "bg-black/20 border-white/10": index > 2,
                  }
                )}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/30">
                    {rankIcons[index] || <span className="font-bold text-sm">{index + 1}</span>}
                  </div>
                  <span className="font-semibold text-foreground">{club.name}</span>
                </div>
                <span className="font-bold text-2xl golden-glow">{club.achieved_registrations}</span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
