import type { Metadata } from "next"
import { AdminLayoutClient } from "./admin-layout-client"

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Admin Dashboard",
  },
  description: "Admin dashboard for managing users, content, and settings.",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}

