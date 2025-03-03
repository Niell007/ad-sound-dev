"use client";

import { ReactNode } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminLayoutClient({
  children,
}: {
  children: ReactNode
}) {
  // Access denied fallback UI
  const accessDeniedFallback = (
    <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">
            You do not have permission to access the admin panel. This area is restricted to administrators only.
          </p>
        </div>
      </Card>
    </div>
  );

  return (
    <ProtectedRoute 
      requiredRole="admin" 
      fallback={accessDeniedFallback}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage your studio, users, and system settings
            </p>
          </div>
        </div>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
} 