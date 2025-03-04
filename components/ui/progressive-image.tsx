"use client"

import { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { ImagePreset, imagePresets } from '@/lib/config/image-config'
import { AvatarFallback } from './avatar-fallback'

interface ProgressiveImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null
  fallbackName?: string
  preset?: ImagePreset
  showLoadingIndicator?: boolean
  className?: string
}

export function ProgressiveImage({
  src,
  alt,
  fallbackName,
  preset = 'preview',
  showLoadingIndicator = true,
  className,
  ...props
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [blur, setBlur] = useState(true)

  // Get preset configuration
  const presetConfig = imagePresets[preset]

  // Reset states when src changes
  useEffect(() => {
    setIsLoading(true)
    setError(false)
    setBlur(true)
  }, [src])

  if (error || !src) {
    return (
      <AvatarFallback
        name={fallbackName}
        className={className}
        size={preset === 'avatar' ? 'sm' : preset === 'hero' ? 'lg' : 'md'}
      />
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <AnimatePresence>
        {isLoading && showLoadingIndicator && (
          <motion.div
            className="absolute inset-0 bg-muted/20 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <Image
        {...props}
        {...presetConfig}
        src={src}
        alt={alt}
        className={cn(
          'transition-all duration-300',
          blur ? 'scale-105 blur-lg' : 'scale-100 blur-0',
          className
        )}
        onLoadingComplete={() => {
          setIsLoading(false)
          // Small delay before removing blur for smoother transition
          setTimeout(() => setBlur(false), 50)
        }}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
        priority={preset === 'hero'}
      />
    </div>
  )
} 