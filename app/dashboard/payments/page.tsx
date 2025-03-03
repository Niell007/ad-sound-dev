import type { Metadata } from "next"
import { PaymentHistory } from "@/components/dashboard/payment-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"

export const metadata: Metadata = {
  title: "Payments",
  description: "View your payment history and manage billing information.",
}

export default function PaymentsPage() {
  return (
    <div className="space-y-6 p-4 pt-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
        <p className="text-muted-foreground">View your payment history and manage billing information.</p>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Overview</CardTitle>
            <CardDescription>Your payment activity over time.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <PaymentHistory />
      </div>
    </div>
  )
}

