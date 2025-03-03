import { supabase } from '@/lib/supabase/client';

/**
 * Utility functions for working with Supabase Storage
 */

// Default bucket for media files
export const MEDIA_BUCKET = 'media';

// Default bucket for profile images
export const PROFILES_BUCKET = 'profiles';

// Default bucket for website assets
export const ASSETS_BUCKET = 'assets';

/**
 * Upload a file to Supabase Storage
 * @param bucket The bucket to upload to
 * @param path The path within the bucket
 * @param file The file to upload
 * @param onProgress Optional progress callback
 * @returns The uploaded file data or error
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  onProgress?: (progress: number) => void
) {
  try {
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
      
    return {
      data: {
        ...data,
        publicUrl: publicUrlData.publicUrl
      },
      error: null
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      data: null,
      error
    };
  }
}

/**
 * Delete a file from Supabase Storage
 * @param bucket The bucket containing the file
 * @param path The path of the file to delete
 * @returns Success or error
 */
export async function deleteFile(bucket: string, path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
      
    if (error) {
      throw error;
    }
    
    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Error deleting file:', error);
    return {
      data: null,
      error
    };
  }
}

/**
 * List files in a Supabase Storage bucket
 * @param bucket The bucket to list files from
 * @param path Optional path within the bucket
 * @returns List of files or error
 */
export async function listFiles(bucket: string, path?: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path || '');
      
    if (error) {
      throw error;
    }
    
    return {
      data,
      error: null
    };
  } catch (error) {
    console.error('Error listing files:', error);
    return {
      data: null,
      error
    };
  }
}

/**
 * Get a public URL for a file in Supabase Storage
 * @param bucket The bucket containing the file
 * @param path The path of the file
 * @returns The public URL or error
 */
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
    
  return data.publicUrl;
}

/**
 * Upload a profile image to Supabase Storage
 * @param userId The user ID
 * @param file The image file
 * @param onProgress Optional progress callback
 * @returns The uploaded file data or error
 */
export async function uploadProfileImage(
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
) {
  // Create a unique file name with the original extension
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;
  
  return uploadFile(PROFILES_BUCKET, filePath, file, onProgress);
}

/**
 * Get a user's profile image URL
 * @param userId The user ID
 * @param fileName The file name
 * @returns The public URL of the profile image
 */
export function getProfileImageUrl(userId: string, fileName: string) {
  return getPublicUrl(PROFILES_BUCKET, `${userId}/${fileName}`);
} 