"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Track your studio's performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Bookings</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">248</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <span className="i-lucide-arrow-up-right mr-1"></span>
                  12% increase from previous period
                </p>
                <div className="h-[200px] mt-4 flex items-center justify-center">
                  <LineChart className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">R215,680</div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <span className="i-lucide-arrow-up-right mr-1"></span>
                  15% increase from previous period
                </p>
                <div className="h-[200px] mt-4 flex items-center justify-center">
                  <BarChart className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Service Distribution</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5 services</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Most popular: Recording Session (31%)
                </p>
                <div className="h-[200px] mt-4 flex items-center justify-center">
                  <PieChart className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>
                Booking and revenue trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] rounded-md border border-dashed flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Trend Analysis</p>
                  <p className="text-xs text-muted-foreground">
                    This feature is coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Analytics</CardTitle>
              <CardDescription>
                Detailed booking metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] rounded-md border border-dashed flex items-center justify-center">
                <div className="text-center">
                  <BarChart className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Booking Analytics</p>
                  <p className="text-xs text-muted-foreground">
                    This feature is coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>
                Financial performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] rounded-md border border-dashed flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Revenue Analytics</p>
                  <p className="text-xs text-muted-foreground">
                    This feature is coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Analytics</CardTitle>
              <CardDescription>
                Performance metrics by service type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] rounded-md border border-dashed flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Service Analytics</p>
                  <p className="text-xs text-muted-foreground">
                    This feature is coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 