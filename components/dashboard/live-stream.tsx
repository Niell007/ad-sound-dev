"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/custom-toast-provider"
import { 
  Mic, 
  MicOff, 
  Radio, 
  Play, 
  Pause, 
  Settings, 
  Volume2, 
  VolumeX,
  BarChart4,
  Users,
  Loader2,
  Share2,
  Copy,
  Music,
  Headphones
} from "lucide-react"
import { streamService } from "@/lib/services/stream-service"

interface LiveStreamProps {
  onClose?: () => void;
}

export function LiveStream({ onClose }: LiveStreamProps) {
  const { toast } = useToast()
  const [isLive, setIsLive] = useState(false)
  const [isMicActive, setIsMicActive] = useState(false)
  const [streamTitle, setStreamTitle] = useState("")
  const [streamDescription, setStreamDescription] = useState("")
  const [audioSource, setAudioSource] = useState("microphone")
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedAudioDevice, setSelectedAudioDevice] = useState("")
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [streamKey, setStreamKey] = useState("stream-key-xxxx-xxxx-xxxx")
  const [streamUrl, setStreamUrl] = useState("rtmp://stream.example.com/live")
  const [showStreamInfo, setShowStreamInfo] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const [playlist, setPlaylist] = useState<{id: string, name: string, duration: string}[]>([
    { id: "1", name: "Summer Mix 2024", duration: "1:20:00" },
    { id: "2", name: "House Party Essentials", duration: "45:30" },
    { id: "3", name: "Wedding Reception Classics", duration: "1:05:15" },
    { id: "4", name: "Corporate Event Background", duration: "2:00:00" },
  ])
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [streamDuration, setStreamDuration] = useState(0)
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null)
  
  // Get available audio devices
  useEffect(() => {
    async function getAudioDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const audioInputs = devices.filter(device => device.kind === 'audioinput')
        setAudioDevices(audioInputs)
        
        if (audioInputs.length > 0) {
          setSelectedAudioDevice(audioInputs[0].deviceId)
        }
      } catch (error) {
        console.error('Error getting audio devices:', error)
        toast({
          title: "Error",
          description: "Could not access audio devices. Please check permissions.",
          variant: "destructive",
        })
      }
    }
    
    getAudioDevices()
  }, [toast])
  
  // Handle stream start/stop
  const toggleStream = async () => {
    if (isLive) {
      // Stop streaming
      setIsLoading(true)
      
      try {
        if (currentStreamId) {
          // End the stream in the database
          await streamService.endStream(currentStreamId, viewerCount, streamDuration)
        }
        
        setIsLive(false)
        setIsMicActive(false)
        setCurrentStreamId(null)
        
        if (streamTimerRef.current) {
          clearInterval(streamTimerRef.current)
          streamTimerRef.current = null
        }
        
        toast({
          title: "Stream Ended",
          description: `Your stream ran for ${formatDuration(streamDuration)}`,
        })
      } catch (error) {
        console.error('Error stopping stream:', error)
        toast({
          title: "Error",
          description: "Failed to stop stream properly. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      // Start streaming
      if (!streamTitle) {
        toast({
          title: "Missing Information",
          description: "Please enter a stream title before going live.",
          variant: "destructive",
        })
        return
      }
      
      setIsLoading(true)
      
      try {
        // Create a new stream log in the database
        const streamLog = await streamService.createStreamLog({
          title: streamTitle,
          description: streamDescription,
          status: 'live',
          started_at: new Date().toISOString()
        })
        
        setCurrentStreamId(streamLog.id)
        setIsLive(true)
        setStreamDuration(0)
        
        // Start timer for stream duration
        streamTimerRef.current = setInterval(() => {
          setStreamDuration(prev => prev + 1)
          
          // Simulate viewer count changes
          if (Math.random() > 0.7) {
            setViewerCount(prev => {
              const change = Math.floor(Math.random() * 3) - 1
              return Math.max(0, prev + change)
            })
          }
        }, 1000)
        
        toast({
          title: "Stream Started",
          description: "You are now live! Your audience can tune in.",
        })
      } catch (error) {
        console.error('Error starting stream:', error)
        toast({
          title: "Error",
          description: "Failed to start stream. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }
  
  // Toggle microphone
  const toggleMicrophone = async () => {
    if (isMicActive) {
      setIsMicActive(false)
      toast({
        title: "Microphone Off",
        description: "Your microphone has been muted.",
      })
    } else {
      try {
        // Request microphone access
        await navigator.mediaDevices.getUserMedia({ 
          audio: { deviceId: selectedAudioDevice ? { exact: selectedAudioDevice } : undefined } 
        })
        
        setIsMicActive(true)
        toast({
          title: "Microphone On",
          description: "Your microphone is now active.",
        })
      } catch (error) {
        console.error('Error accessing microphone:', error)
        toast({
          title: "Microphone Error",
          description: "Could not access microphone. Please check permissions.",
          variant: "destructive",
        })
      }
    }
  }
  
  // Format duration as HH:MM:SS
  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':')
  }
  
  // Copy stream info to clipboard
  const copyStreamInfo = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Stream information copied to clipboard",
    })
  }
  
  // Play selected track
  const playTrack = (trackId: string) => {
    setSelectedTrack(trackId)
    // In a real implementation, this would play the actual audio file
    if (audioRef.current) {
      audioRef.current.play()
    }
    
    toast({
      title: "Now Playing",
      description: playlist.find(track => track.id === trackId)?.name || "",
    })
  }
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current)
      }
      
      // If component unmounts while streaming, end the stream
      if (isLive && currentStreamId) {
        streamService.endStream(currentStreamId, viewerCount, streamDuration)
          .catch(error => console.error('Error ending stream on unmount:', error))
      }
    }
  }, [isLive, currentStreamId, viewerCount, streamDuration])
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className={`h-5 w-5 ${isLive ? "text-red-500 animate-pulse" : ""}`} />
            Live Streaming
          </div>
          {isLive && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-normal bg-red-500/10 text-red-500 px-2 py-1 rounded-md flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
                LIVE
              </span>
              <span className="text-sm font-normal">{formatDuration(streamDuration)}</span>
              <span className="text-sm font-normal flex items-center gap-1">
                <Users className="h-4 w-4" />
                {viewerCount}
              </span>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Stream music and commentary to your audience in real-time
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="broadcast" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
            <TabsTrigger value="playlist">Playlist</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="broadcast" className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="stream-title">Stream Title</Label>
                <Input
                  id="stream-title"
                  placeholder="Enter a title for your stream"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  disabled={isLive}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="stream-description">Description (Optional)</Label>
                <Input
                  id="stream-description"
                  placeholder="Describe what you'll be streaming"
                  value={streamDescription}
                  onChange={(e) => setStreamDescription(e.target.value)}
                  disabled={isLive}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Audio Source</Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={audioSource === "microphone" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setAudioSource("microphone")}
                    disabled={isLive}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Microphone
                  </Button>
                  <Button 
                    variant={audioSource === "playlist" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setAudioSource("playlist")}
                    disabled={isLive}
                  >
                    <Music className="h-4 w-4 mr-2" />
                    Playlist
                  </Button>
                  <Button 
                    variant={audioSource === "both" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setAudioSource("both")}
                    disabled={isLive}
                  >
                    <Headphones className="h-4 w-4 mr-2" />
                    Both
                  </Button>
                </div>
              </div>
              
              {(audioSource === "microphone" || audioSource === "both") && (
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Microphone</Label>
                    <Button 
                      variant={isMicActive ? "destructive" : "outline"} 
                      size="sm"
                      onClick={toggleMicrophone}
                      disabled={!isLive}
                    >
                      {isMicActive ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                      {isMicActive ? "Mute" : "Unmute"}
                    </Button>
                  </div>
                  
                  {audioDevices.length > 0 && (
                    <Select 
                      value={selectedAudioDevice} 
                      onValueChange={setSelectedAudioDevice}
                      disabled={isLive}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select microphone" />
                      </SelectTrigger>
                      <SelectContent>
                        {audioDevices.map(device => (
                          <SelectItem key={device.deviceId} value={device.deviceId}>
                            {device.label || `Microphone ${device.deviceId.substring(0, 5)}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Volume</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    setVolume(value[0])
                    if (value[0] > 0) setIsMuted(false)
                  }}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => setShowStreamInfo(!showStreamInfo)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Stream Info
              </Button>
              
              <Button 
                onClick={toggleStream}
                disabled={isLoading}
                variant={isLive ? "destructive" : "default"}
                className={isLive ? "bg-red-500 hover:bg-red-600" : ""}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isLive ? "Ending Stream..." : "Starting Stream..."}
                  </>
                ) : (
                  <>
                    {isLive ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        End Stream
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Go Live
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
            
            {showStreamInfo && (
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Stream Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Stream URL:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-xs">{streamUrl}</code>
                      <Button variant="ghost" size="icon" onClick={() => copyStreamInfo(streamUrl)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Stream Key:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-xs">{streamKey}</code>
                      <Button variant="ghost" size="icon" onClick={() => copyStreamInfo(streamKey)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="playlist" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Your Playlists</h3>
                <Button variant="outline" size="sm">
                  <Music className="h-4 w-4 mr-2" />
                  Add Tracks
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {playlist.map(track => (
                  <div 
                    key={track.id} 
                    className={`flex items-center justify-between p-2 rounded-md ${
                      selectedTrack === track.id ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => playTrack(track.id)}
                      >
                        {selectedTrack === track.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <p className="text-sm font-medium">{track.name}</p>
                        <p className="text-xs text-muted-foreground">{track.duration}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Hidden audio element for playing tracks */}
              <audio ref={audioRef} src="/demo-track.mp3" />
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Record Streams</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save your streams for later playback
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High Quality Streaming</Label>
                  <p className="text-sm text-muted-foreground">
                    Stream at higher bitrate (requires better connection)
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Chat Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications for chat messages while streaming
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="grid gap-2">
                <Label>Stream Quality</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (96 kbps)</SelectItem>
                    <SelectItem value="medium">Medium (128 kbps)</SelectItem>
                    <SelectItem value="high">High (256 kbps)</SelectItem>
                    <SelectItem value="ultra">Ultra (320 kbps)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
        
        {isLive && (
          <div className="text-sm text-muted-foreground">
            Stream statistics will be available after the broadcast ends
          </div>
        )}
      </CardFooter>
    </Card>
  )
} 