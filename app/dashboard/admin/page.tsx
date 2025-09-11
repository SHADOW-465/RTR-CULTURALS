import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/get-current-user"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Trophy, TrendingUp } from "lucide-react"

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

  // Get top clubs
  const { data: topCollegeClub } = await supabase
    .from("clubs")
    .select("name, actual_count, group_number")
    .eq("type", "college")
    .order("actual_count", { ascending: false })
    .limit(1)
    .single()

  const { data: topCommunityClub } = await supabase
    .from("clubs")
    .select("name, actual_count, group_number")
    .eq("type", "community")
    .order("actual_count", { ascending: false })
    .limit(1)
    .single()

  return (
    <DashboardLayout title="Admin Dashboard" userRole="admin">
      {/* District Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="District Target"
          value={`${districtActual} / ${districtEstimated}`}
          subtitle={`${Math.round((districtActual / districtEstimated) * 100)}% completed`}
          icon={Target}
        />
        <StatsCard title="Total Clubs" value={groupStats?.length || 0} subtitle="Across all groups" icon={Users} />
        <StatsCard
          title="Completion Rate"
          value={`${Math.round((districtActual / districtEstimated) * 100)}%`}
          subtitle="Overall progress"
          icon={TrendingUp}
        />
        <StatsCard
          title="Top Performance"
          value={topCollegeClub?.actual_count || 0}
          subtitle="Highest registrations"
          icon={Trophy}
        />
      </div>

      {/* Group Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Group Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupTotals.map((group) => (
                <div key={group.group_number} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">Group {group.group_number}</Badge>
                    <span className="text-sm text-gray-600">{group.club_count} clubs</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {group.actual_total} / {group.estimated_total}
                    </div>
                    <div className="text-xs text-gray-500">
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
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCollegeClub && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-blue-900">Highest College-Based Club</div>
                      <div className="text-sm text-blue-700">{topCollegeClub.name}</div>
                      <Badge variant="secondary" className="mt-1">
                        Group {topCollegeClub.group_number}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{topCollegeClub.actual_count}</div>
                  </div>
                </div>
              )}

              {topCommunityClub && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-900">Highest Community-Based Club</div>
                      <div className="text-sm text-green-700">{topCommunityClub.name}</div>
                      <Badge variant="secondary" className="mt-1">
                        Group {topCommunityClub.group_number}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{topCommunityClub.actual_count}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Progress by Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groupTotals.map((group) => {
              const percentage = Math.round((group.actual_total / group.estimated_total) * 100)
              return (
                <div key={group.group_number} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Group {group.group_number}</span>
                    <span className="text-sm text-gray-500">
                      {group.actual_total} / {group.estimated_total} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
