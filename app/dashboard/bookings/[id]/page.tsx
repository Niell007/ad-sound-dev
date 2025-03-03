"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Edit, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Music, 
  Phone, 
  Printer, 
  Trash2, 
  User, 
  XCircle 
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/custom-toast-provider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BookingService } from "@/lib/services/booking-service";
import { MessageService, Message } from "@/lib/services/message-service";
import { useUser } from "@/lib/hooks/use-user";

// Mock booking data
const bookingsData = [
  {
    id: "B-1234",
    client: {
      id: "C-1001",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(012) 345-6789",
      avatar: "/placeholder-avatar.jpg",
      type: "regular",
      totalBookings: 8,
    },
    service: {
      id: "S-001",
      name: "Recording Session",
      description: "Professional recording session with engineer",
      duration: "2 hours",
      price: "R1,030.00",
      category: "recording",
    },
    date: "2025-02-28",
    startTime: "14:00",
    endTime: "16:00",
    status: "confirmed",
    paymentStatus: "paid",
    amount: "R2,060.00",
    depositAmount: "R1,030.00",
    depositPaid: true,
    notes: "Bringing own instruments. Needs microphone setup for acoustic guitar and vocals.",
    equipment: "Neumann U87, API 512c, Acoustic Panels",
    location: "Studio A",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-20T14:45:00Z",
    history: [
      {
        action: "Booking created",
        timestamp: "2025-01-15T10:30:00Z",
        user: "Admin User",
      },
      {
        action: "Deposit payment received",
        timestamp: "2025-01-16T15:20:00Z",
        user: "System",
      },
      {
        action: "Booking confirmed",
        timestamp: "2025-01-16T15:25:00Z",
        user: "Admin User",
      },
      {
        action: "Full payment received",
        timestamp: "2025-01-20T14:45:00Z",
        user: "System",
      },
    ],
    messages: [
      {
        id: "M-001",
        sender: "Admin User",
        content: "Your booking has been confirmed. Please arrive 15 minutes early for setup.",
        timestamp: "2025-01-16T15:30:00Z",
      },
      {
        id: "M-002",
        sender: "John Doe",
        content: "Thanks for confirming. I'll be bringing my own guitar. Do you have a keyboard available?",
        timestamp: "2025-01-17T09:15:00Z",
      },
      {
        id: "M-003",
        sender: "Admin User",
        content: "Yes, we have a Nord Stage 3 available. Let me know if you need anything else.",
        timestamp: "2025-01-17T10:30:00Z",
      },
    ],
  },
  {
    id: "B-1235",
    client: {
      id: "C-1002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(023) 456-7890",
      avatar: "/placeholder-avatar.jpg",
      type: "premium",
      totalBookings: 12,
    },
    service: {
      id: "S-002",
      name: "Mixing & Mastering",
      description: "Professional mixing and mastering of tracks",
      duration: "3 hours",
      price: "R1,720.00",
      category: "post-production",
    },
    date: "2025-03-01",
    startTime: "10:00",
    endTime: "13:00",
    status: "pending",
    paymentStatus: "partial",
    amount: "R3,090.00",
    depositAmount: "R1,545.00",
    depositPaid: true,
    notes: "Final mix for album. 12 tracks total.",
    equipment: "Pro Tools, Waves Plugins, Focal Monitors",
    location: "Studio B",
    createdAt: "2025-01-20T11:15:00Z",
    updatedAt: "2025-01-22T09:30:00Z",
    history: [
      {
        action: "Booking created",
        timestamp: "2025-01-20T11:15:00Z",
        user: "Admin User",
      },
      {
        action: "Deposit payment received",
        timestamp: "2025-01-22T09:30:00Z",
        user: "System",
      },
    ],
    messages: [
      {
        id: "M-004",
        sender: "Admin User",
        content: "We've received your deposit. Please send the audio files at least 24 hours before your session.",
        timestamp: "2025-01-22T09:45:00Z",
      },
      {
        id: "M-005",
        sender: "Jane Smith",
        content: "I'll send the files tomorrow. Do you prefer WAV or AIFF format?",
        timestamp: "2025-01-22T14:20:00Z",
      },
      {
        id: "M-006",
        sender: "Admin User",
        content: "WAV files would be best. Please ensure they're at least 24-bit/48kHz.",
        timestamp: "2025-01-22T15:05:00Z",
      },
    ],
  },
];

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const { user } = useUser();
  
  // State for booking and messages
  const [booking, setBooking] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  
  // Add the useToast hook
  const { toast } = useToast();
  
  // Fetch booking and messages
  useEffect(() => {
    const fetchBookingAndMessages = async () => {
      try {
        setIsLoading(true);
        
        // Check if the booking ID is in the mock format (e.g., "B-1234")
        const isMockId = bookingId.startsWith('B-');
        
        if (isMockId) {
          // Use mock data for IDs that start with "B-"
          const mockBooking = bookingsData.find(b => b.id === bookingId);
          if (mockBooking) {
            setBooking(mockBooking);
            setMessages(mockBooking.messages.map(m => ({
              id: m.id,
              booking_id: bookingId,
              sender_id: m.sender === "Admin User" ? "admin" : "client",
              content: m.content,
              created_at: m.timestamp,
              is_read: true
            })));
          } else {
            // Mock booking not found
            setBooking(null);
          }
        } else {
          // Try to fetch from the database for UUID format IDs
          try {
            // Fetch booking details
            const bookingData = await BookingService.getById(bookingId);
            setBooking(bookingData);
            
            // Fetch messages for this booking
            const messagesData = await MessageService.getByBookingId(bookingId);
            setMessages(messagesData);
            
            // Mark messages as read
            if (user?.id) {
              await MessageService.markAsRead(bookingId, user.id);
            }
          } catch (error) {
            console.error("Error fetching booking details:", error);
            
            // Check if we should try mock data as fallback
            const mockBooking = bookingsData.find(b => b.id.toLowerCase() === bookingId.toLowerCase());
            if (mockBooking) {
              setBooking(mockBooking);
              setMessages(mockBooking.messages.map(m => ({
                id: m.id,
                booking_id: bookingId,
                sender_id: m.sender === "Admin User" ? "admin" : "client",
                content: m.content,
                created_at: m.timestamp,
                is_read: true
              })));
              
              toast({
                title: "Using Demo Data",
                description: "Showing demo booking data as a fallback.",
              });
            } else {
              // No mock data found either
              setBooking(null);
              toast({
                title: "Error",
                description: "Failed to load booking details. Please try again.",
                variant: "destructive"
              });
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    if (bookingId) {
      fetchBookingAndMessages();
    }
  }, [bookingId, user?.id, toast]);
  
  // If loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading booking details...</p>
      </div>
    );
  }
  
  // If booking not found
  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <XCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold">Booking Not Found</h2>
        <p className="text-muted-foreground mb-6">The booking you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/dashboard/bookings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>
      </div>
    );
  }
  
  // Format dates
  const formattedDate = format(parseISO(booking.date), 'EEEE, MMMM d, yyyy');
  const formattedCreatedAt = format(new Date(booking.created_at || booking.createdAt), 'MMM d, yyyy h:mm a');
  const formattedUpdatedAt = format(new Date(booking.updated_at || booking.updatedAt), 'MMM d, yyyy h:mm a');
  
  // Handle message send
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return;
    
    try {
      // Check if we're using mock data
      const isMockId = bookingId.startsWith('B-');
      
      if (isMockId) {
        // For mock data, just update the local state
        const newMockMessage = {
          id: `M-${Date.now()}`,
          booking_id: bookingId,
          sender_id: user.id,
          content: newMessage.trim(),
          created_at: new Date().toISOString(),
          is_read: true
        };
        
        setMessages(prev => [...prev, newMockMessage]);
        
        toast({
          title: "Message Sent (Demo)",
          description: "This is a demo message and is not saved to the database.",
        });
      } else {
        // Create the new message in the database
        const messageData = {
          booking_id: bookingId,
          sender_id: user.id,
          content: newMessage.trim(),
          is_read: false
        };
        
        // Save to database
        const savedMessage = await MessageService.create(messageData);
        
        // Update local state
        setMessages(prev => [...prev, savedMessage]);
        
        // Show success toast
        toast({
          title: "Message Sent",
          description: "Your message has been sent to the client.",
        });
      }
      
      // Clear input
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle booking cancellation
  const handleCancelBooking = () => {
    toast({
      title: "Booking Cancelled",
      description: "The booking has been cancelled successfully.",
    });
    
    setCancelDialogOpen(false);
    router.push("/dashboard/bookings");
  };
  
  // Handle status change
  const handleStatusChange = (status: string) => {
    toast({
      title: "Status Updated",
      description: `Booking status has been updated to ${status}.`,
    });
  };
  
  // Handle payment status change
  const handlePaymentStatusChange = (status: string) => {
    toast({
      title: "Payment Status Updated",
      description: `Payment status has been updated to ${status}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/bookings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Booking Details</h2>
          <Badge 
            variant={
              booking.status === "confirmed" 
                ? "success" 
                : booking.status === "pending" 
                ? "warning" 
                : "destructive"
            }
            className="ml-2 capitalize"
          >
            {booking.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/bookings/${booking.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Booking
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Booking</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Cancellation Reason</p>
                  <Select value={cancelReason} onValueChange={setCancelReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client-request">Client Request</SelectItem>
                      <SelectItem value="scheduling-conflict">Scheduling Conflict</SelectItem>
                      <SelectItem value="payment-issue">Payment Issue</SelectItem>
                      <SelectItem value="maintenance">Studio Maintenance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Additional Notes</p>
                  <Textarea placeholder="Enter any additional notes about the cancellation" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleCancelBooking}>
                  Confirm Cancellation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Booking Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
            <CardDescription>
              ID: {booking.id} • Created: {formattedCreatedAt} • Last Updated: {formattedUpdatedAt}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-primary/10">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Service</h3>
                    <p>{booking.service.name}</p>
                    <p className="text-sm text-muted-foreground">{booking.service.description}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Date & Time</h3>
                    <p>{formattedDate}</p>
                    <p className="text-sm text-muted-foreground">{booking.startTime} - {booking.endTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Duration</h3>
                    <p>{booking.service.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p>{booking.location}</p>
                  </div>
                </div>
              </div>
              
              {/* Payment Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Payment Status</h3>
                      <Badge 
                        variant={
                          booking.paymentStatus === "paid" 
                            ? "success" 
                            : booking.paymentStatus === "partial" 
                            ? "warning" 
                            : "destructive"
                        }
                        className="capitalize"
                      >
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {booking.paymentStatus === "paid" 
                        ? "Full payment received" 
                        : booking.paymentStatus === "partial" 
                        ? "Deposit received" 
                        : "No payment received"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">{booking.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit (50%):</span>
                    <span>{booking.depositAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit Status:</span>
                    <span className={booking.depositPaid ? "text-green-600" : "text-red-600"}>
                      {booking.depositPaid ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance Due:</span>
                    <span className={booking.paymentStatus === "paid" ? "text-green-600" : "font-semibold"}>
                      {booking.paymentStatus === "paid" 
                        ? "R0.00" 
                        : booking.paymentStatus === "partial" 
                        ? booking.depositAmount 
                        : booking.amount}
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <Select 
                    defaultValue={booking.paymentStatus} 
                    onValueChange={handlePaymentStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Update payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="partial">Partially Paid</SelectItem>
                      <SelectItem value="paid">Fully Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Notes and Equipment */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm">{booking.notes}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Equipment</h3>
                <p className="text-sm">{booking.equipment}</p>
              </div>
            </div>
            
            <Separator />
            
            {/* Booking Status */}
            <div className="space-y-2">
              <h3 className="font-semibold">Booking Status</h3>
              <div className="flex items-center gap-4">
                <Select 
                  defaultValue={booking.status} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  Send Confirmation
                </Button>
                <Button variant="outline" size="sm">
                  Send Reminder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={booking.client.avatar} alt={booking.client.name} />
                <AvatarFallback>{booking.client.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{booking.client.name}</h3>
                <p className="text-sm text-muted-foreground">Client ID: {booking.client.id}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant={booking.client.type === "premium" ? "default" : "outline"} className="capitalize">
                    {booking.client.type}
                  </Badge>
                  <Badge variant="outline">
                    {booking.client.totalBookings} bookings
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{booking.client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{booking.client.phone}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/clients/${booking.client.id}`}>
                  <User className="mr-2 h-4 w-4" />
                  View Client Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/bookings/new?client=${booking.client.id}`}>
                  <Calendar className="mr-2 h-4 w-4" />
                  New Booking for Client
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for History and Messages */}
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="history">Booking History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Communication history with the client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="text-xs text-muted-foreground">
                      Start the conversation with the client
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isAdmin = message.sender_id === user?.id;
                    const senderName = isAdmin ? "You" : booking.client?.name || "Client";
                    
                    // Fix the type error by using explicit type annotation
                    const clientName = booking.client?.name || "C";
                    const senderInitials = isAdmin 
                      ? "AU" 
                      : clientName.split(' ')
                          .map((n: string) => n[0])
                          .join('');
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex gap-3 ${isAdmin ? "justify-end" : "justify-start"}`}
                      >
                        {!isAdmin && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{senderInitials}</AvatarFallback>
                          </Avatar>
                        )}
                        <div 
                          className={`rounded-lg p-3 max-w-[80%] ${
                            isAdmin 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm">{senderName}</span>
                            <span className="text-xs opacity-70">
                              {format(new Date(message.created_at), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        {isAdmin && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>AU</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full gap-2">
                <Textarea 
                  placeholder="Type your message..." 
                  className="flex-1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
              <CardDescription>
                Timeline of actions and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(booking.history || []).map((event: { action: string; timestamp: string; user: string }, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-primary/10 p-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      {index < (booking.history || []).length - 1 && (
                        <div className="w-px h-full bg-border flex-1 my-1"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{event.action}</p>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>{format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}</span>
                        <span>•</span>
                        <span>{event.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 