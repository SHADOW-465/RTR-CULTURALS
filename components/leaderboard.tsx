import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"

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
                className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-muted"
              >
                <div className="flex items-center">
                  <span className="text-lg font-bold w-8 text-center text-muted-foreground">{index + 1}</span>
                  <span className="font-medium text-foreground">{club.name}</span>
                </div>
                <span className="font-bold text-primary text-lg">{club.achieved_registrations}</span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
