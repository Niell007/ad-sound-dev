"use client";

import { useState } from "react";
import { MediaGallery } from "@/components/dashboard/media-gallery";
import { LiveStream } from "@/components/dashboard/live-stream";
import { Button } from "@/components/ui/button";
import { Upload, Radio, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function MediaPage() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showLiveStream, setShowLiveStream] = useState(false);
  
  return (
    <div className="space-y-6 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Media Gallery</h2>
          <p className="text-muted-foreground">Upload, manage, and stream your media files.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={showLiveStream ? "secondary" : "outline"} 
            onClick={() => setShowLiveStream(!showLiveStream)}
          >
            <Radio className={`mr-2 h-4 w-4 ${showLiveStream ? "text-red-500" : ""}`} />
            {showLiveStream ? "Hide Stream" : "Live Stream"}
          </Button>
          <Button onClick={() => setShowUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>
      
      {showLiveStream && (
        <div className="mb-6">
          <LiveStream onClose={() => setShowLiveStream(false)} />
        </div>
      )}
      
      <Tabs defaultValue="gallery" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="info">Storage Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery" className="space-y-4">
          <MediaGallery showUploadDialog={showUploadDialog} setShowUploadDialog={setShowUploadDialog} />
        </TabsContent>
        
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Supabase Storage</CardTitle>
              <CardDescription>
                Learn how to use and configure Supabase Storage for your media files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">What is Supabase Storage?</h3>
                <p className="text-muted-foreground mt-1">
                  Supabase Storage provides a secure and scalable solution for storing and managing media files in your application.
                  It offers features like file uploads, public/private buckets, and access control through Row Level Security (RLS).
                </p>
                <p className="text-muted-foreground mt-1">
                  Your project is configured with a 50MB file size limit per upload on the Free plan.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Storage Buckets</h3>
                <p className="text-muted-foreground mt-1">
                  This application uses the following storage buckets:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li><strong>media</strong> - For general media files (images, audio, video, documents)</li>
                  <li><strong>profiles</strong> - For user profile images</li>
                  <li><strong>assets</strong> - For website assets</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">File Management</h3>
                <p className="text-muted-foreground mt-1">
                  The Media Gallery allows you to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Upload files via drag-and-drop or file selection</li>
                  <li>View uploaded files in grid or list view</li>
                  <li>Filter files by type or search by name</li>
                  <li>View file details and download files</li>
                  <li>Delete files when needed</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Live Streaming</h3>
                <p className="text-muted-foreground mt-1">
                  The Live Streaming feature allows DJs and managers to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Stream music and commentary in real-time</li>
                  <li>Use microphone input or play from a playlist</li>
                  <li>Monitor viewer count and stream health</li>
                  <li>Configure stream quality and settings</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Documentation</h3>
                <p className="text-muted-foreground mt-1">
                  For detailed setup instructions and usage examples, refer to the documentation:
                </p>
                <div className="mt-2">
                  <Link 
                    href="/docs/supabase-storage-integration.md" 
                    target="_blank"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    <Info className="mr-1 h-4 w-4" />
                    Supabase Storage Integration Guide
                  </Link>
                </div>
                <div className="mt-2">
                  <a 
                    href="https://supabase.com/docs/guides/storage" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    <Info className="mr-1 h-4 w-4" />
                    Official Supabase Storage Documentation
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

