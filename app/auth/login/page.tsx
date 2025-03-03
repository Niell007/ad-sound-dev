"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the signin page since we're consolidating authentication pages
    router.replace("/auth/signin")
  }, [router])
  
  // Return null while redirecting
  return null
}
