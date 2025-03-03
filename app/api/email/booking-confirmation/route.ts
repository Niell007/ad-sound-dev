import { NextResponse } from "next/server"
import { Resend } from "resend"
import { BookingConfirmationEmail } from "@/components/emails/booking-confirmation"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, booking } = body

    if (!email || !booking) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: "Soundmaster <bookings@soundmaster.com>",
      to: email,
      subject: "Booking Confirmation - Soundmaster",
      react: BookingConfirmationEmail({
        booking: {
          id: booking.id,
          eventType: booking.event_type,
          eventDate: new Date(booking.event_date).toLocaleDateString(),
          location: booking.location,
          attendees: booking.attendees,
          specialRequests: booking.special_requests,
        },
      }),
    })

    if (error) {
      console.error("Failed to send email:", error)
      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Confirmation email sent successfully",
      data,
    })
  } catch (error) {
    console.error("Email error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 