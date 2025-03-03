"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function BookingConfirmationPage() {
  return (
    <div className="container mx-auto py-16 px-4 md:px-6">
      <div className="max-w-md mx-auto text-center">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Booking Confirmed!</CardTitle>
            <CardDescription>
              Thank you for booking with AD Sound Studio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We've received your booking request and will send a confirmation email shortly.
            </p>
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium">What's Next?</p>
              <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                <li>Check your email for booking details</li>
                <li>Prepare for your session</li>
                <li>Arrive 15 minutes before your scheduled time</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button asChild className="w-full">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 