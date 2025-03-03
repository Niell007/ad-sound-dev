"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

const payments = [
  {
    id: "INV001",
    amount: 4500,
    status: "completed",
    email: "sarah.j@example.com",
    description: "Wedding Sound Package",
    date: "2024-02-15T10:00:00Z",
  },
  {
    id: "INV002",
    amount: 3200,
    status: "pending",
    email: "m.brown@example.com",
    description: "Corporate Event Package",
    date: "2024-02-10T15:30:00Z",
  },
  // Add more payment records
]

export function PaymentHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>View all your past transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.description}</TableCell>
                <TableCell>R {payment.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={payment.status === "completed" ? "default" : "secondary"}>{payment.status}</Badge>
                </TableCell>
                <TableCell>{format(new Date(payment.date), "MMM d, yyyy")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

