"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRBACContext } from "@/contexts/rbac-context";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  CreditCard,
  FileAudio,
  Home,
  Image,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/custom-toast-provider";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

// Define navigation items with required roles
const navItems: (NavItem & { requiredRole?: "admin" | "manager" | "staff" | "user" })[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Bookings",
    href: "/dashboard/bookings",
    icon: <Calendar className="h-5 w-5" />,
    requiredRole: "staff",
  },
  {
    title: "Clients",
    href: "/dashboard/clients",
    icon: <Users className="h-5 w-5" />,
    requiredRole: "staff",
  },
  {
    title: "Services",
    href: "/dashboard/services",
    icon: <Music className="h-5 w-5" />,
    requiredRole: "staff",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    requiredRole: "manager",
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Media",
    href: "/dashboard/media",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Reviews",
    href: "/dashboard/reviews",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: <Shield className="h-5 w-5" />,
    requiredRole: "admin",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const { hasRole } = useRBACContext();
  const { toast } = useToast();

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => 
    !item.requiredRole || hasRole(item.requiredRole)
  );

  // Close mobile nav when path changes
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      
      if (result.success) {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return "AD";
    
    const nameParts = user.user_metadata.full_name.split(" ");
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
    
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Navigation Toggle */}
      <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        >
          {isMobileNavOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <FileAudio className="h-6 w-6" />
          <span className="font-semibold">AD Sound Studio</span>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 transform border-r bg-background transition-transform duration-300 ease-in-out lg:translate-x-0 lg:border-r",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <FileAudio className="h-6 w-6" />
            <span className="font-semibold">AD Sound Studio</span>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {filteredNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="border-t p-4">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start px-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage 
                          src={user?.user_metadata?.avatar_url || ""} 
                          alt={user?.user_metadata?.full_name || "User"} 
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start text-sm">
                        <span className="font-medium">
                          {user?.user_metadata?.full_name || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
} 