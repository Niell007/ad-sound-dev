"use server"

import { createClient } from '@supabase/supabase-js'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import sharp from 'sharp'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface ImageDownloadOptions {
  quality?: number
  width?: number
  height?: number
  format?: 'jpeg' | 'png' | 'webp'
}

export async function downloadAndStoreImage(
  url: string,
  folder: string = 'images',
  options: ImageDownloadOptions = {}
) {
  try {
    // Generate a unique filename based on the URL
    const urlHash = crypto.createHash('md5').update(url).digest('hex')
    const ext = options.format || path.extname(url) || '.jpg'
    const filename = `${urlHash}${ext}`
    
    // Create the directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public', folder)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    // Download the image
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)
    
    const buffer = await response.arrayBuffer()
    
    // Process the image with Sharp
    let imageProcessor = sharp(Buffer.from(buffer))
    
    // Resize if dimensions are provided
    if (options.width || options.height) {
      imageProcessor = imageProcessor.resize(options.width, options.height, {
        fit: 'cover',
        position: 'center'
      })
    }
    
    // Set quality and format
    if (options.format === 'jpeg') {
      imageProcessor = imageProcessor.jpeg({ quality: options.quality || 80 })
    } else if (options.format === 'webp') {
      imageProcessor = imageProcessor.webp({ quality: options.quality || 80 })
    } else if (options.format === 'png') {
      imageProcessor = imageProcessor.png({ quality: options.quality || 80 })
    }
    
    // Save locally
    const localPath = path.join(publicDir, filename)
    await imageProcessor.toFile(localPath)
    
    // Upload to Supabase Storage
    const storagePath = `${folder}/${filename}`
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(storagePath, fs.readFileSync(localPath), {
        contentType: `image/${options.format || ext.slice(1)}`,
        upsert: true
      })
      
    if (uploadError) throw uploadError

    return {
      localPath: `/${folder}/${filename}`,
      storagePath,
      success: true
    }
  } catch (error) {
    console.error('Error processing image:', error)
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }
  }
}

export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    const contentType = response.headers.get('content-type')
    return response.ok && contentType?.startsWith('image/')
  } catch {
    return false
  }
}

export async function ensureLocalImage(
  url: string,
  folder: string = 'images',
  options: ImageDownloadOptions = {}
): Promise<string> {
  // If it's already a local path, return it
  if (url.startsWith('/')) return url
  
  // If it's a Supabase URL, return it
  if (url.includes(supabaseUrl)) return url
  
  // Try to download and store the image
  const result = await downloadAndStoreImage(url, folder, options)
  
  if (result.success) {
    return result.localPath
  }
  
  // Return default fallback image if download fails
  return `/fallback/${folder}-placeholder.png`
}