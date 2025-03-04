"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, MessageCircle, Activity, BarChart } from "lucide-react"

interface StreamControlsProps {
  quality: string
  onQualityChange: (quality: string) => void
  isChatOpen: boolean
  onToggleChat: () => void
  isBuffering: boolean
  viewerCount: number
  enableChat?: boolean
}

export function StreamControls({
  quality,
  onQualityChange,
  isChatOpen,
  onToggleChat,
  isBuffering,
  viewerCount,
  enableChat = true
}: StreamControlsProps) {
  const qualityOptions = [
    { value: "auto", label: "Auto" },
    { value: "1080p", label: "1080p" },
    { value: "720p", label: "720p" },
    { value: "480p", label: "480p" },
    { value: "360p", label: "360p" }
  ]

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <Select value={quality} onValueChange={onQualityChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Quality" />
              </SelectTrigger>
              <SelectContent>
                {qualityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {enableChat && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleChat}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              {isChatOpen ? "Hide Chat" : "Show Chat"}
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className={`h-5 w-5 ${isBuffering ? "text-red-500" : "text-green-500"}`} />
            <span className="text-sm">{isBuffering ? "Buffering..." : "Stable"}</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {viewerCount} viewers
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
} 