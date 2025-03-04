"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ExternalLink, Radio, Volume2, MessageSquare, 
  AlertCircle, RefreshCcw, Radio as RadioIcon
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'

export default function LiveRadioPage() {
  const [error, setError] = React.useState<string | null>(null)
  const [streamLoading, setStreamLoading] = React.useState(true)
  const [isStreamOnline, setIsStreamOnline] = React.useState(false)

  const handleStreamLoad = () => {
    setStreamLoading(false)
    setError(null)
    setIsStreamOnline(true)
  }

  const handleRetry = () => {
    setStreamLoading(true)
    setError(null)
    setRetryKey(prev => prev + 1)
  }

  const [retryKey, setRetryKey] = React.useState(0)

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-8 space-y-6 min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <RadioIcon className="h-7 w-7 text-rose-500" />
            {isStreamOnline && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500"
              >
                <motion.div
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-full bg-emerald-500 opacity-50"
                />
              </motion.div>
            )}
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-rose-400 to-rose-300">
            Live Radio
          </h1>
          {isStreamOnline && (
            <Badge 
              variant="secondary" 
              className="ml-2 bg-gradient-to-r from-emerald-500/10 to-emerald-500/20 border-emerald-500/50"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              ON AIR
            </Badge>
          )}
        </motion.div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-muted-foreground max-w-2xl">
            Experience high-quality music streaming with real-time updates.
            Join our community on Kick.com for the ultimate live radio experience.
          </p>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <a 
              href="https://kick.com/signup" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Join Kick
            </a>
          </Button>
        </div>
      </div>

      <Separator className="my-6 opacity-50" />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert variant="destructive" className="border-rose-500/50 bg-rose-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Stream Error</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleRetry}
                  className="ml-4 bg-rose-500 hover:bg-rose-600"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Stream Player */}
        <motion.div 
          className="lg:col-span-4"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95 border-rose-500/10">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {streamLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                    <p className="text-sm text-muted-foreground">Loading stream...</p>
                  </div>
                </div>
              )}
              <iframe
                key={`stream-${retryKey}`}
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
                  setIsStreamOnline(false)
                }}
                loading="lazy"
              />
            </div>
            <div className="p-4 flex items-center justify-between bg-card/50 backdrop-blur-sm border-t border-rose-500/10">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-rose-500" />
                <span className="text-sm font-medium">Live Stream</span>
              </div>
              {isStreamOnline && (
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center"
                  >
                    <Badge 
                      variant="outline" 
                      className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/20 border-emerald-500/50 text-emerald-500"
                    >
                      Streaming Live
                    </Badge>
                  </motion.div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
} 