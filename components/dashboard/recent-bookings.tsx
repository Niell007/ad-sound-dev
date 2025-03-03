"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentBookings = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    eventType: "Wedding",
    date: "2024-03-15",
    amount: "R4,500",
    status: "Confirmed",
  },
  {
    id: "2",
    name: "Michael Brown",
    email: "m.brown@example.com",
    eventType: "Corporate Event",
    date: "2024-03-20",
    amount: "R3,200",
    status: "Pending",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.d@example.com",
    eventType: "Birthday Party",
    date: "2024-03-25",
    amount: "R2,800",
    status: "Confirmed",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "j.wilson@example.com",
    eventType: "Karaoke Night",
    date: "2024-03-28",
    amount: "R1,500",
    status: "Pending",
  },
]

export function RecentBookings() {
  return (
    <div className="space-y-8">
      {recentBookings.map((booking) => (
        <div key={booking.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/placeholder.svg?text=${booking.name[0]}`} alt={booking.name} />
            <AvatarFallback>{booking.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{booking.name}</p>
            <p className="text-sm text-muted-foreground">
              {booking.eventType} - {booking.date}
            </p>
          </div>
          <div className="ml-auto font-medium">{booking.amount}</div>
        </div>
      ))}
    </div>
  )
}

