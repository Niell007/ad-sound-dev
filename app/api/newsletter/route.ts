import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { z } from "zod"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    // Validate email
    const result = subscribeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    const { email } = result.data

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, is_active")
      .eq("email", email)
      .single()

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          { error: "Email already subscribed" },
          { status: 409 }
        )
      } else {
        // Reactivate subscription
        const { error } = await supabase
          .from("newsletter_subscribers")
          .update({ is_active: true })
          .eq("id", existing.id)

        if (error) {
          throw error
        }

        return NextResponse.json({
          message: "Subscription reactivated successfully",
        })
      }
    }

    // Create new subscription
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email })

    if (error) {
      throw error
    }

    // Send welcome email
    await resend.emails.send({
      from: "Soundmaster <newsletter@soundmaster.com>",
      to: email,
      subject: "Welcome to Soundmaster Newsletter",
      html: `
        <h1>Welcome to Soundmaster Newsletter!</h1>
        <p>Thank you for subscribing to our newsletter. You'll now receive updates about:</p>
        <ul>
          <li>Latest audio equipment and services</li>
          <li>Special offers and promotions</li>
          <li>Event planning tips and tricks</li>
          <li>Industry news and updates</li>
        </ul>
        <p>Stay tuned for our next update!</p>
        <p>Best regards,<br>The Soundmaster Team</p>
      `,
    })

    return NextResponse.json({
      message: "Subscribed successfully",
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "Failed to subscribe to newsletter" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ is_active: false })
      .eq("email", email)

    if (error) {
      throw error
    }

    return NextResponse.json({
      message: "Unsubscribed successfully",
    })
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error)
    return NextResponse.json(
      { error: "Failed to unsubscribe from newsletter" },
      { status: 500 }
    )
  }
}

