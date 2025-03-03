import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { z } from "zod"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  phone: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    // Validate request body
    const result = contactSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.format() },
        { status: 400 }
      )
    }

    const { name, email, message, phone } = result.data

    // Store contact message
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert({ name, email, message, phone })

    if (dbError) {
      throw dbError
    }

    // Send notification email to admin
    await resend.emails.send({
      from: "Soundmaster <contact@soundmaster.com>",
      to: "admin@soundmaster.com",
      subject: "New Contact Form Submission",
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: "Soundmaster <contact@soundmaster.com>",
      to: email,
      subject: "Thank you for contacting Soundmaster",
      html: `
        <h1>Thank You for Contacting Soundmaster</h1>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
        <p>For your reference, here's a copy of your message:</p>
        <blockquote style="margin: 20px 0; padding: 10px 20px; border-left: 4px solid #ccc;">
          ${message}
        </blockquote>
        <p>If you need immediate assistance, please don't hesitate to call us at 081 543 6748.</p>
        <p>Best regards,<br>The Soundmaster Team</p>
      `,
    })

    return NextResponse.json({
      message: "Message sent successfully",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}

