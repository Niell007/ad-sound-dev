import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminOverview } from "@/components/admin/admin-overview"
import { RecentActivity } from "@/components/admin/recent-activity"
import { UserStats } from "@/components/admin/user-stats"

export default function AdminDashboard() {
  return (
    <div className="space-y-6 p-4 pt-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening.</p>
      </div>

      <AdminOverview />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <UserStats />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
