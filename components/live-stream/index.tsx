"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/custom-toast-provider"
import { StreamStats } from "./stream-stats"
import { StreamControls } from "./stream-controls"
import { HealthMonitoring } from "./health-monitoring"
import {
  Settings,
  BarChart,
  MessageCircle,
  Activity,
  AlertCircle,
  Loader2,
  RefreshCw
} from "lucide-react"

interface StreamHealth {
  bitrate: number
  fps: number
  buffering: boolean
  latency: number
  dropped_frames: number
}

interface StreamAnalytics {
  viewCount: number
  startTime: Date
  bufferingEvents: number
  qualityChanges: number
  peakViewers: number
  avgBitrate: number
  retryCount: number
}

interface LiveStreamProps {
  channelName: string
  enableAnalytics?: boolean
  enableModeration?: boolean
  enableChat?: boolean
  onError?: (error: Error) => void
  onStreamStart?: () => void
  onStreamEnd?: () => void
}

export function LiveStream({
  channelName,
  enableAnalytics = true,
  enableModeration = false,
  enableChat = true,
  onError,
  onStreamStart,
  onStreamEnd
}: LiveStreamProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [quality, setQuality] = useState("auto")
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [healthStatus, setHealthStatus] = useState<StreamHealth>({
    bitrate: 0,
    fps: 0,
    buffering: false,
    latency: 0,
    dropped_frames: 0
  })
  const [streamStats, setStreamStats] = useState<StreamAnalytics>({
    viewCount: 0,
    startTime: new Date(),
    bufferingEvents: 0,
    qualityChanges: 0,
    peakViewers: 0,
    avgBitrate: 0,
    retryCount: 0
  })

  const baseStreamUrl = `https://player.kick.com/${channelName}`
  const streamUrl = `${baseStreamUrl}${quality !== "auto" ? `?quality=${quality}` : ""}`
  const chatUrl = `https://kick.com/${channelName}/chatroom`

  // Stream Health Monitoring
  const monitorStreamHealth = useCallback(() => {
    const interval = setInterval(() => {
      // Simulate stream health metrics (replace with actual metrics)
      const newHealth = {
        bitrate: Math.floor(Math.random() * 5000) + 3000,
        fps: Math.floor(Math.random() * 10) + 50,
        buffering: Math.random() > 0.95,
        latency: Math.floor(Math.random() * 1000),
        dropped_frames: Math.floor(Math.random() * 10)
      }

      setHealthStatus(newHealth)
      
      // Update analytics
      setStreamStats(prev => ({
        ...prev,
        bufferingEvents: prev.bufferingEvents + (newHealth.buffering ? 1 : 0),
        avgBitrate: (prev.avgBitrate + newHealth.bitrate) / 2,
        viewCount: Math.floor(Math.random() * 1000), // Replace with actual viewer count
        peakViewers: Math.max(prev.peakViewers, prev.viewCount)
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const cleanup = monitorStreamHealth()
    return () => cleanup()
  }, [monitorStreamHealth])

  // Analytics tracking
  useEffect(() => {
    if (!enableAnalytics) return

    const trackEvent = (eventName: string, data: any) => {
      console.log("Analytics Event:", eventName, {
        ...data,
        streamHealth: healthStatus,
        currentStats: streamStats
      })
    }

    trackEvent("stream_started", {
      quality,
      timestamp: new Date().toISOString()
    })

    return () => {
      trackEvent("stream_ended", {
        duration: (new Date().getTime() - streamStats.startTime.getTime()) / 1000,
        quality,
        finalStats: streamStats
      })
    }
  }, [quality, healthStatus, streamStats, enableAnalytics])

  const handleQualityChange = (newQuality: string) => {
    setIsLoading(true)
    setQuality(newQuality)
    setStreamStats(prev => ({
      ...prev,
      qualityChanges: prev.qualityChanges + 1
    }))
    
    toast({
      title: "Quality Changed",
      description: `Stream quality set to ${newQuality}`
    })
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setError(null)
    onStreamStart?.()
  }

  const handleIframeError = (e: any) => {
    const error = new Error("Failed to load the live stream")
    setIsLoading(false)
    setError(error)
    onError?.(error)
    
    toast({
      title: "Stream Error",
      description: "Failed to load the live stream. Please try refreshing.",
      variant: "destructive"
    })
  }

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    setStreamStats(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      startTime: new Date()
    }))
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Stream Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <Select value={quality} onValueChange={handleQualityChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="1080p">1080p</SelectItem>
                  <SelectItem value="720p">720p</SelectItem>
                  <SelectItem value="480p">480p</SelectItem>
                  <SelectItem value="360p">360p</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {enableChat && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                {isChatOpen ? "Hide Chat" : "Show Chat"}
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className={`h-5 w-5 ${healthStatus.buffering ? "text-red-500" : "text-green-500"}`} />
              <span className="text-sm">{healthStatus.buffering ? "Buffering..." : "Stable"}</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              <span className="text-sm text-muted-foreground">
                {streamStats.viewCount} viewers
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Stream Container */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center h-96 bg-muted">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-muted-foreground">Loading live stream...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center h-96 bg-muted">
                <div className="flex flex-col items-center gap-4 text-center p-4">
                  <AlertCircle className="h-12 w-12 text-destructive" />
                  <h3 className="text-lg font-semibold">Stream Error</h3>
                  <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
                  <Button onClick={handleRetry} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Retry Stream
                  </Button>
                </div>
              </div>
            )}

            {/* Stream Player */}
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={streamUrl}
                className={`absolute inset-0 w-full h-full ${isLoading ? "hidden" : "block"}`}
                frameBorder="0"
                scrolling="no"
                allowFullScreen={true}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </div>
          </Card>

          {/* Stream Health Stats */}
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Bitrate</h3>
                <p className="text-2xl font-semibold">
                  {(healthStatus.bitrate / 1000).toFixed(1)} Mbps
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">FPS</h3>
                <p className="text-2xl font-semibold">{healthStatus.fps}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Latency</h3>
                <p className="text-2xl font-semibold">{healthStatus.latency}ms</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chat Container */}
        {enableChat && isChatOpen && (
          <Card className="lg:col-span-1 overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Live Chat</h2>
            </div>
            <div className="relative w-full" style={{ height: "600px" }}>
              <iframe
                src={chatUrl}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
              />
            </div>
          </Card>
        )}
      </div>

      {/* Stream Analytics */}
      {enableAnalytics && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Stream Analytics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Duration</h3>
              <p className="text-2xl font-semibold">
                {Math.floor((new Date().getTime() - streamStats.startTime.getTime()) / 1000)}s
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Peak Viewers</h3>
              <p className="text-2xl font-semibold">{streamStats.peakViewers}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Quality Changes</h3>
              <p className="text-2xl font-semibold">{streamStats.qualityChanges}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Buffering Events</h3>
              <p className="text-2xl font-semibold">{streamStats.bufferingEvents}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
} 