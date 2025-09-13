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
          <p className="text-white/70 text-center py-4">No data available yet.</p>
        ) : (
          <ol className="space-y-4">
            {sortedClubs.map((club, index) => (
              <li
                key={club.id}
                className="grid grid-cols-[auto,1fr,auto] items-center gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50 border border-transparent hover:border-secondary/20"
              >
                <span className="font-bold text-lg text-muted-foreground w-6 text-center">{index + 1}</span>
                <span className="font-semibold text-foreground truncate" title={club.name}>
                  {club.name}
                </span>
                <span className="font-bold text-secondary text-xl tracking-wider">
                  {club.achieved_registrations}
                </span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
