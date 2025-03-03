"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Activity, BarChart } from "lucide-react"
import Link from "next/link"

export function UserStats() {
  // Sample data for user distribution
  const userDistribution = [
    { role: "Admin", count: 5, color: "#ef4444" },
    { role: "Manager", count: 12, color: "#f97316" },
    { role: "Staff", count: 48, color: "#3b82f6" },
    { role: "User", count: 1169, color: "#10b981" },
  ]

  // Calculate total users and percentages
  const totalUsers = userDistribution.reduce((sum, item) => sum + item.count, 0)
  const userDistributionWithPercentage = userDistribution.map(item => ({
    ...item,
    percentage: Math.round((item.count / totalUsers) * 100)
  }))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>User Statistics</CardTitle>
        <CardDescription>
          Overview of user distribution and activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="distribution">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="new">New Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution" className="space-y-4">
            <div className="mt-4 space-y-2">
              {userDistributionWithPercentage.map((item) => (
                <div key={item.role} className="flex items-center">
                  <div className="w-16 text-sm">{item.role}</div>
                  <div className="flex-1 mx-2">
                    <div className="h-2 rounded-full bg-gray-200">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm">{item.count}</div>
                  <div className="w-12 text-right text-sm text-muted-foreground">{item.percentage}%</div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/users?filter=active" className="text-xs text-blue-500 hover:underline flex items-center">
                    View active users
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,156</div>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/analytics" className="text-xs text-blue-500 hover:underline flex items-center">
                    View analytics
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">127</div>
                    <p className="text-xs text-muted-foreground">+5% from average</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Session Duration</CardTitle>
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24m 32s</div>
                    <p className="text-xs text-muted-foreground">Avg. time on site</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
                </CardHeader>
                <CardContent className="h-[150px] flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Chart visualization would go here</p>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/users" className="text-xs text-blue-500 hover:underline flex items-center">
                    Manage all users
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="pt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">New Signups (Last 30 Days)</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">+12% from previous period</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Signup Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-[150px] flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Chart visualization would go here</p>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/users" className="text-xs text-blue-500 hover:underline flex items-center">
                    Manage all users
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
