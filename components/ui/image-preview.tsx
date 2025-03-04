"use client"

import { useState } from 'react'
import { ProgressiveImage } from './progressive-image'
import { Button } from './button'
import { ImagePreset, imagePresets } from '@/lib/config/image-config'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import { Badge } from './badge'
import { Loader2 } from 'lucide-react'

interface ImagePreviewProps {
  src: string
  alt?: string
  className?: string
}

export function ImagePreview({ src, alt, className }: ImagePreviewProps) {
  const [selectedPreset, setSelectedPreset] = useState<ImagePreset>('preview')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [imageStats, setImageStats] = useState<{
    originalSize?: number
    optimizedSize?: number
    dimensions?: { width: number; height: number }
  }>({})

  // Function to analyze image
  const analyzeImage = async () => {
    setIsAnalyzing(true)
    try {
      // In a real implementation, you would call your backend API
      // to get the actual image statistics
      const response = await fetch(src)
      const blob = await response.blob()
      
      setImageStats({
        originalSize: blob.size,
        optimizedSize: Math.round(blob.size * 0.7), // Simulated optimization
        dimensions: {
          width: imagePresets[selectedPreset].width,
          height: imagePresets[selectedPreset].height
        }
      })
    } catch (error) {
      console.error('Error analyzing image:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Image Preview</CardTitle>
        <CardDescription>
          Preview how your image will look with different optimization presets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg border">
          <ProgressiveImage
            src={src}
            alt={alt || 'Preview image'}
            preset={selectedPreset}
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Select
            value={selectedPreset}
            onValueChange={(value) => setSelectedPreset(value as ImagePreset)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(imagePresets).map(([key, preset]) => (
                <SelectItem key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} ({preset.width}x{preset.height})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={analyzeImage}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Image'
            )}
          </Button>
        </div>

        {imageStats.originalSize && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              Original: {(imageStats.originalSize / 1024).toFixed(1)}KB
            </Badge>
            <Badge variant="outline">
              Optimized: {(imageStats.optimizedSize! / 1024).toFixed(1)}KB
            </Badge>
            {imageStats.dimensions && (
              <Badge variant="outline">
                {imageStats.dimensions.width}x{imageStats.dimensions.height}
              </Badge>
            )}
            <Badge variant="outline">
              Format: {imagePresets[selectedPreset].format}
            </Badge>
            <Badge variant="outline">
              Quality: {imagePresets[selectedPreset].quality}%
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Images are automatically optimized and converted to WebP format
      </CardFooter>
    </Card>
  )
} 