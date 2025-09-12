import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/get-current-user"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Trophy, Calendar, Clock, Building, Home } from "lucide-react"
import { AddClubDialog } from "@/components/add-club-dialog"
import { EditClubDialog } from "@/components/edit-club-dialog"
import { TodoList } from "@/components/todo-list"
import { cn } from "@/lib/utils"

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
        <h1 className="text-3xl font-bold text-secondary mb-2">JOSH District Culturals 2025</h1>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-1 group/performance">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-secondary">
              <Users className="w-6 h-6" />
              <span className="text-xl">Group Performance</span>
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
                    className="p-4 bg-black/20 rounded-lg border border-white/10 space-y-3 transition-all duration-300 hover:bg-black/40 hover:border-secondary/50 hover:scale-105"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="border-secondary/50 text-secondary font-bold">
                          Group {group.group_number}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{group.club_count} clubs</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg text-foreground">
                          {group.achieved_total} / {group.target_total}
                        </div>
                        <div className="text-xs text-muted-foreground">{percentage}% complete</div>
                      </div>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-4 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          boxShadow: `0 0 12px var(--secondary)`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-secondary">
              <Trophy className="w-6 h-6" />
              <span className="text-xl">Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg text-foreground mb-3">Top College Clubs</h4>
                <div className="space-y-3">
                  {topCollegeClubs.map((club, index) => (
                    <div
                      key={club.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all",
                        {
                          "bg-secondary/20 border-secondary/50 shadow-lg shadow-secondary/10": index === 0,
                          "bg-primary/15 border-primary/30": index === 1,
                          "bg-white/10 border-white/20": index === 2,
                        }
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="secondary"
                          className={cn("w-7 h-7 rounded-full p-0 flex items-center justify-center text-sm", {
                            "bg-secondary text-secondary-foreground": index === 0,
                            "bg-primary text-primary-foreground": index > 0,
                          })}
                        >
                          {index + 1}
                        </Badge>
                        <div>
                          <div className="font-semibold">{club.name}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            Group {club.group_number}
                          </Badge>
                        </div>
                      </div>
                      <div className="font-bold text-2xl golden-glow">{club.achieved_registrations}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg text-foreground mb-3">Top Community Clubs</h4>
                <div className="space-y-3">
                  {topCommunityClubs.map((club, index) => (
                    <div
                      key={club.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all",
                        {
                          "bg-secondary/20 border-secondary/50 shadow-lg shadow-secondary/10": index === 0,
                          "bg-primary/15 border-primary/30": index === 1,
                          "bg-white/10 border-white/20": index === 2,
                        }
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="secondary"
                          className={cn("w-7 h-7 rounded-full p-0 flex items-center justify-center text-sm", {
                            "bg-secondary text-secondary-foreground": index === 0,
                            "bg-primary text-primary-foreground": index > 0,
                          })}
                        >
                          {index + 1}
                        </Badge>
                        <div>
                          <div className="font-semibold">{club.name}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            Group {club.group_number}
                          </Badge>
                        </div>
                      </div>
                      <div className="font-bold text-2xl golden-glow">{club.achieved_registrations}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-1">
          <TodoList />
        </div>
      </div>

      {/* Club Management Section */}
      <Card className="mt-6">
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
      </Card>
    </DashboardLayout>
  )
}
