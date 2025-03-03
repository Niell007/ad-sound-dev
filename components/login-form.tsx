"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the signin page since we're consolidating authentication
    router.replace("/auth/signin")
  }, [router])
  
  return null
}
