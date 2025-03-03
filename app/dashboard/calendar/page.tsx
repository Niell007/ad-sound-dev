"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Download, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  Search, 
  User,
  X
} from "lucide-react";
import { format, addDays, subDays, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths, isSameDay, isSameMonth, isToday, parseISO, setHours, setMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { 
  DndContext, 
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor, 
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// Mock data for bookings
const initialBookings = [
  {
    id: "B-1234",
    client: "John Doe",
    email: "john.doe@example.com",
    phone: "(012) 345-6789",
    service: "Recording Session",
    date: "2025-02-28",
    startTime: "14:00",
    endTime: "16:00",
    status: "confirmed",
    amount: "R2,060.00",
    notes: "Bringing own instruments",
    color: "#4f46e5", // indigo
  },
  {
    id: "B-1235",
    client: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(023) 456-7890",
    service: "Mixing & Mastering",
    date: "2025-03-01",
    startTime: "10:00",
    endTime: "13:00",
    status: "pending",
    amount: "R3,090.00",
    notes: "Final mix for album",
    color: "#f59e0b", // amber
  },
  {
    id: "B-1236",
    client: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "(034) 567-8901",
    service: "Podcast Recording",
    date: "2025-03-02",
    startTime: "15:30",
    endTime: "17:30",
    status: "confirmed",
    amount: "R1,720.00",
    notes: "3 guests",
    color: "#4f46e5", // indigo
  },
  {
    id: "B-1237",
    client: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "(045) 678-9012",
    service: "Voice Over",
    date: "2025-03-03",
    startTime: "11:00",
    endTime: "12:00",
    status: "cancelled",
    amount: "R1,030.00",
    notes: "Commercial voice over",
    color: "#ef4444", // red
  },
  {
    id: "B-1238",
    client: "David Brown",
    email: "david.brown@example.com",
    phone: "(056) 789-0123",
    service: "Live Sound",
    date: "2025-03-04",
    startTime: "17:00",
    endTime: "21:00",
    status: "confirmed",
    amount: "R4,120.00",
    notes: "Local venue setup",
    color: "#4f46e5", // indigo
  },
  {
    id: "B-1239",
    client: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "(067) 890-1234",
    service: "Recording Session",
    date: "2025-03-05",
    startTime: "13:00",
    endTime: "15:00",
    status: "pending",
    amount: "R2,060.00",
    notes: "Solo artist",
    color: "#f59e0b", // amber
  },
  {
    id: "B-1240",
    client: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "(078) 901-2345",
    service: "Mixing & Mastering",
    date: "2025-03-06",
    startTime: "16:00",
    endTime: "19:00",
    status: "confirmed",
    amount: "R3,090.00",
    notes: "EP mixing",
    color: "#4f46e5", // indigo
  },
  {
    id: "B-1241",
    client: "Jessica Taylor",
    email: "jessica.taylor@example.com",
    phone: "(089) 012-3456",
    service: "Podcast Recording",
    date: "2025-03-07",
    startTime: "10:30",
    endTime: "12:30",
    status: "confirmed",
    amount: "R1,720.00",
    notes: "Weekly podcast",
    color: "#4f46e5", // indigo
  },
  {
    id: "B-1242",
    client: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(090) 123-4567",
    service: "Recording Session",
    date: "2025-03-10",
    startTime: "14:00",
    endTime: "17:00",
    status: "confirmed",
    amount: "R3,090.00",
    notes: "Full band recording",
    color: "#4f46e5", // indigo
  },
  {
    id: "B-1243",
    client: "Amanda Lee",
    email: "amanda.lee@example.com",
    phone: "(012) 345-6789",
    service: "Voice Over",
    date: "2025-03-12",
    startTime: "09:00",
    endTime: "10:00",
    status: "confirmed",
    amount: "R1,030.00",
    notes: "Audiobook recording",
    color: "#4f46e5", // indigo
  },
];

// Helper function to get days of the month
const getDaysOfMonth = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = [];
  
  // Get the Monday before the start of the month if the month doesn't start on Monday
  let currentDay = startOfWeek(start, { weekStartsOn: 1 });
  
  // Continue until we reach the Sunday after the end of the month
  while (currentDay <= endOfWeek(end, { weekStartsOn: 1 })) {
    days.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }
  
  return days;
};

// Helper function to get days of the week
const getDaysOfWeek = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }
  
  return days;
};

// Helper function to get time slots
const getTimeSlots = () => {
  const slots = [];
  for (let i = 8; i < 20; i++) { // 8 AM to 8 PM
    slots.push(`${i}:00`);
  }
  return slots;
};

// Helper function to get booking for a specific day
const getBookingsForDay = (date: Date) => {
  const dateString = format(date, 'yyyy-MM-dd');
  return initialBookings.filter(booking => booking.date === dateString);
};

// Helper function to get booking for a specific time slot
const getBookingsForTimeSlot = (date: Date, timeSlot: string) => {
  const dateString = format(date, 'yyyy-MM-dd');
  const hour = parseInt(timeSlot.split(':')[0]);
  
  return initialBookings.filter(booking => {
    if (booking.date !== dateString) return false;
    
    const startHour = parseInt(booking.startTime.split(':')[0]);
    const endHour = parseInt(booking.endTime.split(':')[0]);
    
    return startHour <= hour && endHour > hour;
  });
};

// Draggable Booking Component
function DraggableBooking({ booking, onClick }: { booking: any, onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: booking.id,
    data: { booking },
  });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: booking.color,
  };

  return (
    <div 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      className="p-1 rounded-md text-white text-sm cursor-grab mb-1"
      style={style}
      onClick={onClick}
    >
      <p className="font-medium truncate">{booking.client}</p>
      <p className="truncate">{booking.service}</p>
      <p className="text-xs">{booking.startTime} - {booking.endTime}</p>
    </div>
  );
}

// Droppable Time Slot Component
function DroppableTimeSlot({ 
  id, 
  children, 
  className,
  day,
  timeSlot,
  onCreateBooking
}: { 
  id: string, 
  children: React.ReactNode, 
  className?: string,
  day: Date,
  timeSlot: string,
  onCreateBooking: (day: Date, timeSlot: string) => void
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  
  const handleClick = (e: React.MouseEvent) => {
    // Only trigger if clicking directly on the time slot (not on a booking)
    if (e.currentTarget === e.target) {
      onCreateBooking(day, timeSlot);
    }
  };
  
  return (
    <div 
      ref={setNodeRef} 
      className={`${className} ${isOver ? 'bg-primary/10' : ''} cursor-pointer`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState(initialBookings);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragBooking, setActiveDragBooking] = useState<any>(null);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Local toast implementation
  const [toasts, setToasts] = useState<any[]>([]);
  const toast = useMemo(() => ({
    // Simple toast implementation that doesn't rely on context
    success: (message: string) => {
      console.log("Toast success:", message);
      // Create a temporary element to show the toast
      const toastId = Math.random().toString(36).substring(2, 9);
      setToasts(prev => [...prev, { id: toastId, message, type: 'success' }]);
      
      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, 3000);
    },
    error: (message: string) => {
      console.log("Toast error:", message);
      // Create a temporary element to show the toast
      const toastId = Math.random().toString(36).substring(2, 9);
      setToasts(prev => [...prev, { id: toastId, message, type: 'error' }]);
      
      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, 3000);
    }
  }), []);
  
  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  // Get unique services for filter dropdown - moved to useMemo to avoid render issues
  const uniqueServices = useMemo(() => {
    return Array.from(new Set(bookings.map((booking) => booking.service)));
  }, [bookings]);
  
  // Navigation functions
  const navigatePrevious = () => {
    if (view === 'day') {
      setCurrentDate(subDays(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };
  
  const navigateNext = () => {
    if (view === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };
  
  const navigateToday = () => {
    setCurrentDate(new Date());
  };
  
  // Format date range for header
  const formatDateRange = () => {
    if (view === 'day') {
      return format(currentDate, 'MMMM d, yyyy');
    } else if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  };

  // Handle drag start
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Find the booking being dragged
    const draggedBooking = bookings.find(booking => booking.id === active.id);
    if (draggedBooking) {
      setActiveDragBooking(draggedBooking);
    }
  }
  
  // Handle drag end
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Extract day and time information from the drop target ID
      // Format of over.id is expected to be "timeslot-{day}-{time}"
      const [_, dayIndex, timeSlot] = (over.id as string).split('-');
      
      // Get the day that corresponds to the drop target
      const day = getDaysOfWeek(currentDate)[parseInt(dayIndex)];
      const hour = parseInt(timeSlot);
      
      // Update the booking with the new date and time
      setBookings(prevBookings => 
        prevBookings.map(booking => {
          if (booking.id === active.id) {
            // Create a new date object for the booking's new date
            const newDate = format(day, 'yyyy-MM-dd');
            
            // Calculate new start and end times
            // Assuming bookings have fixed duration, we maintain the same duration
            const oldStartHour = parseInt(booking.startTime.split(':')[0]);
            const oldEndHour = parseInt(booking.endTime.split(':')[0]);
            const duration = oldEndHour - oldStartHour;
            
            const newStartTime = `${hour}:00`;
            const newEndTime = `${hour + duration}:00`;
            
            // Show a toast notification
            toast.success(`${booking.client}'s ${booking.service} moved to ${format(day, 'MMM d')} at ${newStartTime}`);
            
            return {
              ...booking,
              date: newDate,
              startTime: newStartTime,
              endTime: newEndTime
            };
          }
          return booking;
        })
      );
    }
    
    // Reset the active drag state
    setActiveId(null);
    setActiveDragBooking(null);
  }

  // Render a draggable booking
  const renderBooking = (booking: any, isOverlay = false) => {
    return (
      <div 
        className={`p-1 rounded-md text-white text-sm ${isOverlay ? 'shadow-lg' : 'cursor-grab'} mb-1`}
        style={{ 
          backgroundColor: booking.color,
          opacity: isOverlay ? 0.8 : 1,
          transform: isOverlay ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        <p className="font-medium truncate">{booking.client}</p>
        <p className="truncate">{booking.service}</p>
        <p className="text-xs">{booking.startTime} - {booking.endTime}</p>
      </div>
    );
  };
  
  // Handle creating a new booking
  const handleCreateBooking = (day: Date, timeSlot: string) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    const hour = timeSlot.split(':')[0];
    
    // Calculate end time (default to 1 hour later)
    const endHour = parseInt(hour) + 1;
    const endTime = `${endHour}:00`;
    
    // Redirect to new booking page with pre-filled date and time
    window.location.href = `/dashboard/bookings/new?date=${formattedDate}&startTime=${timeSlot}&endTime=${endTime}`;
    
    // Alternatively, you could show a modal/dialog here instead of redirecting
  };
  
  // Handle editing a booking
  const handleEditBooking = (booking: any) => {
    setEditingBooking({...booking});
    setIsEditDialogOpen(true);
  };
  
  // Handle saving edited booking
  const handleSaveBooking = () => {
    if (!editingBooking) return;
    
    // Update the booking in the state
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === editingBooking.id ? editingBooking : booking
      )
    );
    
    // Show success toast
    toast.success(`${editingBooking.client}'s booking has been updated.`);
    
    // Close the dialog
    setIsEditDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">
            View and manage your studio's booking schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/bookings/new">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={navigateToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">{formatDateRange()}</h3>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center space-x-2">
              <Tabs defaultValue={view} onValueChange={(value) => setView(value as 'day' | 'week' | 'month')}>
                <TabsList>
                  <TabsTrigger value="day">
                    Day
                  </TabsTrigger>
                  <TabsTrigger value="week">
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="month">
                    Month
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8 sm:w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {uniqueServices.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {/* Custom toast display */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
              {toasts.map(toast => (
                <div 
                  key={toast.id} 
                  className={`p-4 rounded-md shadow-md transition-all duration-300 ${
                    toast.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                    'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}
                >
                  {toast.message}
                </div>
              ))}
            </div>
            
            {/* Day View */}
            {view === 'day' && (
              <div className="space-y-2">
                <div className="border-b p-4">
                  <h3 className="text-lg font-semibold">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h3>
                </div>
                <div className="grid grid-cols-1 divide-y">
                  {getTimeSlots().map((timeSlot) => {
                    const bookingsForSlot = getBookingsForTimeSlot(currentDate, timeSlot);
                    const hour = parseInt(timeSlot.split(':')[0]);
                    const slotId = `day-timeslot-${hour}`;
                    
                    return (
                      <div key={timeSlot} className="flex min-h-[100px]">
                        <div className="w-20 py-2 text-sm text-muted-foreground text-right pr-4 pt-3">
                          {timeSlot}
                        </div>
                        <DroppableTimeSlot
                          id={slotId}
                          className="flex-1 border-l p-2 relative"
                          day={currentDate}
                          timeSlot={timeSlot}
                          onCreateBooking={handleCreateBooking}
                        >
                          {bookingsForSlot.length === 0 ? (
                            <div className="h-full w-full border border-dashed rounded-md flex items-center justify-center">
                              <span className="text-sm text-muted-foreground">No bookings</span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {bookingsForSlot.map((booking) => (
                                <div 
                                  key={booking.id}
                                  className="p-2 rounded-md text-white"
                                  style={{ backgroundColor: booking.color }}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">{booking.client}</p>
                                      <p className="text-sm">{booking.service}</p>
                                    </div>
                                    <div className="text-sm">
                                      {booking.startTime} - {booking.endTime}
                                    </div>
                                  </div>
                                  <div className="mt-1 text-sm">
                                    {booking.notes && <p>{booking.notes}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </DroppableTimeSlot>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Week View with Drag and Drop */}
            {view === 'week' && (
              <DndContext 
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="space-y-2">
                  <div className="grid grid-cols-7 border-b">
                    {getDaysOfWeek(currentDate).map((day, index) => (
                      <div 
                        key={index} 
                        className={`text-center py-2 ${isToday(day) ? 'bg-primary/10 font-bold' : ''}`}
                      >
                        <p className="text-sm text-muted-foreground">
                          {format(day, 'EEE')}
                        </p>
                        <p className={`text-lg ${isToday(day) ? 'text-primary' : ''}`}>
                          {format(day, 'd')}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 divide-y">
                    {getTimeSlots().map((timeSlot, timeIndex) => (
                      <div key={timeSlot} className="flex min-h-[100px]">
                        <div className="w-20 py-2 text-sm text-muted-foreground text-right pr-4 pt-3">
                          {timeSlot}
                        </div>
                        <div className="flex-1 grid grid-cols-7 border-l">
                          {getDaysOfWeek(currentDate).map((day, dayIndex) => {
                            const bookingsForSlot = getBookingsForTimeSlot(day, timeSlot);
                            const hour = parseInt(timeSlot.split(':')[0]);
                            const slotId = `timeslot-${dayIndex}-${hour}`;
                            
                            return (
                              <DroppableTimeSlot 
                                key={dayIndex} 
                                id={slotId}
                                className={`p-1 border-r last:border-r-0 ${isToday(day) ? 'bg-primary/5' : ''} min-h-[100px] relative`}
                                day={day}
                                timeSlot={timeSlot}
                                onCreateBooking={handleCreateBooking}
                              >
                                {bookingsForSlot.length === 0 && (
                                  <div className="h-full w-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Booking
                                    </Button>
                                  </div>
                                )}
                                {bookingsForSlot.map((booking) => (
                                  <Popover key={booking.id}>
                                    <PopoverTrigger asChild>
                                      <div>
                                        <DraggableBooking booking={booking} />
                                      </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <h4 className="font-semibold">{booking.service}</h4>
                                          <Badge variant={
                                            booking.status === "confirmed" 
                                              ? "success" 
                                              : booking.status === "pending" 
                                              ? "warning" 
                                              : "destructive"
                                          }>
                                            {booking.status}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Avatar className="h-8 w-8">
                                            <AvatarImage src="/placeholder-avatar.jpg" alt={booking.client} />
                                            <AvatarFallback>{booking.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="text-sm font-medium">{booking.client}</p>
                                            <p className="text-xs text-muted-foreground">{booking.email}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                          <span>{format(parseISO(booking.date), 'MMMM d, yyyy')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <Clock className="h-4 w-4 text-muted-foreground" />
                                          <span>{booking.startTime} - {booking.endTime}</span>
                                        </div>
                                        {booking.notes && (
                                          <p className="text-sm border-t pt-2 mt-2">{booking.notes}</p>
                                        )}
                                        <div className="flex justify-between mt-4">
                                          <Button variant="outline" size="sm" asChild>
                                            <Link href={`/dashboard/bookings/${booking.id}`}>
                                              View Details
                                            </Link>
                                          </Button>
                                          <Button 
                                            variant="default" 
                                            size="sm"
                                            onClick={() => handleEditBooking(booking)}
                                          >
                                            Edit
                                          </Button>
                                        </div>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                ))}
                              </DroppableTimeSlot>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Drag Overlay */}
                <DragOverlay>
                  {activeId && activeDragBooking ? renderBooking(activeDragBooking, true) : null}
                </DragOverlay>
              </DndContext>
            )}

            {/* Month View */}
            {view === 'month' && (
              <div className="space-y-2">
                <div className="grid grid-cols-7 border-b">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center py-2 text-sm font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-muted">
                  {getDaysOfMonth(currentDate).map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const bookingsForDay = getBookingsForDay(day);
                    
                    return (
                      <div
                        key={i}
                        className={`min-h-[120px] bg-background p-2 ${
                          !isCurrentMonth ? 'text-muted-foreground' : ''
                        } ${isToday(day) ? 'bg-primary/5' : ''} cursor-pointer hover:bg-muted/50 transition-colors`}
                        onClick={() => {
                          setCurrentDate(day);
                          setView('day');
                        }}
                      >
                        <div className="flex justify-between">
                          <span className={`text-sm ${isToday(day) ? 'bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center' : ''}`}>
                            {format(day, 'd')}
                          </span>
                          {bookingsForDay.length > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                              {bookingsForDay.length}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
                          {bookingsForDay.slice(0, 3).map((booking) => (
                            <div
                              key={booking.id}
                              className="text-xs rounded px-1 py-0.5 truncate"
                              style={{ backgroundColor: `${booking.color}20`, color: booking.color }}
                            >
                              {booking.startTime} {booking.client}
                            </div>
                          ))}
                          {bookingsForDay.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{bookingsForDay.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Edit Booking Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Make changes to the booking details below.
            </DialogDescription>
          </DialogHeader>
          {editingBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client" className="text-right">
                  Client
                </Label>
                <Input
                  id="client"
                  value={editingBooking.client}
                  onChange={(e) => setEditingBooking({...editingBooking, client: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                  Service
                </Label>
                <Select 
                  value={editingBooking.service} 
                  onValueChange={(value) => setEditingBooking({...editingBooking, service: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueServices.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={editingBooking.date}
                  onChange={(e) => setEditingBooking({...editingBooking, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={editingBooking.startTime}
                  onChange={(e) => setEditingBooking({...editingBooking, startTime: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={editingBooking.endTime}
                  onChange={(e) => setEditingBooking({...editingBooking, endTime: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select 
                  value={editingBooking.status} 
                  onValueChange={(value) => setEditingBooking({...editingBooking, status: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={editingBooking.notes || ''}
                  onChange={(e) => setEditingBooking({...editingBooking, notes: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBooking}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Toaster component for notifications */}
      <Toaster />
    </div>
  );
}

