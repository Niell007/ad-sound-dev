"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, FileText, Settings, BarChart } from "lucide-react"
import Link from "next/link"

export function AdminOverview() {
  const adminActions = [
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      href: "/admin/users",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Content Management",
      description: "Manage website content and pages",
      icon: FileText,
      href: "/admin/content",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "Media Library",
      description: "Manage media files and streaming",
      icon: BarChart,
      href: "/dashboard/media",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      title: "Event Calendar",
      description: "Manage events and bookings",
      icon: Calendar,
      href: "/admin/events",
      color: "text-amber-500",
      bgColor: "bg-amber-100",
    },
    {
      title: "System Settings",
      description: "Configure system settings",
      icon: Settings,
      href: "/admin/settings",
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {adminActions.map((action) => (
        <Card key={action.title} className="overflow-hidden">
          <CardHeader className={`${action.bgColor} p-4`}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <action.icon className={`h-5 w-5 ${action.color}`} />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardDescription className="mb-3">{action.description}</CardDescription>
            <Button asChild size="sm" className="w-full">
              <Link href={action.href}>Manage</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
