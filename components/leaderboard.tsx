import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

interface Club {
  id: string
  name: string
  achieved_registrations: number
}

interface LeaderboardProps {
  title: string
  clubs: Club[]
  type: "college" | "community"
}

export function Leaderboard({ title, clubs, type }: LeaderboardProps) {
  const sortedClubs = [...clubs]
    .sort((a, b) => b.achieved_registrations - a.achieved_registrations)
    .slice(0, 5) // Show top 5

  const cardColorClass = type === "college" ? "bg-primary/10 border-primary/20" : "bg-accent/10 border-accent/20"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-secondary">
          <Trophy className="w-5 h-5 mr-2" />
          {title}
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
                className={`flex items-center justify-between p-3 rounded-lg border ${cardColorClass}`}
              >
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="secondary"
                    className="w-7 h-7 rounded-full p-0 flex items-center justify-center text-sm font-bold"
                  >
                    {index + 1}
                  </Badge>
                  <span className="font-medium text-foreground">{club.name}</span>
                </div>
                <span className="font-bold text-lg text-foreground">{club.achieved_registrations}</span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
