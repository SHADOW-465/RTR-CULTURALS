import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/get-current-user"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SnakeBorderCard } from "@/components/ui/snake-border-card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Trophy, Calendar, Clock, Building, Home } from "lucide-react"
import { AddClubDialog } from "@/components/add-club-dialog"
import { EditClubDialog } from "@/components/edit-club-dialog"
import { TodoList } from "@/components/todo-list"

interface GroupStats {
  group_number: number
  target_total: number
  achieved_total: number
  club_count: number
}

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  if (user.role !== "admin") {
    redirect("/auth/login")
  }

  const supabase = await createServerClient()

  const { data: allClubsData, error } = await supabase
    .from("clubs")
    .select(
      `
      id,
      name,
      type,
      group_number,
      club_registrations (
        target_registrations,
        achieved_registrations
      )
    `
    )
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching clubs data:", error)
    // Handle the error appropriately
    return <div>Error loading data.</div>
  }

  const allClubs = allClubsData.map((club) => ({
    ...club,
    target_registrations: club.club_registrations[0]?.target_registrations || 0,
    achieved_registrations: club.club_registrations[0]?.achieved_registrations || 0,
  }))

  // Calculate group totals
  const groupTotals: GroupStats[] = []
  for (let i = 1; i <= 5; i++) {
    const groupClubs = allClubs.filter((club) => club.group_number === i)
    groupTotals.push({
      group_number: i,
      target_total: groupClubs.reduce((sum, club) => sum + club.target_registrations, 0),
      achieved_total: groupClubs.reduce((sum, club) => sum + club.achieved_registrations, 0),
      club_count: groupClubs.length,
    })
  }

  // Calculate district totals
  const districtTarget = 3500
  const districtAchieved = groupTotals.reduce((sum, group) => sum + group.achieved_total, 0)
  const totalClubs = allClubs.length

  const completionRate = districtTarget > 0 ? Math.round((districtAchieved / districtTarget) * 100) : 0
  const endDate = new Date("2025-12-31") // Assuming end date
  const today = new Date()
  const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const topCollegeClubs = allClubs
    .filter((club) => club.type === "college")
    .sort((a, b) => b.achieved_registrations - a.achieved_registrations)
    .slice(0, 3)

  const topCommunityClubs = allClubs
    .filter((club) => club.type === "community")
    .sort((a, b) => b.achieved_registrations - a.achieved_registrations)
    .slice(0, 3)

  const collegeClubsList = allClubs.filter((club) => club.type === "college")
  const communityClubsList = allClubs.filter((club) => club.type === "community")

  return (
    <DashboardLayout title="Admin Dashboard" userRole={user.role}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary soft-glow mb-2">JOSH District Culturals 2025</h1>
        <p className="text-muted-foreground">Registration Portal Dashboard</p>
      </div>

      {/* District Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Clubs" value={totalClubs} subtitle="Across district" icon={Users} className="border-secondary" />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle={`${districtAchieved}/${districtTarget} registered`}
          icon={Target}
          className="border-secondary"
        />
        <StatsCard
          title="Days Remaining"
          value={daysLeft > 0 ? daysLeft : 0}
          subtitle="To complete target"
          icon={Clock}
          className="border-secondary"
        />
        <StatsCard
          title="Registration Progress"
          value={`${districtAchieved}`}
          subtitle="Total registrations"
          icon={Calendar}
          className="border-secondary"
        />
      </div>

      {/* Group Performance, Top Performers, and To-Do List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <SnakeBorderCard className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-secondary">
              <Users className="w-5 h-5" />
              <span>Group Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupTotals.map((group) => {
                const percentage =
                  group.target_total > 0 ? Math.round((group.achieved_total / group.target_total) * 100) : 0
                return (
                  <div
                    key={group.group_number}
                    className="p-3 bg-muted/50 rounded-lg border border-border/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="border-secondary text-muted-foreground">
                          Group {group.group_number}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{group.club_count} clubs</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          {group.achieved_total}/{group.target_total}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {group.target_total > 0 ? `${percentage}% complete` : "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 mt-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500 animate-slide-in-from-left"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </SnakeBorderCard>

        <SnakeBorderCard className="lg:col-span-1">
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
                  {topCollegeClubs.map((club, index) => (
                    <div
                      key={club.id}
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
                      <div className="font-bold text-foreground">{club.achieved_registrations}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Top Community-Based Clubs</h4>
                <div className="space-y-2">
                  {topCommunityClubs.map((club, index) => (
                    <div
                      key={club.id}
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
                      <div className="font-bold text-foreground">{club.achieved_registrations}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </SnakeBorderCard>

        <div className="lg:col-span-1">
          <TodoList />
        </div>
      </div>

      {/* Club Management Section */}
      <SnakeBorderCard className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-secondary">Club Management</CardTitle>
            <AddClubDialog userRole={user.role} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* College Clubs List */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                College Clubs ({collegeClubsList.length})
              </h3>
              <div className="space-y-4">
                {collegeClubsList.map((club) => (
                  <div
                    key={club.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
                  >
                    <div>
                      <p className="font-semibold">{club.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Group {club.group_number} | Progress: {club.achieved_registrations}/
                        {club.target_registrations}
                      </p>
                    </div>
                    <EditClubDialog club={club} />
                  </div>
                ))}
              </div>
            </div>

            {/* Community Clubs List */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Community Clubs ({communityClubsList.length})
              </h3>
              <div className="space-y-4">
                {communityClubsList.map((club) => (
                  <div
                    key={club.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
                  >
                    <div>
                      <p className="font-semibold">{club.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Group {club.group_number} | Progress: {club.achieved_registrations}/
                        {club.target_registrations}
                      </p>
                    </div>
                    <EditClubDialog club={club} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </SnakeBorderCard>
    </DashboardLayout>
  )
}
