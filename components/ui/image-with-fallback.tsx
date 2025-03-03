"use client"

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { AvatarFallback } from './avatar-fallback'

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError' | 'alt'> {
  fallback?: React.ReactNode
  alt: string
}

export function ImageWithFallback({
  fallback,
  alt,
  src,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  if (error) {
    return fallback || <AvatarFallback size={props.width as number} />
  }

  return (
    <Image
      alt={alt}
      src={src}
      {...props}
      onError={() => setError(true)}
    />
  )
}
