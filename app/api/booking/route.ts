import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { z } from "zod"

// Validation schema for booking request
const bookingSchema = z.object({
  eventType: z.enum(["party", "wedding", "karaoke", "corporate"]),
  eventDate: z.string().datetime(),
  location: z.string().min(1),
  attendees: z.number().min(1),
  specialRequests: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const result = bookingSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      )
    }

    const { eventType, eventDate, location, attendees, specialRequests } = result.data

    // Check for date availability
    const { data: existingBookings } = await supabase
      .from("bookings")
      .select("id")
      .eq("event_date", eventDate)
      .eq("status", "confirmed")

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json(
        { error: "Selected date is not available" },
        { status: 409 }
      )
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        user_id: session.user.id,
        event_type: eventType,
        event_date: eventDate,
        location,
        attendees,
        special_requests: specialRequests,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Booking error:", error)
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      )
    }

    // Send confirmation email
    await fetch("/api/email/booking-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        booking: booking,
      }),
    })

    return NextResponse.json({
      message: "Booking created successfully",
      booking,
    })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Get user's bookings
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        *,
        reviews (
          rating,
          comment
        )
      `)
      .eq("user_id", session.user.id)
      .order("event_date", { ascending: true })

    if (error) {
      console.error("Error fetching bookings:", error)
      return NextResponse.json(
        { error: "Failed to fetch bookings" },
        { status: 500 }
      )
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

