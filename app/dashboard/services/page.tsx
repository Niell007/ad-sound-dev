"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle, 
  ChevronDown, 
  Clock, 
  DollarSign, 
  Download, 
  Edit, 
  Filter, 
  Music, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceService, Service } from "@/lib/services";
import { useToast } from "@/components/ui/custom-toast-provider";

// Extended service type for UI display that includes analytics data
interface ServiceWithAnalytics extends Service {
  pricePerHour?: string;
  bookings?: number;
  revenue?: string;
}

// Mock data for services
const mockServices: ServiceWithAnalytics[] = [
  {
    id: "S-001",
    name: "Recording Session",
    description: "Professional recording session with engineer",
    duration: "2 hours",
    price: 1030,
    price_per_hour: 515,
    pricePerHour: "R515.00",
    category: "recording",
    status: "active",
    bookings: 78,
    revenue: "R134,000",
    created_at: "",
    updated_at: ""
  },
  {
    id: "S-002",
    name: "Mixing & Mastering",
    description: "Professional mixing and mastering of tracks",
    duration: "3 hours",
    price: 1720,
    price_per_hour: 573.33,
    pricePerHour: "R573.33",
    category: "post-production",
    status: "active",
    bookings: 64,
    revenue: "R110,000",
    created_at: "",
    updated_at: ""
  },
  {
    id: "S-003",
    name: "Podcast Recording",
    description: "Professional podcast recording with engineer",
    duration: "2 hours",
    price: 860,
    price_per_hour: 430,
    pricePerHour: "R430.00",
    category: "recording",
    status: "active",
    bookings: 42,
    revenue: "R72,000",
    created_at: "",
    updated_at: ""
  },
  {
    id: "S-004",
    name: "Voice Over",
    description: "Professional voice over recording with engineer",
    duration: "1 hour",
    price: 515,
    price_per_hour: 515,
    pricePerHour: "R515.00",
    category: "recording",
    status: "active",
    bookings: 36,
    revenue: "R62,000",
    created_at: "",
    updated_at: ""
  },
  {
    id: "S-005",
    name: "Live Sound",
    description: "Live sound engineering for events",
    duration: "4 hours",
    price: 3440,
    price_per_hour: 860,
    pricePerHour: "R860.00",
    category: "live",
    status: "active",
    bookings: 28,
    revenue: "R96,000",
    created_at: "",
    updated_at: ""
  },
  {
    id: "S-006",
    name: "Music Production",
    description: "Full music production with producer",
    duration: "8 hours",
    price: 6880,
    price_per_hour: 860,
    pricePerHour: "R860.00",
    category: "production",
    status: "active",
    bookings: 15,
    revenue: "R103,200",
    created_at: "",
    updated_at: ""
  },
  {
    id: "S-007",
    name: "Rehearsal Space",
    description: "Rehearsal space rental with basic equipment",
    duration: "3 hours",
    price: 860,
    price_per_hour: 286.67,
    pricePerHour: "R286.67",
    category: "rental",
    status: "active",
    bookings: 22,
    revenue: "R18,920",
    created_at: "",
    updated_at: ""
  },
  {
    id: "S-008",
    name: "Equipment Rental",
    description: "Professional audio equipment rental",
    duration: "24 hours",
    price: 2575,
    price_per_hour: 107.29,
    pricePerHour: "R107.29",
    category: "rental",
    status: "inactive",
    bookings: 8,
    revenue: "R20,600",
    created_at: "",
    updated_at: ""
  },
];

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return `R${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export default function ServicesPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [services, setServices] = useState<ServiceWithAnalytics[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceWithAnalytics[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const data = await ServiceService.getAll();
        
        // Transform the data to include UI display properties
        const enhancedData: ServiceWithAnalytics[] = data.map(service => ({
          ...service,
          pricePerHour: formatCurrency(service.price_per_hour),
          bookings: 0, // Default value, would be populated from real data
          revenue: "R0" // Default value, would be populated from real data
        }));
        
        setServices(enhancedData);
        setFilteredServices(enhancedData);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive"
        });
        
        // Use mock data in case of error
        setServices(mockServices);
        setFilteredServices(mockServices);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...services];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(service => service.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(service => service.category === categoryFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(service => 
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "category-asc":
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "category-desc":
        result.sort((a, b) => b.category.localeCompare(a.category));
        break;
      default:
        break;
    }

    setFilteredServices(result);
  }, [services, searchQuery, statusFilter, categoryFilter, sortBy]);

  // Function to handle service status update
  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      setIsUpdating(true);
      await ServiceService.updateStatus(id, status);
      
      // Update the local state
      setServices(services.map(service => 
        service.id === id ? { ...service, status } : service
      ));
      
      toast({
        title: "Status updated",
        description: `Service status has been updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating service status:", error);
      toast({
        title: "Error",
        description: "Failed to update service status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Get unique categories for filter dropdown
  const uniqueCategories = Array.from(
    new Set(services.map((service) => service.category))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground">
            Manage your studio's service offerings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/services/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Service Management</CardTitle>
              <CardDescription>
                View and manage all your studio services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search services..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Status</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Category</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          <span className="capitalize">{category}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      // Loading skeletons
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredServices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <Music className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">No services found</p>
                            <p className="text-xs text-muted-foreground">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredServices.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {service.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {service.duration}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{formatCurrency(service.price)}</p>
                              <p className="text-xs text-muted-foreground">
                                {service.pricePerHour}/hour
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {service.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{service.bookings}</p>
                              <p className="text-xs text-muted-foreground">
                                {service.revenue} revenue
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={service.status === "active" ? "success" : "secondary"}
                              className="capitalize"
                            >
                              {service.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <ChevronDown className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Link href={`/dashboard/services/${service.id}`}>
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/dashboard/services/${service.id}/edit`}>
                                    Edit Service
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/dashboard/bookings/new?service=${service.id}`}>
                                    Create Booking
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {service.status === "active" ? (
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(service.id, "inactive")}>
                                    Mark as Inactive
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleStatusUpdate(service.id, "active")}>
                                    Mark as Active
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-destructive">
                                  Delete Service
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Cards</CardTitle>
              <CardDescription>
                Visual overview of your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card key={`loading-${index}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg"><Skeleton className="h-4 w-32" /></CardTitle>
                            <CardDescription><Skeleton className="h-4 w-48" /></CardDescription>
                          </div>
                          <Badge
                            variant="secondary"
                            className="capitalize"
                          >
                            <Skeleton className="h-6 w-16" />
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-medium flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Skeleton className="h-4 w-16" />
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="font-medium flex items-center">
                              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Skeleton className="h-4 w-16" />
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Category</p>
                            <Badge variant="outline" className="capitalize mt-1">
                              <Skeleton className="h-6 w-24" />
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Bookings</p>
                            <p className="font-medium"><Skeleton className="h-4 w-16" /></p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id={`skeleton-active-${index}`} 
                            checked={false}
                          />
                          <Label htmlFor={`skeleton-active-${index}`}>Active</Label>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" disabled className="text-destructive border-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : filteredServices.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-8">
                    <Music className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">No services found</p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </div>
                ) : (
                  filteredServices.map((service) => (
                    <Card key={service.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                            <CardDescription>{service.description}</CardDescription>
                          </div>
                          <Badge
                            variant={service.status === "active" ? "success" : "secondary"}
                            className="capitalize"
                          >
                            {service.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-medium flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {service.duration}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="font-medium flex items-center">
                              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                              {formatCurrency(service.price)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Category</p>
                            <Badge variant="outline" className="capitalize mt-1">
                              {service.category}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Bookings</p>
                            <p className="font-medium">{service.bookings}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id={`active-${service.id}`} 
                            checked={service.status === "active"}
                            onChange={() => handleStatusUpdate(
                              service.id, 
                              service.status === "active" ? "inactive" : "active"
                            )}
                          />
                          <Label htmlFor={`active-${service.id}`}>Active</Label>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/services/${service.id}/edit`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Analytics</CardTitle>
              <CardDescription>
                Performance metrics for your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Top Performing Services</h3>
                  <div className="space-y-4">
                    {isLoading ? (
                      // Loading skeletons for top services
                      Array.from({ length: 5 }).map((_, index) => (
                        <div key={`top-loading-${index}`} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <span className="text-sm font-bold text-primary">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))
                    ) : services && services.length > 0 ? (
                      // Sort services by revenue and display top 5
                      [...services]
                        .sort((a, b) => {
                          // Safely parse revenue values or default to 0
                          const revenueA = a.revenue ? parseInt(String(a.revenue).replace(/[^0-9]/g, '')) : 0;
                          const revenueB = b.revenue ? parseInt(String(b.revenue).replace(/[^0-9]/g, '')) : 0;
                          return revenueB - revenueA;
                        })
                        .slice(0, 5)
                        .map((service, index) => (
                          <div key={service.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-sm font-bold text-primary">
                                  {index + 1}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{service.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {service.bookings || 0} bookings
                                </p>
                              </div>
                            </div>
                            <p className="font-bold">{service.revenue || 'R0'}</p>
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <Music className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">No service data available</p>
                          <p className="text-xs text-muted-foreground">
                            Add services to see analytics
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Service Category Distribution</h3>
                  <div className="h-[300px] rounded-md border border-dashed flex items-center justify-center">
                    <div className="text-center">
                      <Music className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium">Category Distribution Chart</p>
                      <p className="text-xs text-muted-foreground">
                        This feature is coming soon
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Monthly Booking Trends</h3>
                  <div className="h-[300px] rounded-md border border-dashed flex items-center justify-center">
                    <div className="text-center">
                      <Music className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium">Booking Trends Chart</p>
                      <p className="text-xs text-muted-foreground">
                        This feature is coming soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 