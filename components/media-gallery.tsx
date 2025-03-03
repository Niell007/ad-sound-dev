"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useToast } from "@/components/ui/custom-toast-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const mediaFiles = [
  {
    id: "1",
    name: "Wedding Reception",
    type: "image",
    url: "/placeholder.svg?height=400&width=600",
    date: "2024-02-15",
  },
  {
    id: "2",
    name: "Corporate Event",
    type: "image",
    url: "/placeholder.svg?height=400&width=600",
    date: "2024-02-10",
  },
  // Add more media files
]

export function MediaGallery() {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files))
    }
  }

  const handleUpload = async () => {
    setIsUploading(true)
    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Files uploaded",
        description: "Your files have been uploaded successfully.",
      })
      setShowUploadDialog(false)
      setSelectedFiles([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload files.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mediaFiles.map((file) => (
          <Card key={file.id}>
            <CardHeader>
              <CardTitle className="text-base">{file.name}</CardTitle>
            </CardHeader>
            <CardContent className="relative aspect-video">
              <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="rounded-md object-cover" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="text-sm text-muted-foreground">{file.date}</span>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="files">Select Files</Label>
              <Input id="files" type="file" multiple accept="image/*" onChange={handleFileSelect} />
            </div>
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-2">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedFiles((files) => files.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={isUploading}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

