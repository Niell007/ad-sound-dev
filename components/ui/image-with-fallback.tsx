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

  // Ensure sizes prop is present when fill is true
  const imageProps: any = {...props}
  if (imageProps.fill && !imageProps.sizes) {
    imageProps.sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  }

  // Ensure width and height are both present or both absent to maintain aspect ratio
  if ((imageProps.width && !imageProps.height) || (!imageProps.width && imageProps.height)) {
    if (!imageProps.style) imageProps.style = {}
    if (imageProps.width && !imageProps.height) {
      imageProps.style.height = "auto"
    } else if (!imageProps.width && imageProps.height) {
      imageProps.style.width = "auto"
    }
  }

  return (
    <Image
      alt={alt}
      src={src}
      {...imageProps}
      onError={() => setError(true)}
    />
  )
}
