"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAudio } from "@/hooks/use-audio"

interface Track {
  id: number
  title: string
  artist: string
  duration: number
  url: string
}

const sampleTracks: Track[] = [
  {
    id: 1,
    title: "Summer Party Mix",
    artist: "DJ Soundmaster",
    duration: 225, // 3:45
    url: "/audio/summer-mix.mp3",
  },
  {
    id: 2,
    title: "Wedding Classics",
    artist: "DJ Soundmaster",
    duration: 180, // 3:00
    url: "/audio/wedding-mix.mp3",
  },
  {
    id: 3,
    title: "Karaoke Hits",
    artist: "DJ Soundmaster",
    duration: 195, // 3:15
    url: "/audio/karaoke-mix.mp3",
  },
]

export function MusicPlayer() {
  const {
    isPlaying,
    currentTime,
    volume,
    currentTrack,
    audioRef,
    togglePlay,
    handleTimeUpdate,
    handleTrackEnd,
    handleVolumeChange,
    handleTimeSeek,
    handlePrevTrack,
    handleNextTrack,
  } = useAudio({
    tracks: sampleTracks,
    onTrackChange: (track) => {
      console.log("Now playing:", track.title)
    },
    onPlaybackChange: (playing) => {
      console.log("Playback state:", playing ? "playing" : "paused")
    },
  })

  return (
    <Card className="w-full max-w-3xl">
      <CardContent className="p-6">
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleTrackEnd}
        />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{currentTrack.title}</h3>
                <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5" />
              <Slider
                defaultValue={[1]}
                max={1}
                step={0.1}
                value={[volume]}
                onValueChange={(value) => handleVolumeChange(value[0])}
                className="w-24"
              />
            </div>
          </div>
          <div>
            <Slider
              defaultValue={[0]}
              max={currentTrack.duration}
              step={1}
              value={[currentTime]}
              onValueChange={(value) => handleTimeSeek(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <Button variant="ghost" size="icon" onClick={handlePrevTrack}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNextTrack}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

