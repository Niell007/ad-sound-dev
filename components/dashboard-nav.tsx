"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRBACContext } from "@/contexts/rbac-context"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  MessageSquare,
  Star,
  FileText,
  Image,
  Radio
} from "lucide-react"

// Define the navigation items
const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["user", "staff", "manager", "admin"],
  },
  {
    title: "Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
    roles: ["user", "staff", "manager", "admin"],
  },
  {
    title: "Clients",
    href: "/dashboard/clients",
    icon: Users,
    roles: ["staff", "manager", "admin"],
  },
  {
    title: "Reviews",
    href: "/dashboard/reviews",
    icon: Star,
    roles: ["user", "staff", "manager", "admin"],
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    roles: ["user", "staff", "manager", "admin"],
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
    roles: ["staff", "manager", "admin"],
  },
  {
    title: "Media",
    href: "/dashboard/media",
    icon: Image,
    roles: ["staff", "manager", "admin"],
  },
  {
    title: "Streams",
    href: "/dashboard/streams",
    icon: Radio,
    roles: ["staff", "manager", "admin"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["user", "staff", "manager", "admin"],
  },
]

interface DashboardNavProps {
  className?: string
}

export function DashboardNav({ className }: DashboardNavProps) {
  const pathname = usePathname()
  const { hasRole } = useRBACContext()

  // Filter navigation items based on user role
  const filteredNavigation = navigationItems.filter(item => {
    return item.roles.some(role => hasRole(role))
  })

  return (
    <nav className={cn("grid items-start gap-2", className)}>
      {filteredNavigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Button
            key={item.href}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "justify-start",
              isActive ? "bg-secondary" : "hover:bg-transparent hover:underline"
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
} 