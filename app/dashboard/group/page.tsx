import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/get-current-user"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { AddClubDialog } from "@/components/add-club-dialog"
import { EditClubDialog } from "@/components/edit-club-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Building, Home } from "lucide-react"

interface Club {
  id: string
  name: string
  type: string
  estimated_count: number
  actual_count: number
  created_at: string
}

export default async function GroupDashboard() {
  const user = await getCurrentUser()

  // Check if user has group role
  if (!user.role.startsWith("group")) {
    redirect("/auth/login")
  }

  const supabase = await createServerClient()

  const getGroupNumber = (role: string): number => {
    const match = role.match(/group(\d+)/)
    return match ? Number.parseInt(match[1]) : 1
  }

  const groupNumber = getGroupNumber(user.role)

  // Get clubs for this group
  const { data: clubs } = await supabase
    .from("clubs")
    .select("*")
    .eq("group_number", groupNumber)
    .order("created_at", { ascending: false })

  const totalEstimated = clubs?.reduce((sum, club) => sum + club.estimated_count, 0) || 0
  const totalActual = clubs?.reduce((sum, club) => sum + club.actual_count, 0) || 0
  const collegeClubs = clubs?.filter((club) => club.type === "college") || []
  const communityClubs = clubs?.filter((club) => club.type === "community") || []

  return (
    <DashboardLayout title={`${user.group_name} Dashboard`} userRole={user.role}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold golden-glow mb-2">{user.group_name}</h1>
        <p className="text-muted-foreground">JOSH District Culturals 2025</p>
      </div>

      {/* Group Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Group Target"
          value={`${totalActual}/${totalEstimated}`}
          subtitle={`${totalEstimated > 0 ? Math.round((totalActual / totalEstimated) * 100) : 0}% completed`}
          icon={Target}
          className="bg-gradient-to-br from-card to-primary/10 border-primary/20"
        />
        <StatsCard
          title="Total Clubs"
          value={clubs?.length || 0}
          subtitle="Registered clubs"
          icon={Users}
          className="bg-gradient-to-br from-card to-secondary/10 border-secondary/20"
        />
        <StatsCard
          title="College Clubs"
          value={collegeClubs.length}
          subtitle="Educational institutions"
          icon={Building}
          className="bg-gradient-to-br from-card to-accent/10 border-accent/20"
        />
        <StatsCard
          title="Community Clubs"
          value={communityClubs.length}
          subtitle="Community based"
          icon={Home}
          className="bg-gradient-to-br from-card to-chart-1/10 border-chart-1/20"
        />
      </div>

      {/* Add Club Section */}
      <div className="mb-6">
        <AddClubDialog groupNumber={groupNumber} />
      </div>

      {/* Clubs List */}
      <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between golden-glow">
            <span>Club Registrations</span>
            <Badge variant="outline" className="border-secondary text-secondary">
              {clubs?.length || 0} clubs
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!clubs || clubs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No clubs registered yet.</p>
              <p className="text-sm">Click "Add Club" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-foreground">{club.name}</h3>
                      <Badge
                        variant={club.type === "college" ? "default" : "secondary"}
                        className={
                          club.type === "college"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }
                      >
                        {club.type === "college" ? "College" : "Community"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <span className="font-medium text-secondary">
                        Target: {club.estimated_count}/{club.actual_count}
                      </span>
                      <span>
                        Progress:{" "}
                        {club.estimated_count > 0 ? Math.round((club.actual_count / club.estimated_count) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <EditClubDialog club={club} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Summary */}
      {clubs && clubs.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Registration Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-500">
                  {totalActual} / {totalEstimated} (
                  {totalEstimated > 0 ? Math.round((totalActual / totalEstimated) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${totalEstimated > 0 ? Math.min((totalActual / totalEstimated) * 100, 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
