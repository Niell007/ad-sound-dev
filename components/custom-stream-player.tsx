"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/custom-toast-provider"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RefreshCw,
  AlertCircle
} from "lucide-react"

interface StreamStats {
  bitrate: number
  fps: number
  buffering: boolean
  viewers: number
}

interface CustomStreamPlayerProps {
  streamUrl: string
  onError?: (error: Error) => void
  onStreamStart?: () => void
  onStreamEnd?: () => void
  onQualityChange?: (quality: string) => void
}

export function CustomStreamPlayer({
  streamUrl,
  onError,
  onStreamStart,
  onStreamEnd,
  onQualityChange
}: CustomStreamPlayerProps) {
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [stats, setStats] = useState<StreamStats>({
    bitrate: 0,
    fps: 0,
    buffering: false,
    viewers: 0
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleError = (e: ErrorEvent) => {
      const error = new Error(`Stream error: ${e.message}`)
      setError(error)
      onError?.(error)
      toast({
        title: "Stream Error",
        description: "There was an error loading the stream. Please try again.",
        variant: "destructive"
      })
    }

    const handlePlay = () => {
      setIsPlaying(true)
      setIsLoading(false)
      onStreamStart?.()
    }

    const handlePause = () => {
      setIsPlaying(false)
      onStreamEnd?.()
    }

    const handleWaiting = () => {
      setStats(prev => ({ ...prev, buffering: true }))
    }

    const handlePlaying = () => {
      setStats(prev => ({ ...prev, buffering: false }))
    }

    video.addEventListener("error", handleError as EventListener)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)

    return () => {
      video.removeEventListener("error", handleError as EventListener)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
    }
  }, [onError, onStreamStart, onStreamEnd, toast])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    setIsMuted(!isMuted)
    videoRef.current.muted = !isMuted
  }

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return
    const newVolume = value[0]
    setVolume(newVolume)
    videoRef.current.volume = newVolume
  }

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    if (videoRef.current) {
      videoRef.current.load()
      videoRef.current.play()
    }
  }

  if (error) {
    return (
      <Card className="w-full h-[480px] flex items-center justify-center bg-black/5">
        <div className="text-center p-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Stream Error</h3>
          <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={handleRetry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry Stream
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full overflow-hidden">
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          src={streamUrl}
          className="w-full h-full object-contain"
          playsInline
          autoPlay
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="loading-spinner" />
          </div>
        )}
      </div>
      <div className="p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className="hover:bg-secondary"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="hover:bg-secondary"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </Button>
        <div className="w-32">
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
          />
        </div>
        {stats.buffering && (
          <span className="text-sm text-muted-foreground ml-auto">
            Buffering...
          </span>
        )}
      </div>
    </Card>
  )
} 