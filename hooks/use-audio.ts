"use client"

import { useState, useRef, useEffect } from "react"

interface Track {
  id: number
  title: string
  artist: string
  duration: number
  url: string
}

interface UseAudioProps {
  tracks: Track[]
  initialTrackIndex?: number
  onTrackChange?: (track: Track) => void
  onPlaybackChange?: (isPlaying: boolean) => void
}

export function useAudio({
  tracks,
  initialTrackIndex = 0,
  onTrackChange,
  onPlaybackChange,
}: UseAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentTrack = tracks[currentTrackIndex]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
    onPlaybackChange?.(isPlaying)
  }, [isPlaying, currentTrackIndex, onPlaybackChange])

  useEffect(() => {
    onTrackChange?.(currentTrack)
  }, [currentTrack, onTrackChange])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleTrackEnd = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1)
    } else {
      setCurrentTrackIndex(0)
      setIsPlaying(false)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
  }

  const handleTimeSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handlePrevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1)
    } else {
      setCurrentTrackIndex(tracks.length - 1)
    }
  }

  const handleNextTrack = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1)
    } else {
      setCurrentTrackIndex(0)
    }
  }

  return {
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
  }
} 