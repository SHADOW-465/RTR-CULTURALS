import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/get-current-user"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { AddClubDialog } from "@/components/add-club-dialog"
import { EditClubDialog } from "@/components/edit-club-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SnakeBorderCard } from "@/components/ui/snake-border-card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Building, Home } from "lucide-react"
import { Leaderboard } from "@/components/leaderboard"

export default async function GroupDashboard() {
  const user = await getCurrentUser()

  if (!user.role.startsWith("group")) {
    redirect("/auth/login")
  }

  const supabase = await createServerClient()

  const getGroupNumber = (role: string): number => {
    const match = role.match(/group(\d+)/)
    return match ? Number.parseInt(match[1]) : 1
  }

  const groupNumber = getGroupNumber(user.role)

  const { data: clubsData, error } = await supabase
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
    .eq("group_number", groupNumber)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching group clubs data:", error)
    return <div>Error loading data.</div>
  }

  const clubs = clubsData.map((club) => ({
    ...club,
    target_registrations: club.club_registrations[0]?.target_registrations || 0,
    achieved_registrations: club.club_registrations[0]?.achieved_registrations || 0,
  }))

  const totalTarget = clubs.reduce((sum, club) => sum + club.target_registrations, 0)
  const totalAchieved = clubs.reduce((sum, club) => sum + club.achieved_registrations, 0)
  const collegeClubs = clubs.filter((club) => club.type === "college")
  const communityClubs = clubs.filter((club) => club.type === "community")

  return (
    <DashboardLayout title={`${user.group_name} Dashboard`} userRole={user.role}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary soft-glow mb-2">{user.group_name}</h1>
        <p className="text-muted-foreground">JOSH District Culturals 2025</p>
      </div>

      {/* Group Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Group Target"
          value={`${totalAchieved}/${totalTarget}`}
          subtitle={`${totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0}% completed`}
          icon={Target}
        />
        <StatsCard title="Total Clubs" value={clubs.length} subtitle="Registered clubs" icon={Users} />
        <StatsCard
          title="College Clubs"
          value={collegeClubs.length}
          subtitle="Educational institutions"
          icon={Building}
        />
        <StatsCard
          title="Community Clubs"
          value={communityClubs.length}
          subtitle="Community based"
          icon={Home}
        />
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Leaderboard title="College Club Champions" clubs={collegeClubs} limit={3} />
        <Leaderboard title="Community Club Champions" clubs={communityClubs} limit={3} />
      </div>

      {/* Add Club Section */}
      <div className="mb-6">
        <AddClubDialog groupNumber={groupNumber} userRole={user.role} />
      </div>

      {/* Clubs List */}
      <SnakeBorderCard>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-secondary">
            <span>Club Registrations</span>
            <Badge variant="outline" className="border-secondary text-muted-foreground">
              {clubs.length} clubs
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clubs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No clubs registered yet.</p>
              <p className="text-sm">Click "Add Club" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* College Clubs List */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  College Clubs ({collegeClubs.length})
                </h3>
                <div className="space-y-4">
                  {collegeClubs.map((club) => (
                    <div
                      key={club.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-foreground">{club.name}</h3>
                          <Badge variant="default" className="bg-primary text-primary-foreground">
                            College
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <span className="font-medium text-secondary">
                            Target: {club.achieved_registrations}/{club.target_registrations}
                          </span>
                          <span>
                            Progress:{" "}
                            {club.target_registrations > 0
                              ? Math.round((club.achieved_registrations / club.target_registrations) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <EditClubDialog club={club} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Clubs List */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Community Clubs ({communityClubs.length})
                </h3>
                <div className="space-y-4">
                  {communityClubs.map((club) => (
                    <div
                      key={club.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-foreground">{club.name}</h3>
                          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                            Community
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <span className="font-medium text-secondary">
                            Target: {club.achieved_registrations}/{club.target_registrations}
                          </span>
                          <span>
                            Progress:{" "}
                            {club.target_registrations > 0
                              ? Math.round((club.achieved_registrations / club.target_registrations) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <EditClubDialog club={club} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </SnakeBorderCard>

      {/* Progress Summary */}
      {clubs.length > 0 && (
        <SnakeBorderCard className="mt-6">
          <CardHeader>
            <CardTitle className="text-secondary">Registration Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {totalAchieved} / {totalTarget} (
                  {totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${totalTarget > 0 ? Math.min((totalAchieved / totalTarget) * 100, 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </SnakeBorderCard>
      )}
    </DashboardLayout>
  )
}
