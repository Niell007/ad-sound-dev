"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/custom-toast-provider"
import {
  Radio,
  Calendar,
  Clock,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  BarChart,
  Play,
  Trash2,
  Download,
  Filter,
  Loader2
} from "lucide-react"
import { streamService, StreamLog, StreamLogFilters } from "@/lib/services/stream-service"
import { format, parseISO } from "date-fns"

export default function StreamsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [streams, setStreams] = useState<StreamLog[]>([])
  const [totalStreams, setTotalStreams] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "ended" | "scheduled">("all")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [streamStats, setStreamStats] = useState({
    totalStreams: 0,
    totalDuration: 0,
    averageViewers: 0,
    peakViewers: 0
  })
  
  // Fetch streams with filters and pagination
  const fetchStreams = async () => {
    setIsLoading(true)
    
    try {
      const filters: StreamLogFilters = {}
      
      if (statusFilter !== "all") {
        filters.status = statusFilter
      }
      
      const { data, count } = await streamService.getStreamLogs(
        filters,
        { page: currentPage, pageSize }
      )
      
      // Filter by search query client-side (for simplicity)
      const filteredData = searchQuery
        ? data.filter(stream => 
            stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (stream.description && stream.description.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : data
      
      setStreams(filteredData)
      setTotalStreams(count)
    } catch (error) {
      console.error("Error fetching streams:", error)
      toast({
        title: "Error",
        description: "Failed to load stream history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch user stream stats
  const fetchStreamStats = async () => {
    try {
      const stats = await streamService.getUserStreamStats()
      setStreamStats(stats)
    } catch (error) {
      console.error("Error fetching stream stats:", error)
    }
  }
  
  // Initial data fetch
  useEffect(() => {
    fetchStreams()
    fetchStreamStats()
  }, [currentPage, pageSize, statusFilter])
  
  // Handle search
  const handleSearch = () => {
    fetchStreams()
  }
  
  // Format duration from seconds to HH:MM:SS
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return "00:00"
    
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':')
  }
  
  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A"
    try {
      return format(parseISO(dateString), "MMM d, yyyy h:mm a")
    } catch (error) {
      return "Invalid date"
    }
  }
  
  // Delete stream
  const deleteStream = async (id: string) => {
    setIsDeleting(id)
    
    try {
      await streamService.deleteStreamLog(id)
      
      toast({
        title: "Stream Deleted",
        description: "The stream record has been deleted successfully.",
      })
      
      // Refresh the list
      fetchStreams()
    } catch (error) {
      console.error("Error deleting stream:", error)
      toast({
        title: "Error",
        description: "Failed to delete stream. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }
  
  // Calculate total pages
  const totalPages = Math.ceil(totalStreams / pageSize)
  
  return (
    <div className="space-y-6 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Stream History</h2>
          <p className="text-muted-foreground">View and manage your past and current streams</p>
        </div>
        <Button onClick={() => router.push("/dashboard/media")}>
          <Radio className="mr-2 h-4 w-4" />
          Go Live
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streamStats.totalStreams}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime streams created
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Stream Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(streamStats.totalDuration)}</div>
            <p className="text-xs text-muted-foreground">
              Cumulative streaming duration
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Peak Viewers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streamStats.peakViewers}</div>
            <p className="text-xs text-muted-foreground">
              Highest viewer count achieved
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Stream History</CardTitle>
          <CardDescription>
            View details of your past and current streams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search streams..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Streams</SelectItem>
                  <SelectItem value="live">Live Now</SelectItem>
                  <SelectItem value="ended">Completed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Streams per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : streams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Radio className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No streams found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery
                  ? "No streams match your search criteria"
                  : "You haven't created any streams yet"}
              </p>
              <Button className="mt-4" onClick={() => router.push("/dashboard/media")}>
                Create Your First Stream
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {streams.map((stream) => (
                <div
                  key={stream.id}
                  className="flex flex-col space-y-2 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{stream.title}</h3>
                      <Badge variant={stream.status === "live" ? "destructive" : stream.status === "scheduled" ? "outline" : "secondary"}>
                        {stream.status === "live" ? "Live Now" : stream.status === "scheduled" ? "Scheduled" : "Completed"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/dashboard/streams/${stream.id}`}>
                          <BarChart className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteStream(stream.id)}
                        disabled={isDeleting === stream.id}
                      >
                        {isDeleting === stream.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {stream.description && (
                    <p className="text-sm text-muted-foreground">{stream.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(stream.started_at)}
                    </div>
                    
                    {stream.duration ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(stream.duration)}
                      </div>
                    ) : null}
                    
                    {stream.viewer_peak ? (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {stream.viewer_peak} peak viewers
                      </div>
                    ) : null}
                  </div>
                  
                  {stream.status === "live" && (
                    <div className="mt-2">
                      <Button size="sm" variant="secondary" onClick={() => router.push("/dashboard/media")}>
                        <Play className="h-4 w-4 mr-2" />
                        Join Stream
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {!isLoading && streams.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min((currentPage - 1) * pageSize + 1, totalStreams)} to{" "}
                {Math.min(currentPage * pageSize, totalStreams)} of {totalStreams} streams
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages || 1}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 