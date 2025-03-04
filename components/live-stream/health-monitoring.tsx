"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Wifi, Gauge, Clock, AlertTriangle } from "lucide-react"

interface HealthMonitoringProps {
  bitrate: number
  fps: number
  latency: number
  droppedFrames: number
  isBuffering: boolean
}

export function HealthMonitoring({
  bitrate,
  fps,
  latency,
  droppedFrames,
  isBuffering
}: HealthMonitoringProps) {
  // Calculate health scores (0-100)
  const bitrateScore = Math.min(100, (bitrate / 8000) * 100) // Assuming 8Mbps is optimal
  const fpsScore = Math.min(100, (fps / 60) * 100) // Assuming 60fps is optimal
  const latencyScore = Math.max(0, 100 - (latency / 1000) * 100) // Lower is better
  const frameScore = Math.max(0, 100 - (droppedFrames / 100) * 100) // Lower is better

  // Overall health score
  const overallHealth = Math.round((bitrateScore + fpsScore + latencyScore + frameScore) / 4)

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Stream Health</h2>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${getHealthColor(overallHealth)}`}>
            {overallHealth}%
          </span>
          {isBuffering && (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Bitrate</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {(bitrate / 1000).toFixed(1)} Mbps
            </span>
          </div>
          <Progress
            value={bitrateScore}
            className="h-2"
            indicatorClassName={getProgressColor(bitrateScore)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Frame Rate</span>
            </div>
            <span className="text-sm text-muted-foreground">{fps} FPS</span>
          </div>
          <Progress
            value={fpsScore}
            className="h-2"
            indicatorClassName={getProgressColor(fpsScore)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Latency</span>
            </div>
            <span className="text-sm text-muted-foreground">{latency}ms</span>
          </div>
          <Progress
            value={latencyScore}
            className="h-2"
            indicatorClassName={getProgressColor(latencyScore)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Dropped Frames</span>
            </div>
            <span className="text-sm text-muted-foreground">{droppedFrames}</span>
          </div>
          <Progress
            value={frameScore}
            className="h-2"
            indicatorClassName={getProgressColor(frameScore)}
          />
        </div>
      </div>
    </Card>
  )
} 