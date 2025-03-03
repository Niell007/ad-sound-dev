"use client"

import { motion } from "framer-motion"

export default function TermsPage() {
  return (
    <div className="container py-12">
      <motion.div
        className="max-w-3xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Agreement to Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using our services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Service Description</h2>
          <p className="text-muted-foreground">
            Soundmaster provides professional audio equipment rental and services for events, including but not limited to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>Party sound systems</li>
            <li>Wedding ceremony and reception audio</li>
            <li>Karaoke equipment and services</li>
            <li>Corporate event sound solutions</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Booking and Payment</h2>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">3.1 Reservations</h3>
            <p className="text-muted-foreground">
              All bookings are subject to availability. A booking is only confirmed upon receipt of a deposit and written confirmation from us.
            </p>

            <h3 className="text-lg font-medium">3.2 Deposits</h3>
            <p className="text-muted-foreground">
              A 50% deposit is required to secure your booking. The remaining balance must be paid no later than 7 days before the event.
            </p>

            <h3 className="text-lg font-medium">3.3 Cancellations</h3>
            <p className="text-muted-foreground">
              Cancellations made more than 30 days before the event will receive a full refund of the deposit. Cancellations made within 30 days of the event will forfeit the deposit.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Equipment and Services</h2>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">4.1 Equipment Care</h3>
            <p className="text-muted-foreground">
              The client is responsible for ensuring the safety and security of our equipment during the event. Any damage caused by negligence will be charged to the client.
            </p>

            <h3 className="text-lg font-medium">4.2 Setup and Teardown</h3>
            <p className="text-muted-foreground">
              We require adequate time for setup and teardown of equipment. The venue must be accessible at least 2 hours before and 1 hour after the event.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Client Responsibilities</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>Provide accurate event details and requirements</li>
            <li>Ensure venue accessibility and adequate power supply</li>
            <li>Obtain necessary permits and venue approvals</li>
            <li>Adhere to agreed-upon event schedule</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            Soundmaster shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Force Majeure</h2>
          <p className="text-muted-foreground">
            We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to natural disasters, power outages, or government restrictions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Contact Information</h2>
          <p className="text-muted-foreground">
            For questions about these Terms of Service, please contact us at:
          </p>
          <div className="text-muted-foreground">
            <p>Email: soundmaster@gmail.com</p>
            <p>Phone: 081 543 6748</p>
            <p>Address: Tzaneen, Limpopo, South Africa</p>
          </div>
        </section>
      </motion.div>
    </div>
  )
} 