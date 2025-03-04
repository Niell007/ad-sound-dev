"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Activity, Clock, Users } from "lucide-react"

interface StreamStatsProps {
  duration: number
  viewCount: number
  peakViewers: number
  bufferingEvents: number
  qualityChanges: number
  avgBitrate: number
}

export function StreamStats({
  duration,
  viewCount,
  peakViewers,
  bufferingEvents,
  qualityChanges,
  avgBitrate
}: StreamStatsProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return [
      hours > 0 ? `${hours}h` : null,
      minutes > 0 ? `${minutes}m` : null,
      `${remainingSeconds}s`
    ]
      .filter(Boolean)
      .join(" ")
  }

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Stream Statistics</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
          <Clock className="h-5 w-5 mb-2 text-muted-foreground" />
          <span className="text-sm font-medium">{formatDuration(duration)}</span>
          <span className="text-xs text-muted-foreground">Duration</span>
        </div>

        <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
          <Users className="h-5 w-5 mb-2 text-muted-foreground" />
          <span className="text-sm font-medium">{viewCount}</span>
          <span className="text-xs text-muted-foreground">Current Viewers</span>
        </div>

        <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
          <Users className="h-5 w-5 mb-2 text-muted-foreground" />
          <span className="text-sm font-medium">{peakViewers}</span>
          <span className="text-xs text-muted-foreground">Peak Viewers</span>
        </div>

        <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
          <Activity className="h-5 w-5 mb-2 text-muted-foreground" />
          <span className="text-sm font-medium">{bufferingEvents}</span>
          <span className="text-xs text-muted-foreground">Buffering Events</span>
        </div>

        <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
          <BarChart className="h-5 w-5 mb-2 text-muted-foreground" />
          <span className="text-sm font-medium">{qualityChanges}</span>
          <span className="text-xs text-muted-foreground">Quality Changes</span>
        </div>

        <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
          <BarChart className="h-5 w-5 mb-2 text-muted-foreground" />
          <span className="text-sm font-medium">{(avgBitrate / 1000).toFixed(1)} Mbps</span>
          <span className="text-xs text-muted-foreground">Average Bitrate</span>
        </div>
      </div>
    </Card>
  )
} 