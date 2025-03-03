import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

interface BookingConfirmationEmailProps {
  booking: {
    id: string
    eventType: string
    eventDate: string
    location: string
    attendees: number
    specialRequests?: string
  }
}

export const BookingConfirmationEmail = ({
  booking,
}: BookingConfirmationEmailProps) => {
  const previewText = `Your booking for ${booking.eventType} has been confirmed`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Confirmation</Heading>
          <Text style={text}>
            Thank you for choosing Soundmaster for your upcoming event. Your booking has been received and is currently being processed.
          </Text>
          
          <Section style={section}>
            <Heading as="h2" style={h2}>Booking Details</Heading>
            <Text style={detailText}>
              <strong>Event Type:</strong> {booking.eventType}
            </Text>
            <Text style={detailText}>
              <strong>Date:</strong> {booking.eventDate}
            </Text>
            <Text style={detailText}>
              <strong>Location:</strong> {booking.location}
            </Text>
            <Text style={detailText}>
              <strong>Number of Attendees:</strong> {booking.attendees}
            </Text>
            {booking.specialRequests && (
              <Text style={detailText}>
                <strong>Special Requests:</strong> {booking.specialRequests}
              </Text>
            )}
          </Section>

          <Text style={text}>
            Our team will review your booking and contact you shortly to confirm all details and discuss any specific requirements.
          </Text>

          <Text style={text}>
            If you have any questions or need to make changes to your booking, please don't hesitate to contact us:
          </Text>

          <Text style={contactText}>
            Email: bookings@adsound.com<br />
            Phone: 081 543 6748
          </Text>

          <Text style={footer}>
            Thank you for choosing Soundmaster for your event!
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
}

const h2 = {
  color: "#444",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "20px 0",
  padding: "0",
}

const section = {
  backgroundColor: "#f9f9f9",
  border: "1px solid #eee",
  borderRadius: "5px",
  margin: "20px 0",
  padding: "20px",
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
}

const detailText = {
  color: "#444",
  fontSize: "14px",
  lineHeight: "21px",
  margin: "8px 0",
}

const contactText = {
  ...text,
  color: "#666",
  textAlign: "center" as const,
}

const footer = {
  color: "#898989",
  fontSize: "14px",
  fontStyle: "italic",
  margin: "32px 0 0",
  textAlign: "center" as const,
} 