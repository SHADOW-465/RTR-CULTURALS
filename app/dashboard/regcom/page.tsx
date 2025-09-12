import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/get-current-user"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { AddExternalClubDialog } from "@/components/add-external-club-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SnakeBorderCard } from "@/components/ui/snake-border-card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Target, Trophy, ExternalLink } from "lucide-react"

interface GroupStats {
  group_number: number
  target_total: number
  achieved_total: number
  club_count: number
  external_count: number
}

export default async function RegcomDashboard() {
  const user = await getCurrentUser()

  if (user.role !== "regcom") {
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
      is_external,
      created_at,
      club_registrations (
        target_registrations,
        achieved_registrations
      )
    `
    )
    .order("group_number", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching clubs data for regcom:", error)
    return <div>Error loading data.</div>
  }

  const allClubs = allClubsData.map((club) => ({
    ...club,
    target_registrations: club.club_registrations[0]?.target_registrations || 0,
    achieved_registrations: club.club_registrations[0]?.achieved_registrations || 0,
  }))

  // Calculate group statistics
  const groupTotals: GroupStats[] = []
  for (let i = 1; i <= 5; i++) {
    const groupClubs = allClubs.filter((club) => club.group_number === i)
    const externalClubs = groupClubs.filter((club) => club.is_external)
    groupTotals.push({
      group_number: i,
      target_total: groupClubs.reduce((sum, club) => sum + club.target_registrations, 0),
      achieved_total: groupClubs.reduce((sum, club) => sum + club.achieved_registrations, 0),
      club_count: groupClubs.length,
      external_count: externalClubs.length,
    })
  }

  // Calculate district totals
  const districtTarget = groupTotals.reduce((sum, group) => sum + group.target_total, 0)
  const districtAchieved = groupTotals.reduce((sum, group) => sum + group.achieved_total, 0)
  const totalExternalClubs = groupTotals.reduce((sum, group) => sum + group.external_count, 0)

  // Get top clubs
  const topCollegeClub = [...allClubs]
    .filter((c) => c.type === "college")
    .sort((a, b) => b.achieved_registrations - a.achieved_registrations)[0]
  const topCommunityClub = [...allClubs]
    .filter((c) => c.type === "community")
    .sort((a, b) => b.achieved_registrations - a.achieved_registrations)[0]

  // Get external clubs
  const externalClubs = allClubs.filter((club) => club.is_external)

  return (
    <DashboardLayout title="Registration Committee Dashboard" userRole="regcom">
      {/* District Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="District Target"
          value={`${districtAchieved} / ${districtTarget}`}
          subtitle={`${districtTarget > 0 ? Math.round((districtAchieved / districtTarget) * 100) : 0}% completed`}
          icon={Target}
        />
        <StatsCard title="Total Clubs" value={allClubs.length} subtitle="Across all groups" icon={Users} />
        <StatsCard
          title="External Clubs"
          value={totalExternalClubs}
          subtitle="From other districts"
          icon={ExternalLink}
        />
        <StatsCard
          title="Top Performance"
          value={topCollegeClub?.achieved_registrations || 0}
          subtitle="Highest registrations"
          icon={Trophy}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="external">External Clubs</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Group Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SnakeBorderCard>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Group Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupTotals.map((group) => (
                    <div
                      key={group.group_number}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">Group {group.group_number}</Badge>
                        <span className="text-sm text-gray-600">
                          {group.club_count} clubs ({group.external_count} external)
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {group.achieved_total} / {group.target_total}
                        </div>
                        <div className="text-xs text-gray-500">
                          {group.target_total > 0
                            ? `${Math.round((group.achieved_total / group.target_total) * 100)}% complete`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </SnakeBorderCard>

            <SnakeBorderCard>
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
                        <div className="text-2xl font-bold text-blue-600">{topCollegeClub.achieved_registrations}</div>
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
                        <div className="text-2xl font-bold text-green-600">
                          {topCommunityClub.achieved_registrations}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </SnakeBorderCard>
          </div>

          {/* Progress Visualization */}
          <SnakeBorderCard>
            <CardHeader>
              <CardTitle>Registration Progress by Group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupTotals.map((group) => {
                  const percentage =
                    group.target_total > 0 ? Math.round((group.achieved_total / group.target_total) * 100) : 0
                  return (
                    <div key={group.group_number} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Group {group.group_number}</span>
                        <span className="text-sm text-gray-500">
                          {group.achieved_total} / {group.target_total} ({percentage}%)
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
          </SnakeBorderCard>
        </TabsContent>

        <TabsContent value="external" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">External Club Management</h3>
            <AddExternalClubDialog />
          </div>

          <SnakeBorderCard>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>External Clubs</span>
                <Badge variant="outline">{externalClubs.length} clubs</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {externalClubs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ExternalLink className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No external clubs registered yet.</p>
                  <p className="text-sm">Click "Add External Club" to register clubs from other districts.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {externalClubs.map((club) => (
                    <div key={club.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{club.name}</h3>
                          <Badge variant={club.type === "college" ? "default" : "secondary"}>
                            {club.type === "college" ? "College" : "Community"}
                          </Badge>
                          <Badge variant="outline">Group {club.group_number}</Badge>
                          <Badge className="bg-green-100 text-green-800">External</Badge>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span>Target: {club.target_registrations}</span>
                          <span>Achieved: {club.achieved_registrations}</span>
                          <span>
                            Progress:{" "}
                            {club.target_registrations > 0
                              ? Math.round((club.achieved_registrations / club.target_registrations) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </SnakeBorderCard>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <SnakeBorderCard>
            <CardHeader>
              <CardTitle>Detailed Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Registration Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Target:</span>
                      <span className="font-medium">{districtTarget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Achieved:</span>
                      <span className="font-medium">{districtAchieved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span className="font-medium">
                        {districtTarget > 0 ? Math.round((districtAchieved / districtTarget) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>External Clubs:</span>
                      <span className="font-medium">{totalExternalClubs}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Club Distribution</h4>
                  <div className="space-y-2 text-sm">
                    {groupTotals.map((group) => (
                      <div key={group.group_number} className="flex justify-between">
                        <span>Group {group.group_number}:</span>
                        <span className="font-medium">{group.club_count} clubs</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </SnakeBorderCard>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
