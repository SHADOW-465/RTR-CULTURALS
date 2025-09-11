import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/get-current-user"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { AddExternalClubDialog } from "@/components/add-external-club-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Target, Trophy, ExternalLink } from "lucide-react"

interface GroupStats {
  group_number: number
  estimated_total: number
  actual_total: number
  club_count: number
  external_count: number
}

interface Club {
  id: string
  name: string
  type: string
  group_number: number
  estimated_count: number
  actual_count: number
  is_external: boolean
  created_at: string
}

export default async function RegcomDashboard() {
  const user = await getCurrentUser()

  if (user.role !== "regcom") {
    redirect("/auth/login")
  }

  const supabase = await createServerClient()

  // Get all clubs data
  const { data: allClubs } = await supabase
    .from("clubs")
    .select("*")
    .order("group_number", { ascending: true })
    .order("created_at", { ascending: false })

  // Calculate group statistics
  const groupTotals: GroupStats[] = []
  for (let i = 1; i <= 5; i++) {
    const groupClubs = allClubs?.filter((club) => club.group_number === i) || []
    const externalClubs = groupClubs.filter((club) => club.is_external)
    groupTotals.push({
      group_number: i,
      estimated_total: groupClubs.reduce((sum, club) => sum + (club.estimated_count || 0), 0),
      actual_total: groupClubs.reduce((sum, club) => sum + (club.actual_count || 0), 0),
      club_count: groupClubs.length,
      external_count: externalClubs.length,
    })
  }

  // Calculate district totals
  const districtEstimated = groupTotals.reduce((sum, group) => sum + group.estimated_total, 0)
  const districtActual = groupTotals.reduce((sum, group) => sum + group.actual_total, 0)
  const totalExternalClubs = groupTotals.reduce((sum, group) => sum + group.external_count, 0)

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

  // Get external clubs
  const externalClubs = allClubs?.filter((club) => club.is_external) || []

  return (
    <DashboardLayout title="Registration Committee Dashboard" userRole="regcom">
      {/* District Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="District Target"
          value={`${districtActual} / ${districtEstimated}`}
          subtitle={`${Math.round((districtActual / districtEstimated) * 100)}% completed`}
          icon={Target}
        />
        <StatsCard title="Total Clubs" value={allClubs?.length || 0} subtitle="Across all groups" icon={Users} />
        <StatsCard
          title="External Clubs"
          value={totalExternalClubs}
          subtitle="From other districts"
          icon={ExternalLink}
        />
        <StatsCard
          title="Top Performance"
          value={topCollegeClub?.actual_count || 0}
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
        </TabsContent>

        <TabsContent value="external" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">External Club Management</h3>
            <AddExternalClubDialog />
          </div>

          <Card>
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
                          <span>Estimated: {club.estimated_count}</span>
                          <span>Actual: {club.actual_count}</span>
                          <span>
                            Progress:{" "}
                            {club.estimated_count > 0
                              ? Math.round((club.actual_count / club.estimated_count) * 100)
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
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Registration Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Estimated:</span>
                      <span className="font-medium">{districtEstimated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Actual:</span>
                      <span className="font-medium">{districtActual}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span className="font-medium">{Math.round((districtActual / districtEstimated) * 100)}%</span>
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
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
