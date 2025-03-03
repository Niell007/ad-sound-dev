"use client"

import { User } from "lucide-react"

interface AvatarFallbackProps {
  className?: string
  size?: number
}

export function AvatarFallback({ className, size = 32 }: AvatarFallbackProps) {
  return (
    <div 
      className={`flex items-center justify-center bg-muted rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <User className="w-1/2 h-1/2 text-muted-foreground" />
    </div>
  )
} 