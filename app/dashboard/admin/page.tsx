import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/get-current-user"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Trophy, Calendar, Clock } from "lucide-react"

interface GroupStats {
  group_number: number
  estimated_total: number
  actual_total: number
  club_count: number
}

interface TopClub {
  name: string
  type: string
  actual_count: number
  group_number: number
}

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  if (user.role !== "admin") {
    redirect("/auth/login")
  }

  const supabase = await createServerClient()

  // Get group statistics
  const { data: groupStats } = await supabase.from("clubs").select("group_number, estimated_count, actual_count")

  // Calculate group totals
  const groupTotals: GroupStats[] = []
  for (let i = 1; i <= 5; i++) {
    const groupClubs = groupStats?.filter((club) => club.group_number === i) || []
    groupTotals.push({
      group_number: i,
      estimated_total: groupClubs.reduce((sum, club) => sum + (club.estimated_count || 0), 0),
      actual_total: groupClubs.reduce((sum, club) => sum + (club.actual_count || 0), 0),
      club_count: groupClubs.length,
    })
  }

  // Calculate district totals
  const districtEstimated = groupTotals.reduce((sum, group) => sum + group.estimated_total, 0)
  const districtActual = groupTotals.reduce((sum, group) => sum + group.actual_total, 0)

  const completionRate = districtEstimated > 0 ? Math.round((districtActual / districtEstimated) * 100) : 0
  const endDate = new Date("2025-12-31") // Assuming end date
  const today = new Date()
  const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const { data: topCollegeClubs } = await supabase
    .from("clubs")
    .select("name, actual_count, group_number")
    .eq("type", "college")
    .order("actual_count", { ascending: false })
    .limit(3)

  const { data: topCommunityClubs } = await supabase
    .from("clubs")
    .select("name, actual_count, group_number")
    .eq("type", "community")
    .order("actual_count", { ascending: false })
    .limit(3)

  return (
    <DashboardLayout title="Admin Dashboard" userRole="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary mb-2">JOSH District Culturals 2025</h1>
        <p className="text-muted-foreground">Registration Portal Dashboard</p>
      </div>

      {/* District Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Clubs" value="3233" subtitle="Across district" icon={Users} />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle={`${districtActual}/${districtEstimated} registered`}
          icon={Target}
        />
        <StatsCard
          title="Days Remaining"
          value={daysLeft > 0 ? daysLeft : 0}
          subtitle="To complete target"
          icon={Clock}
        />
        <StatsCard
          title="Registration Progress"
          value={`${districtActual}`}
          subtitle="Total registrations"
          icon={Calendar}
        />
      </div>

      {/* Group Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-secondary">
              <Users className="w-5 h-5" />
              <span>Group Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupTotals.map((group) => (
                <div
                  key={group.group_number}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="border-secondary text-muted-foreground">
                      Group {group.group_number}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{group.club_count} clubs</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {group.actual_total}/{group.estimated_total}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((group.actual_total / group.estimated_total) * 100)}% complete
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-secondary">
              <Trophy className="w-5 h-5" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-foreground mb-3">Top College-Based Clubs</h4>
                <div className="space-y-2">
                  {topCollegeClubs?.slice(0, 3).map((club, index) => (
                    <div
                      key={club.name}
                      className="flex items-center justify-between p-2 bg-primary/10 rounded border border-primary/20"
                    >
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {index + 1}
                        </Badge>
                        <div>
                          <div className="font-medium text-sm">{club.name}</div>
                          <Badge variant="outline" className="text-xs">
                            Group {club.group_number}
                          </Badge>
                        </div>
                      </div>
                      <div className="font-bold text-foreground">{club.actual_count}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Top Community-Based Clubs</h4>
                <div className="space-y-2">
                  {topCommunityClubs?.slice(0, 3).map((club, index) => (
                    <div
                      key={club.name}
                      className="flex items-center justify-between p-2 bg-accent/10 rounded border border-accent/20"
                    >
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {index + 1}
                        </Badge>
                        <div>
                          <div className="font-medium text-sm">{club.name}</div>
                          <Badge variant="outline" className="text-xs">
                            Group {club.group_number}
                          </Badge>
                        </div>
                      </div>
                      <div className="font-bold text-foreground">{club.actual_count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-secondary">Registration Progress by Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groupTotals.map((group) => {
              const percentage = Math.round((group.actual_total / group.estimated_total) * 100)
              return (
                <div key={group.group_number} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">Group {group.group_number}</span>
                    <span className="text-sm text-muted-foreground">
                      {group.actual_total}/{group.estimated_total} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
