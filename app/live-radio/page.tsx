"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Settings,
  BarChart,
  MessageCircle,
  Activity,
  AlertCircle
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/custom-toast-provider"
import { CustomStreamPlayer } from "@/components/custom-stream-player"
import { CustomChat } from "@/components/custom-chat"

export default function LiveRadioPage() {
  const { toast } = useToast()
  const [quality, setQuality] = useState("auto")
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [isStreamLive, setIsStreamLive] = useState(false)
  const [streamStats, setStreamStats] = useState({
    bitrate: 0,
    fps: 0,
    buffering: false,
    viewers: 0
  })

  // Simulate stream health monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamStats(prev => ({
        bitrate: Math.floor(Math.random() * 5000) + 2000, // 2000-7000 kbps
        fps: Math.floor(Math.random() * 10) + 50, // 50-60 fps
        buffering: Math.random() > 0.95, // 5% chance of buffering
        viewers: Math.floor(Math.random() * 100) + 100 // 100-200 viewers
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Check stream status every minute
  useEffect(() => {
    const checkStreamStatus = async () => {
      try {
        // Simulate API call to check if stream is live
        const response = await fetch("/api/stream/status")
        const data = await response.json()
        setIsStreamLive(data.isLive)
      } catch (error) {
        console.error("Failed to check stream status:", error)
      }
    }

    checkStreamStatus()
    const interval = setInterval(checkStreamStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleStreamError = (error: Error) => {
    toast({
      title: "Stream Error",
      description: error.message,
      variant: "destructive"
    })
  }

  const handleStreamStart = () => {
    setIsStreamLive(true)
    toast({
      title: "Stream Started",
      description: "The live stream has started successfully."
    })
  }

  const handleStreamEnd = () => {
    setIsStreamLive(false)
    toast({
      title: "Stream Ended",
      description: "The live stream has ended."
    })
  }

  const handleQualityChange = (value: string) => {
    setQuality(value)
    toast({
      title: "Quality Changed",
      description: `Stream quality set to ${value}`
    })
  }

  const handleChatError = (error: Error) => {
    toast({
      title: "Chat Error",
      description: error.message,
      variant: "destructive"
    })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CustomStreamPlayer
            streamUrl="https://stream.adsound.co.za/live/radio"
            onError={handleStreamError}
            onStreamStart={handleStreamStart}
            onStreamEnd={handleStreamEnd}
            onQualityChange={handleQualityChange}
          />
          
          <Card className="mt-4 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Stream Settings</h2>
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
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                <BarChart className="h-5 w-5 mb-2" />
                <span className="text-sm font-medium">{streamStats.bitrate} kbps</span>
                <span className="text-xs text-muted-foreground">Bitrate</span>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                <Activity className="h-5 w-5 mb-2" />
                <span className="text-sm font-medium">{streamStats.fps} FPS</span>
                <span className="text-xs text-muted-foreground">Frame Rate</span>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                <AlertCircle className="h-5 w-5 mb-2" />
                <span className="text-sm font-medium">
                  {streamStats.buffering ? "Yes" : "No"}
                </span>
                <span className="text-xs text-muted-foreground">Buffering</span>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                <MessageCircle className="h-5 w-5 mb-2" />
                <span className="text-sm font-medium">{streamStats.viewers}</span>
                <span className="text-xs text-muted-foreground">Viewers</span>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Live Chat</h2>
            </div>
            <div className="p-4">
              <CustomChat 
                channelId="live-radio"
                onError={handleChatError}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 