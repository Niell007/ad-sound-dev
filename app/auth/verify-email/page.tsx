"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/custom-toast-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { verifyOtp } = useAuth()
  const { toast } = useToast()
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationSuccess, setVerificationSuccess] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token")
        if (!token) {
          throw new Error("No verification token found")
        }

        await verifyOtp(token, "email")
        setVerificationSuccess(true)
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified. You can now log in.",
        })
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } catch (error) {
        console.error("Email verification failed:", error)
        toast({
          title: "Verification Failed",
          description: "Could not verify your email. Please try again or contact support.",
          variant: "destructive",
        })
        setVerificationSuccess(false)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyEmail()
  }, [searchParams, router, verifyOtp, toast])

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md p-6 space-y-6 text-center">
        <h1 className="text-2xl font-bold">Email Verification</h1>
        
        {isVerifying ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p>Verifying your email...</p>
          </div>
        ) : verificationSuccess ? (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <p>Your email has been verified successfully!</p>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="w-12 h-12 text-destructive" />
            <p>Email verification failed</p>
            <Button
              onClick={() => router.push("/auth/login")}
              variant="outline"
            >
              Return to Login
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
} 