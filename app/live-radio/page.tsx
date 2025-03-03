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
  const [useFallbackChat, setUseFallbackChat] = useState(false)
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
    console.error("Stream error:", error)
    toast({
      title: "Stream Error",
      description: "There was an issue with the stream. Trying to reconnect...",
      variant: "destructive"
    })
  }

  const handleStreamStart = () => {
    console.log("Stream started")
    toast({
      title: "Stream Connected",
      description: "Successfully connected to the live stream",
      variant: "default"
    })
  }

  const handleStreamEnd = () => {
    console.log("Stream ended")
  }

  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality)
    toast({
      title: "Quality Changed",
      description: `Stream quality set to ${newQuality}`,
      variant: "default"
    })
  }

  const handleChatError = (error: Error) => {
    console.error("Chat error:", error)
    setUseFallbackChat(true)
    toast({
      title: "Chat Connection Error",
      description: "Switched to backup chat system",
      variant: "default"
    })
  }

  const handleRetryPrimaryChat = () => {
    setUseFallbackChat(false)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CustomStreamPlayer
            streamUrl="https://your-stream-url.com/stream"
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
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Activity className="w-4 h-4" />
                  Bitrate
                </div>
                <div className="text-lg font-semibold">
                  {streamStats.bitrate} kbps
                </div>
              </div>
              
              <div className="p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <BarChart className="w-4 h-4" />
                  FPS
                </div>
                <div className="text-lg font-semibold">
                  {streamStats.fps}
                </div>
              </div>
              
              <div className="p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MessageCircle className="w-4 h-4" />
                  Viewers
                </div>
                <div className="text-lg font-semibold">
                  {streamStats.viewers}
                </div>
              </div>
              
              <div className="p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Settings className="w-4 h-4" />
                  Status
                </div>
                <div className="text-lg font-semibold">
                  {streamStats.buffering ? "Buffering" : "Stable"}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Live Chat</h2>
              {useFallbackChat && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetryPrimaryChat}
                  className="gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Retry Primary Chat
                </Button>
              )}
            </div>
            
            {useFallbackChat ? (
              <CustomChat 
                channelId="soundmaster-live"
                onError={handleChatError} 
              />
            ) : (
              <iframe
                src="https://kick.com/your-channel/chat"
                className="flex-1 w-full"
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                allow="autoplay; encrypted-media"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
} 