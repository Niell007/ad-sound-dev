"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Radio } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export default function LiveRadioPage() {
  const [error, setError] = React.useState<string | null>(null)
  const [streamLoading, setStreamLoading] = React.useState(true)
  const [chatLoading, setChatLoading] = React.useState(true)

  const handleStreamLoad = () => {
    setStreamLoading(false)
    setError(null)
  }

  const handleChatLoad = () => {
    setChatLoading(false)
    setError(null)
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-primary" />
          <h1 className="text-4xl font-bold">Live Radio</h1>
        </div>
        <p className="text-muted-foreground">
          Listen to our live radio stream powered by Kick.com
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button variant="outline" asChild>
          <a 
            href="https://kick.com/signup" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Create Kick Account
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Stream Player */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {streamLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <iframe
                src="https://player.kick.com/soundmasterlive"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                scrolling="no"
                allowFullScreen={true}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                onLoad={handleStreamLoad}
                onError={() => {
                  setError("Stream is currently offline or unavailable. Please try again later.")
                  setStreamLoading(false)
                }}
                loading="lazy"
              />
            </div>
          </Card>
        </div>

        {/* Chat (Read Only) */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="relative w-full h-[600px]">
              {chatLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <iframe
                src="https://kick.com/soundmasterlive/chatroom"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                onLoad={handleChatLoad}
                onError={() => {
                  setError("Chat is currently unavailable. Please try again later.")
                  setChatLoading(false)
                }}
                loading="lazy"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 