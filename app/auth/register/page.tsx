"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the signup page since we're consolidating authentication pages
    router.replace("/auth/signup")
  }, [router])
  
  // Return null while redirecting
  return null
}
