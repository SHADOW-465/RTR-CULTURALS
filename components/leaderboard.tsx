import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Club {
  id: string
  name: string
  achieved_registrations: number
  type: "college" | "community"
}

interface LeaderboardProps {
  title: string
  clubs: Club[]
  limit?: number
  type: "college" | "community"
}

export function Leaderboard({ title, clubs, limit = 3, type }: LeaderboardProps) {
  const sortedClubs = [...clubs]
    .sort((a, b) => b.achieved_registrations - a.achieved_registrations)
    .slice(0, limit)

  const leaderboardItemStyle =
    type === "college"
      ? "bg-primary/10 border-primary/20"
      : "bg-accent/10 border-accent/20"

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
          <ol className="space-y-2">
            {sortedClubs.map((club, index) => (
              <li
                key={club.id}
                className={`flex items-center justify-between p-2 rounded-md border ${leaderboardItemStyle}`}
              >
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="secondary"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {index + 1}
                  </Badge>
                  <span className="font-medium text-foreground">{club.name}</span>
                </div>
                <span className="font-bold text-foreground text-lg">{club.achieved_registrations}</span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
