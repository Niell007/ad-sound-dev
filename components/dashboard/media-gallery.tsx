"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import Image from "next/image"
import { useDropzone } from 'react-dropzone'
import { useToast } from "@/components/ui/custom-toast-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Loader2, 
  Upload, 
  X, 
  Image as ImageIcon, 
  FileText, 
  FileAudio, 
  FileVideo, 
  File, 
  Trash2, 
  Download,
  Search,
  Filter,
  Grid3X3,
  List as ListIcon,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { supabase } from "@/lib/supabase/client"

// Mock data for media files
const mediaFiles = [
  {
    id: "1",
    name: "Wedding Reception",
    type: "image",
    url: "/placeholder.svg?height=400&width=600",
    date: "2024-02-15",
    size: 2400000,
    tags: ["wedding", "event"],
  },
  {
    id: "2",
    name: "Corporate Event",
    type: "image",
    url: "/placeholder.svg?height=400&width=600",
    date: "2024-02-10",
    size: 1800000,
    tags: ["corporate", "event"],
  },
  {
    id: "3",
    name: "Studio Session",
    type: "audio",
    url: "/placeholder.svg?height=400&width=600",
    date: "2024-02-05",
    size: 8500000,
    tags: ["studio", "recording"],
  },
  {
    id: "4",
    name: "Live Performance",
    type: "video",
    url: "/placeholder.svg?height=400&width=600",
    date: "2024-01-28",
    size: 25000000,
    tags: ["live", "performance"],
  },
  {
    id: "5",
    name: "Event Contract",
    type: "document",
    url: "/placeholder.svg?height=400&width=600",
    date: "2024-01-20",
    size: 450000,
    tags: ["document", "contract"],
  },
  {
    id: "6",
    name: "Birthday Party",
    type: "image",
    url: "/placeholder.svg?height=400&width=600",
    date: "2024-01-15",
    size: 3200000,
    tags: ["birthday", "event"],
  },
]

// File type icons
const fileTypeIcons = {
  image: <ImageIcon className="h-6 w-6 text-blue-500" />,
  audio: <FileAudio className="h-6 w-6 text-green-500" />,
  video: <FileVideo className="h-6 w-6 text-purple-500" />,
  document: <FileText className="h-6 w-6 text-amber-500" />,
  default: <File className="h-6 w-6 text-gray-500" />
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get file type from mime type
const getFileType = (file: File): string => {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('audio/')) return 'audio'
  if (file.type.startsWith('video/')) return 'video'
  if (file.type.startsWith('application/pdf') || 
      file.type.startsWith('application/msword') || 
      file.type.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
      file.type.startsWith('text/')) return 'document'
  return 'default'
}

// Interface for MediaGallery props
interface MediaGalleryProps {
  showUploadDialog?: boolean;
  setShowUploadDialog?: (show: boolean) => void;
}

// Interface for media file
interface MediaFile {
  id: string;
  name: string;
  type: string;
  url: string;
  date: string;
  size: number;
  tags?: string[];
  path?: string;
  bucket?: string;
}

export function MediaGallery({ showUploadDialog: externalShowUploadDialog, setShowUploadDialog: externalSetShowUploadDialog }: MediaGalleryProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [internalShowUploadDialog, setInternalShowUploadDialog] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [files, setFiles] = useState<MediaFile[]>([])
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [showFileDetails, setShowFileDetails] = useState(false)
  
  // Use external or internal dialog state
  const showUploadDialog = externalShowUploadDialog !== undefined ? externalShowUploadDialog : internalShowUploadDialog
  const setShowUploadDialog = externalSetShowUploadDialog || setInternalShowUploadDialog

  // Fetch files from Supabase Storage
  useEffect(() => {
    async function fetchFiles() {
      setIsLoading(true)
      try {
        // Get files from the 'media' bucket
        const { data: files, error } = await supabase.storage.from('media').list()
        
        if (error) {
          throw error
        }
        
        if (files) {
          // Get public URLs for each file
          const mediaFiles: MediaFile[] = await Promise.all(
            files.map(async (file) => {
              const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(file.name)
              
              // Determine file type based on file extension
              let type = 'default'
              const extension = file.name.split('.').pop()?.toLowerCase() || ''
              
              if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
                type = 'image'
              } else if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
                type = 'audio'
              } else if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
                type = 'video'
              } else if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
                type = 'document'
              }
              
              return {
                id: file.id,
                name: file.name,
                type,
                url: publicUrl.publicUrl,
                date: new Date(file.created_at || '').toISOString().split('T')[0],
                size: file.metadata?.size || 0,
                path: file.name,
                bucket: 'media'
              }
            })
          )
          
          setFiles(mediaFiles)
        }
      } catch (error) {
        console.error('Error fetching files:', error)
        toast({
          title: "Error",
          description: "Failed to load files from storage. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchFiles()
  }, [supabase, toast])

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles])
  }, [])
  
  const { 
    getRootProps, 
    getInputProps, 
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': [],
      'audio/*': [],
      'video/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'text/plain': []
    },
    maxSize: parseInt(process.env.NEXT_PUBLIC_SUPABASE_MAX_FILE_SIZE || '52428800'), // Use env var or default to 50MB
  })

  // Handle file selection from input
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(event.target.files as FileList)])
    }
  }

  // Handle file upload to Supabase Storage
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    
    setIsUploading(true)
    
    try {
      // Initialize progress for each file
      const initialProgress = selectedFiles.reduce((acc, file) => {
        acc[file.name] = 0
        return acc
      }, {} as {[key: string]: number})
      
      setUploadProgress(initialProgress)
      
      // Upload each file to Supabase Storage
      const newFiles = await Promise.all(selectedFiles.map(async (file) => {
        // Create a unique file name to avoid conflicts
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${file.name}`
        
        // Upload the file with progress tracking
        const { data, error } = await supabase.storage
          .from('media')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (error) {
          throw error
        }
        
        // Update progress to 100% when upload is complete
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 100
        }))
        
        // Get the public URL for the uploaded file
        const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName)
        
        // Return the file data
        return {
          id: data.path,
          name: file.name,
          type: getFileType(file),
          url: publicUrlData.publicUrl,
          date: new Date().toISOString().split('T')[0],
          size: file.size,
          tags: [],
          path: fileName,
          bucket: 'media'
        }
      }))
      
      // Add the new files to the state
      setFiles(prev => [...newFiles, ...prev])
      
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}.`,
      })
      
      setShowUploadDialog(false)
      setSelectedFiles([])
      setUploadProgress({})
    } catch (error) {
      console.error('Error uploading files:', error)
      toast({
        title: "Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }
  
  // Handle file deletion
  const handleDeleteFile = async (file: MediaFile) => {
    if (!file.path || !file.bucket) {
      toast({
        title: "Error",
        description: "File information is incomplete. Cannot delete.",
        variant: "destructive",
      })
      return
    }
    
    try {
      const { error } = await supabase.storage.from(file.bucket).remove([file.path])
      
      if (error) {
        throw error
      }
      
      setFiles(prev => prev.filter(f => f.id !== file.id))
      
      toast({
        title: "File deleted",
        description: "The file has been removed from storage.",
      })
    } catch (error) {
      console.error('Error deleting file:', error)
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Handle file details view
  const handleViewDetails = (file: MediaFile) => {
    setSelectedFile(file)
    setShowFileDetails(true)
  }
  
  // Filter files based on search and type filter
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = searchQuery === '' || 
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (file.tags && file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      
      const matchesType = typeFilter === 'all' || file.type === typeFilter
      
      return matchesSearch && matchesType
    })
  }, [files, searchQuery, typeFilter])
  
  // Get unique file types for filter
  const fileTypes = useMemo(() => {
    return Array.from(new Set(files.map(file => file.type)))
  }, [files])

  // Render the upload dialog
  const renderUploadDialog = () => (
    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-border'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Drag & drop files here, or click to select files
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports images, audio, video, and documents up to 50MB
          </p>
        </div>
        
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Selected Files ({selectedFiles.length})</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    {fileTypeIcons[getFileType(file) as keyof typeof fileTypeIcons] || fileTypeIcons.default}
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {isUploading && (
              <div className="space-y-2 mt-4">
                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                  <div key={fileName} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="truncate max-w-[200px]">{fileName}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1" />
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => {
                  setSelectedFiles([]);
                  setUploadProgress({});
                }}
              >
                Clear All
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
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
        )}
      </DialogContent>
    </Dialog>
  );

  // Render a file item
  const renderFileItem = (file: MediaFile) => {
    if (view === 'grid') {
      return (
        <Card key={file.id} className="overflow-hidden group">
          <div className="relative aspect-video bg-muted">
            {file.type === 'image' ? (
              <Image
                src={file.url}
                alt={file.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                {fileTypeIcons[file.type as keyof typeof fileTypeIcons] || fileTypeIcons.default}
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-white" onClick={() => handleViewDetails(file)}>
                      <FileText className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-white" onClick={() => handleDeleteFile(file)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <CardFooter className="p-2">
            <div className="w-full">
              <h3 className="text-sm font-medium truncate">{file.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                <p className="text-xs text-muted-foreground">{file.date}</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      );
    } else {
      return (
        <div key={file.id} className="flex items-center justify-between p-3 border-b hover:bg-muted/50 transition-colors">
          <div className="flex items-center space-x-3">
            {file.type === 'image' ? (
              <div className="relative w-10 h-10 rounded overflow-hidden bg-muted">
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center">
                {fileTypeIcons[file.type as keyof typeof fileTypeIcons] || fileTypeIcons.default}
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium">{file.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                <p className="text-xs text-muted-foreground">{file.date}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button size="icon" variant="ghost" onClick={() => handleViewDetails(file)}>
              <FileText className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleDeleteFile(file)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search media files..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {fileTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size="icon"
              className="rounded-none"
              onClick={() => setView('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="icon"
              className="rounded-none"
              onClick={() => setView('list')}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Media files grid/list */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading media files...</span>
        </div>
      ) : filteredFiles.length > 0 ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-1 border rounded-md overflow-hidden'}>
          {filteredFiles.map(renderFileItem)}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <File className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No media files found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery || typeFilter !== 'all' ? 'Try adjusting your search or filters' : 'Upload files to get started'}
          </p>
          {!searchQuery && typeFilter === 'all' && (
            <Button className="mt-4" onClick={() => setShowUploadDialog(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          )}
        </div>
      )}
      
      {/* Upload dialog */}
      {renderUploadDialog()}
      
      {/* File details dialog */}
      <Dialog open={showFileDetails} onOpenChange={setShowFileDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-md">
                {selectedFile.type === 'image' ? (
                  <Image 
                    src={selectedFile.url} 
                    alt={selectedFile.name} 
                    fill 
                    className="object-contain" 
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    {fileTypeIcons[selectedFile.type as keyof typeof fileTypeIcons] || fileTypeIcons.default}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <p className="text-sm font-medium">{selectedFile.type.charAt(0).toUpperCase() + selectedFile.type.slice(1)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Size</Label>
                  <p className="text-sm font-medium">{formatFileSize(selectedFile.size)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date Added</Label>
                  <p className="text-sm font-medium">{selectedFile.date}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Storage Path</Label>
                <p className="text-sm font-medium break-all">{selectedFile.bucket}/{selectedFile.path}</p>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Tags</Label>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedFile.tags && selectedFile.tags.length > 0 ? (
                    selectedFile.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowFileDetails(false)}>
                  Close
                </Button>
                <Button 
                  variant="default"
                  onClick={() => {
                    window.open(selectedFile.url, '_blank');
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

