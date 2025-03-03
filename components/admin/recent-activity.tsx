"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MessageSquare, Settings, User, FileText, Calendar } from "lucide-react"

// Sample activity data
const activities = [
  {
    id: 1,
    type: "signup",
    user: "John Doe",
    description: "signed up for an account",
    timestamp: "2 hours ago",
    icon: User,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100"
  },
  {
    id: 2,
    type: "content",
    user: "Sarah Johnson",
    description: "uploaded a new track",
    timestamp: "3 hours ago",
    icon: FileText,
    iconColor: "text-green-500",
    iconBg: "bg-green-100"
  },
  {
    id: 3,
    type: "settings",
    user: "Michael Brown",
    description: "updated profile settings",
    timestamp: "5 hours ago",
    icon: Settings,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-100"
  },
  {
    id: 4,
    type: "event",
    user: "Emily Wilson",
    description: "created a new event",
    timestamp: "1 day ago",
    icon: Calendar,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100"
  },
  {
    id: 5,
    type: "support",
    user: "David Lee",
    description: "sent a message to support",
    timestamp: "1 day ago",
    icon: MessageSquare,
    iconColor: "text-red-500",
    iconBg: "bg-red-100"
  }
]

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={`${activity.iconBg} p-2 rounded-full`}>
                  <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <span className="font-semibold">{activity.user}</span> {activity.description}
                  </p>
                  <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/admin/activity" className="w-full">
          <Button variant="outline" className="w-full">
            <span>View all activity</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
