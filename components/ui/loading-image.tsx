"use client"

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface LoadingImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
  fallback?: React.ReactNode
}

export function LoadingImage({
  fallback,
  className,
  ...props
}: LoadingImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return fallback || (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted animate-pulse rounded-md",
          className
        )}
        style={{
          width: typeof props.width === 'number' ? props.width : '100%',
          height: typeof props.height === 'number' ? props.height : '100%',
        }}
      />
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className={cn(
            "absolute inset-0 bg-muted animate-pulse rounded-md",
            className
          )}
        />
      )}
      <Image
        {...props}
        className={cn(
          isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-200',
          className
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
    </div>
  )
} 