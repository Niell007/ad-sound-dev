"use client"

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { AvatarFallback } from './avatar-fallback'
import { cn } from '@/lib/utils'
import { Skeleton } from './skeleton'
import { Dialog, DialogContent } from './dialog'

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackName?: string;
  showLoadingState?: boolean;
  aspectRatio?: string;
  enableZoom?: boolean;
}

const getImageSizes = (fill?: boolean, customSizes?: string) => {
  if (customSizes) return customSizes
  if (fill) return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  return undefined
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  className,
  fallbackName,
  showLoadingState = true,
  aspectRatio,
  priority,
  enableZoom = false,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showZoom, setShowZoom] = useState(false)

  const containerClass = cn(
    'relative',
    aspectRatio && `aspect-${aspectRatio}`,
    fill && 'w-full h-full',
    className
  )

  if (error || !src) {
    return <AvatarFallback name={fallbackName} className={containerClass} />
  }

  const handleImageClick = () => {
    if (enableZoom) {
      setShowZoom(true)
    }
  }

  return (
    <>
      <div className={containerClass}>
        {showLoadingState && isLoading && (
          <Skeleton className="absolute inset-0 z-10" />
        )}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          sizes={getImageSizes(fill, sizes)}
          className={cn(
            'object-cover duration-700 ease-in-out',
            isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0',
            enableZoom && 'cursor-zoom-in',
            className
          )}
          priority={priority}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setError(true)}
          onClick={handleImageClick}
          {...props}
        />
      </div>

      {enableZoom && (
        <Dialog open={showZoom} onOpenChange={setShowZoom}>
          <DialogContent className="max-w-[90vw] max-h-[90vh]">
            <div className="relative w-full h-full min-h-[50vh]">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
