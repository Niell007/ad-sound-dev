"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/custom-toast-provider"
import { MessageSquare, Send, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar?: string
  content: string
  timestamp: Date
  type: 'message' | 'system' | 'error'
}

interface CustomChatProps {
  channelId: string
  onError?: (error: Error) => void
}

export function CustomChat({ channelId, onError }: CustomChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Simulate initial messages
  useEffect(() => {
    const initialMessages: ChatMessage[] = [
      {
        id: '1',
        userId: 'system',
        username: 'System',
        content: 'Welcome to the chat! 👋',
        timestamp: new Date(),
        type: 'system'
      },
      {
        id: '2',
        userId: 'dj',
        username: 'DJ SoundMaster',
        avatar: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?w=64&h=64&fit=crop&crop=faces',
        content: 'Hey everyone! Stream starting soon! 🎵',
        timestamp: new Date(Date.now() - 5000),
        type: 'message'
      }
    ]
    
    setTimeout(() => {
      setMessages(initialMessages)
      setIsConnecting(false)
    }, 1500)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Simulate chat connection
  useEffect(() => {
    const connectToChat = async () => {
      try {
        setIsConnecting(true)
        setError(null)
        
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Add connection message
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          userId: 'system',
          username: 'System',
          content: 'Connected to chat',
          timestamp: new Date(),
          type: 'system'
        }])
        
        setIsConnecting(false)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to connect to chat')
        setError(error.message)
        onError?.(error)
      }
    }
    
    connectToChat()
    
    return () => {
      // Cleanup chat connection
    }
  }, [channelId, onError])

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputValue.trim()) return
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'user',
      username: 'You',
      content: inputValue.trim(),
      timestamp: new Date(),
      type: 'message'
    }
    
    setMessages(prev => [...prev, newMessage])
    setInputValue("")
    
    try {
      // Here you would send the message to your backend
      // await sendMessage(channelId, newMessage)
    } catch (err) {
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      })
    }
  }

  // Handle reconnection
  const handleReconnect = async () => {
    setIsReconnecting(true)
    
    try {
      // Simulate reconnection
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setError(null)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        userId: 'system',
        username: 'System',
        content: 'Reconnected to chat',
        timestamp: new Date(),
        type: 'system'
      }])
    } catch (err) {
      setError('Failed to reconnect. Please try again.')
    } finally {
      setIsReconnecting(false)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Live Chat
        </CardTitle>
      </CardHeader>
      
      {/* Loading State */}
      {isConnecting && !error && (
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Connecting to chat...</p>
          </div>
        </CardContent>
      )}
      
      {/* Error State */}
      {error && (
        <CardContent className="flex-1 flex items-center justify-center p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              <p className="mb-4">{error}</p>
              <Button 
                onClick={handleReconnect} 
                disabled={isReconnecting}
                variant="destructive"
                size="sm"
              >
                {isReconnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Reconnecting...
                  </>
                ) : (
                  'Try Again'
                )}
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
      
      {/* Chat Messages */}
      {!isConnecting && !error && (
        <>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className="flex items-start gap-3">
                  {message.type === 'message' ? (
                    <Avatar className="h-8 w-8">
                      {message.avatar ? (
                        <AvatarImage src={message.avatar} alt={message.username} />
                      ) : (
                        <AvatarFallback>
                          {message.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {message.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      message.type === 'system' ? 'text-muted-foreground italic' : ''
                    }`}>
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <CardFooter className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2 w-full">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </>
      )}
    </Card>
  )
} 