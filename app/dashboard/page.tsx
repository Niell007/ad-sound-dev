"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  Calendar, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Music, 
  Users, 
  XCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookingService, BookingWithDetails, ClientService, PaymentService, ServiceService } from "@/lib/services"
import { format, parseISO } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/custom-toast-provider"

export default function DashboardPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeClients: 0,
    revenue: 0,
    avgSessionDuration: "0 hrs"
  })
  const [recentBookings, setRecentBookings] = useState<BookingWithDetails[]>([])
  const [popularServices, setPopularServices] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch bookings
        const bookings = await BookingService.getAll()
        setRecentBookings(bookings.slice(0, 5))
        
        // Fetch clients
        const clients = await ClientService.getAll()
        
        // Fetch services with booking count
        const servicesWithCount = await ServiceService.getAllWithBookingCount()
        const sortedServices = [...servicesWithCount].sort((a, b) => b.booking_count - a.booking_count).slice(0, 5)
        setPopularServices(sortedServices.map(service => ({
          name: service.name,
          bookings: service.booking_count,
          revenue: `R${(service.price * service.booking_count).toLocaleString()}`
        })))
        
        // Calculate total revenue
        const totalRevenue = await PaymentService.getTotalRevenue()
        
        // Calculate average session duration
        let totalMinutes = 0
        bookings.forEach(booking => {
          const startTime = new Date(`2000-01-01T${booking.start_time}:00`)
          const endTime = new Date(`2000-01-01T${booking.end_time}:00`)
          const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
          totalMinutes += durationMinutes
        })
        const avgMinutes = bookings.length > 0 ? totalMinutes / bookings.length : 0
        const avgHours = Math.floor(avgMinutes / 60)
        const remainingMinutes = Math.round(avgMinutes % 60)
        
        // Set stats
        setStats({
          totalBookings: bookings.length,
          activeClients: clients.filter(client => client.type === 'regular' || client.type === 'premium').length,
          revenue: totalRevenue,
          avgSessionDuration: `${avgHours}h ${remainingMinutes}m`
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [toast])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your studio's performance and upcoming bookings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/bookings/new">New Booking</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">Lifetime bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeClients}</div>
                <p className="text-xs text-muted-foreground">Regular and premium clients</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R{stats.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgSessionDuration}</div>
                <p className="text-xs text-muted-foreground">Based on all bookings</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Activity */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Your studio's latest booking activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <BookingItemSkeleton />
                    <BookingItemSkeleton />
                    <BookingItemSkeleton />
                  </div>
                ) : recentBookings.length > 0 ? (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`rounded-full p-1 ${
                            booking.status === "confirmed" 
                              ? "bg-green-100" 
                              : booking.status === "pending" 
                              ? "bg-yellow-100" 
                              : "bg-red-100"
                          }`}>
                            {booking.status === "confirmed" ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : booking.status === "pending" ? (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{booking.client.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {booking.service.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{format(parseISO(booking.date), 'MMM d, yyyy')}, {booking.start_time}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {booking.id}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No bookings found
                  </div>
                )}
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/bookings">View All Bookings</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Popular Services */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
                <CardDescription>
                  Most booked services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <ServiceItemSkeleton />
                    <ServiceItemSkeleton />
                    <ServiceItemSkeleton />
                  </div>
                ) : popularServices.length > 0 ? (
                  <div className="space-y-4">
                    {popularServices.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-primary/10 p-1">
                            <Music className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{service.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {service.bookings} {service.bookings === 1 ? 'booking' : 'bookings'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{service.revenue}</p>
                          <p className="text-xs text-muted-foreground">revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No services found
                  </div>
                )}
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/services">Manage Services</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
              <CardDescription>
                Your studio's booking calendar for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] rounded-md border">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-[250px] w-full" />
                  </div>
                ) : (
                  <div className="p-4">
                    {recentBookings.length > 0 ? (
                      <div className="space-y-3">
                        {recentBookings.slice(0, 3).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                            <div className="flex items-center gap-3">
                              <div className={`rounded-full p-1 ${
                                booking.status === "confirmed" ? "bg-green-100" : 
                                booking.status === "pending" ? "bg-yellow-100" : "bg-red-100"
                              }`}>
                                {booking.status === "confirmed" ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : booking.status === "pending" ? (
                                  <Clock className="h-4 w-4 text-yellow-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{format(parseISO(booking.date), 'EEE, MMM d')}</p>
                                <p className="text-xs text-muted-foreground">{booking.start_time} - {booking.end_time}</p>
                              </div>
                            </div>
                            <div className="text-sm">{booking.client.name}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
                          <p className="mt-2 text-sm font-medium">No upcoming bookings</p>
                          <p className="text-xs text-muted-foreground">
                            Schedule a new booking to see it here
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                View and manage your recent bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Button asChild>
                  <Link href="/dashboard/bookings">View All Bookings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Services Tab */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services Overview</CardTitle>
              <CardDescription>
                View and manage your service offerings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Button asChild>
                  <Link href="/dashboard/services">View All Services</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  )
}

function BookingItemSkeleton() {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="text-right">
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

function ServiceItemSkeleton() {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="text-right">
        <Skeleton className="h-4 w-16 mb-1" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  )
}
