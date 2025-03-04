"use client"

import Image from 'next/image'
import { useState } from 'react'
import { DefaultAvatar } from './default-avatar'

interface ImageWithFallbackProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  fallbackName?: string
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackName,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <DefaultAvatar
        name={fallbackName}
        width={width}
        height={height}
        className={className}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  )
}
