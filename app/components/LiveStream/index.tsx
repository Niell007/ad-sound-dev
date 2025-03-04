"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export default function LiveStream() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-4">
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
              <iframe
                src="https://player.kick.com/soundmasterlive"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                scrolling="no"
                allowFullScreen={true}
              />
            </div>
          </Card>
        </div>

        {/* Chat (Read Only) */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="relative w-full h-[600px]">
              <iframe
                src="https://kick.com/soundmasterlive/chatroom"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 