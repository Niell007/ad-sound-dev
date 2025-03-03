"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpRight, 
  BarChart, 
  LineChart, 
  PieChart, 
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingService, PaymentService, ServiceService } from "@/lib/services";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/custom-toast-provider";
import { format, subDays, parseISO } from "date-fns";

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("30days");
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    bookingChange: 0,
    totalRevenue: 0,
    revenueChange: 0,
    serviceDistribution: {
      total: 0,
      mostPopular: "",
      mostPopularPercentage: 0
    }
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        
        // Get date range based on selected period
        const today = new Date();
        let startDate;
        
        switch(period) {
          case "7days":
            startDate = subDays(today, 7);
            break;
          case "90days":
            startDate = subDays(today, 90);
            break;
          case "year":
            startDate = new Date(today.getFullYear(), 0, 1); // Jan 1st of current year
            break;
          default: // 30days
            startDate = subDays(today, 30);
        }
        
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(today, 'yyyy-MM-dd');
        
        // Fetch bookings
        const bookings = await BookingService.getAll();
        const filteredBookings = bookings.filter(booking => 
          new Date(booking.date) >= startDate && new Date(booking.date) <= today
        );
        
        // Calculate booking change (comparing to previous period)
        const previousPeriodStart = subDays(startDate, startDate.getTime() - today.getTime());
        const previousPeriodBookings = bookings.filter(booking => 
          new Date(booking.date) >= previousPeriodStart && new Date(booking.date) < startDate
        );
        
        const bookingChange = previousPeriodBookings.length > 0 
          ? ((filteredBookings.length - previousPeriodBookings.length) / previousPeriodBookings.length) * 100 
          : 100;
        
        // Fetch revenue for the period
        const revenue = await PaymentService.getRevenueByPeriod(formattedStartDate, formattedEndDate);
        
        // Calculate revenue change (comparing to previous period)
        const previousPeriodStartFormatted = format(previousPeriodStart, 'yyyy-MM-dd');
        const previousPeriodEndFormatted = format(subDays(startDate, 1), 'yyyy-MM-dd');
        
        const previousRevenue = await PaymentService.getRevenueByPeriod(
          previousPeriodStartFormatted, 
          previousPeriodEndFormatted
        );
        
        const revenueChange = previousRevenue > 0 
          ? ((revenue - previousRevenue) / previousRevenue) * 100 
          : 100;
        
        // Get service distribution
        const servicesWithCount = await ServiceService.getAllWithBookingCount();
        const totalServices = servicesWithCount.length;
        
        // Find most popular service
        let mostPopular = { name: "None", booking_count: 0 };
        let totalBookingCount = 0;
        
        servicesWithCount.forEach(service => {
          totalBookingCount += service.booking_count;
          if (service.booking_count > mostPopular.booking_count) {
            mostPopular = service;
          }
        });
        
        const mostPopularPercentage = totalBookingCount > 0 
          ? Math.round((mostPopular.booking_count / totalBookingCount) * 100) 
          : 0;
        
        // Update state
        setAnalytics({
          totalBookings: filteredBookings.length,
          bookingChange,
          totalRevenue: revenue,
          revenueChange,
          serviceDistribution: {
            total: totalServices,
            mostPopular: mostPopular.name,
            mostPopularPercentage
          }
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [period, toast]);

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
          <Select value={period} onValueChange={setPeriod}>
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
                <CardDescription>
                  {period === "7days" ? "Last 7 days" : 
                   period === "30days" ? "Last 30 days" : 
                   period === "90days" ? "Last 90 days" : "This year"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">{analytics.totalBookings}</div>
                    <p className={`text-xs flex items-center mt-1 ${
                      analytics.bookingChange >= 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      {analytics.bookingChange >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(Math.round(analytics.bookingChange))}% {analytics.bookingChange >= 0 ? "increase" : "decrease"} from previous period
                    </p>
                    <div className="h-[200px] mt-4 flex items-center justify-center">
                      <LineChart className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Revenue</CardTitle>
                <CardDescription>
                  {period === "7days" ? "Last 7 days" : 
                   period === "30days" ? "Last 30 days" : 
                   period === "90days" ? "Last 90 days" : "This year"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">R{analytics.totalRevenue.toLocaleString()}</div>
                    <p className={`text-xs flex items-center mt-1 ${
                      analytics.revenueChange >= 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      {analytics.revenueChange >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(Math.round(analytics.revenueChange))}% {analytics.revenueChange >= 0 ? "increase" : "decrease"} from previous period
                    </p>
                    <div className="h-[200px] mt-4 flex items-center justify-center">
                      <BarChart className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Service Distribution</CardTitle>
                <CardDescription>
                  {period === "7days" ? "Last 7 days" : 
                   period === "30days" ? "Last 30 days" : 
                   period === "90days" ? "Last 90 days" : "This year"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">{analytics.serviceDistribution.total} services</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Most popular: {analytics.serviceDistribution.mostPopular} ({analytics.serviceDistribution.mostPopularPercentage}%)
                    </p>
                    <div className="h-[200px] mt-4 flex items-center justify-center">
                      <PieChart className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </>
                )}
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
              {isLoading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="h-[400px] rounded-md border border-dashed flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">Trend Analysis</p>
                    <p className="text-xs text-muted-foreground">
                      This feature is coming soon
                    </p>
                  </div>
                </div>
              )}
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
              {isLoading ? (
                <div className="flex items-center justify-center h-[500px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="h-[500px] rounded-md border border-dashed flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">Booking Analytics</p>
                    <p className="text-xs text-muted-foreground">
                      This feature is coming soon
                    </p>
                  </div>
                </div>
              )}
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
              {isLoading ? (
                <div className="flex items-center justify-center h-[500px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="h-[500px] rounded-md border border-dashed flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">Revenue Analytics</p>
                    <p className="text-xs text-muted-foreground">
                      This feature is coming soon
                    </p>
                  </div>
                </div>
              )}
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
              {isLoading ? (
                <div className="flex items-center justify-center h-[500px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="h-[500px] rounded-md border border-dashed flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">Service Analytics</p>
                    <p className="text-xs text-muted-foreground">
                      This feature is coming soon
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}