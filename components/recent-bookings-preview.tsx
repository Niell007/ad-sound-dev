"use client"

import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Booking {
  id: string
  service: string
  date: string
  time: string
  location: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

export function RecentBookingsPreview() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchBookings = async () => {
      setLoading(true)
      try {
        // Simulated data - replace with actual API call
        const mockBookings: Booking[] = [
          {
            id: '1',
            service: 'Wedding Sound',
            date: '2024-03-15',
            time: '14:00',
            location: 'Grand Plaza Hotel',
            status: 'upcoming'
          },
          {
            id: '2',
            service: 'Karaoke Night',
            date: '2024-03-10',
            time: '20:00',
            location: 'The Music Bar',
            status: 'completed'
          }
        ]
        setBookings(mockBookings)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-12 bg-muted animate-pulse rounded-md" />
        <div className="h-12 bg-muted animate-pulse rounded-md" />
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No recent bookings found
      </div>
    )
  }

  return (
    <div className="p-2">
      {bookings.map((booking) => (
        <Link
          key={booking.id}
          href={`/bookings/${booking.id}`}
          className="block p-2 hover:bg-accent rounded-md transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">{booking.service}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {format(new Date(booking.date), 'MMM d, yyyy')}
                <Clock className="ml-2 mr-1 h-3 w-3" />
                {booking.time}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="mr-1 h-3 w-3" />
                {booking.location}
              </div>
            </div>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                booking.status === 'upcoming' && "bg-blue-100 text-blue-700",
                booking.status === 'completed' && "bg-green-100 text-green-700",
                booking.status === 'cancelled' && "bg-red-100 text-red-700"
              )}
            >
              {booking.status}
            </span>
          </div>
        </Link>
      ))}
      <div className="mt-2 pt-2 border-t">
        <Link
          href="/bookings"
          className="block text-xs text-center text-muted-foreground hover:text-primary"
        >
          View all bookings
        </Link>
      </div>
    </div>
  )
} 