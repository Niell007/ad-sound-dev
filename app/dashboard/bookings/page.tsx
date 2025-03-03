"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  CheckCircle, 
  ChevronDown, 
  Clock, 
  Download, 
  Filter, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  XCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { BookingService, BookingWithDetails } from "@/lib/services";
import { useToast } from "@/components/ui/custom-toast-provider";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await BookingService.getAll();
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load bookings. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...bookings];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(booking => booking.status === statusFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(booking => 
        booking.client.name.toLowerCase().includes(query) ||
        booking.service.name.toLowerCase().includes(query) ||
        booking.id.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "date-asc":
        result.sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time));
        break;
      case "date-desc":
        result.sort((a, b) => b.date.localeCompare(a.date) || b.start_time.localeCompare(a.start_time));
        break;
      case "client-asc":
        result.sort((a, b) => a.client.name.localeCompare(b.client.name));
        break;
      case "client-desc":
        result.sort((a, b) => b.client.name.localeCompare(a.client.name));
        break;
      case "service-asc":
        result.sort((a, b) => a.service.name.localeCompare(b.service.name));
        break;
      case "service-desc":
        result.sort((a, b) => b.service.name.localeCompare(a.service.name));
        break;
      case "status-asc":
        result.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case "status-desc":
        result.sort((a, b) => b.status.localeCompare(a.status));
        break;
      default:
        break;
    }

    setFilteredBookings(result);
  }, [bookings, searchQuery, statusFilter, sortBy]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await BookingService.updateStatus(bookingId, newStatus);
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus } 
            : booking
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Booking status has been updated to ${newStatus}.`
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">
            Manage your studio bookings and appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/bookings/new">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Booking Management</CardTitle>
              <CardDescription>
                View and manage all your studio bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search bookings..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Date (Newest)</SelectItem>
                      <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                      <SelectItem value="client-asc">Client (A-Z)</SelectItem>
                      <SelectItem value="client-desc">Client (Z-A)</SelectItem>
                      <SelectItem value="service-asc">Service (A-Z)</SelectItem>
                      <SelectItem value="service-desc">Service (Z-A)</SelectItem>
                      <SelectItem value="status-asc">Status (A-Z)</SelectItem>
                      <SelectItem value="status-desc">Status (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      // Loading skeletons
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>{booking.client.name}</TableCell>
                          <TableCell>{booking.service.name}</TableCell>
                          <TableCell>
                            {format(parseISO(booking.date), 'MMM d, yyyy')}
                            <div className="text-xs text-muted-foreground">
                              {booking.start_time} - {booking.end_time}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                booking.status === "confirmed" 
                                  ? "success" 
                                  : booking.status === "pending" 
                                  ? "warning" 
                                  : booking.status === "completed"
                                  ? "default"
                                  : "destructive"
                              }
                              className="capitalize"
                            >
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                booking.payment_status === "paid" 
                                  ? "success" 
                                  : booking.payment_status === "partial" 
                                  ? "warning" 
                                  : "outline"
                              }
                              className="capitalize"
                            >
                              {booking.payment_status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Booking Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/bookings/${booking.id}`}>
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/bookings/${booking.id}/edit`}>
                                    Edit Booking
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                {booking.status !== "confirmed" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "confirmed")}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Mark as Confirmed
                                  </DropdownMenuItem>
                                )}
                                {booking.status !== "pending" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "pending")}>
                                    <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                                    Mark as Pending
                                  </DropdownMenuItem>
                                )}
                                {booking.status !== "completed" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "completed")}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                                    Mark as Completed
                                  </DropdownMenuItem>
                                )}
                                {booking.status !== "cancelled" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "cancelled")}>
                                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                    Mark as Cancelled
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No bookings found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                View your bookings in a calendar format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] rounded-md border border-dashed flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Calendar View</p>
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

