# Supabase Storage Integration

This document provides instructions for setting up and using Supabase Storage for media management in the soundmaster application.

## Overview

Supabase Storage provides a secure and scalable solution for storing and managing media files in the application. The integration allows for:

- Uploading media files (images, audio, video, documents)
- Viewing and managing uploaded files
- Organizing files with tags and metadata
- Secure access control based on user permissions

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Note your project URL and API keys

### 2. Configure Storage Buckets

1. In your Supabase dashboard, navigate to the Storage section
2. Create the following buckets:
   - `media` - For general media files
   - `profiles` - For user profile images
   - `assets` - For website assets
3. Configure bucket permissions:
   - For `media` bucket: Set RLS (Row Level Security) policies to allow authenticated users to upload and view files
   - For `profiles` bucket: Set RLS policies to allow users to manage their own profile images
   - For `assets` bucket: Set RLS policies as needed for your application

### 3. Update Environment Variables

Add the following variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_STORAGE_URL=your-supabase-storage-url
NEXT_PUBLIC_SUPABASE_STORAGE_S3_URL=your-supabase-storage-s3-url
NEXT_PUBLIC_SUPABASE_STORAGE_REGION=your-region
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=media
NEXT_PUBLIC_SUPABASE_MAX_FILE_SIZE=52428800
```

### 4. Storage Limitations

- The maximum file size for uploads is 50MB on the Free plan
- For larger file uploads (up to 50GB), you'll need to upgrade to the Pro plan

### 5. Restart Your Application

Restart your development server to apply the changes.

## Usage

### Media Gallery

The Media Gallery component provides a user interface for managing media files. It allows users to:

- Upload files via drag-and-drop or file selection
- View uploaded files in grid or list view
- Filter files by type or search by name
- View file details and download files
- Delete files when needed

### Utility Functions

The application includes several utility functions for working with Supabase Storage:

#### Upload a File

```typescript
import { uploadFile, MEDIA_BUCKET } from '@/lib/supabase/storage';

// Upload a file
const handleUpload = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await uploadFile(MEDIA_BUCKET, fileName, file);
  
  if (error) {
    console.error('Upload failed:', error);
    return;
  }
  
  console.log('File uploaded:', data);
};
```

#### Delete a File

```typescript
import { deleteFile, MEDIA_BUCKET } from '@/lib/supabase/storage';

// Delete a file
const handleDelete = async (filePath: string) => {
  const { data, error } = await deleteFile(MEDIA_BUCKET, filePath);
  
  if (error) {
    console.error('Delete failed:', error);
    return;
  }
  
  console.log('File deleted');
};
```

#### List Files

```typescript
import { listFiles, MEDIA_BUCKET } from '@/lib/supabase/storage';

// List files in a bucket
const getFiles = async () => {
  const { data, error } = await listFiles(MEDIA_BUCKET);
  
  if (error) {
    console.error('Failed to list files:', error);
    return;
  }
  
  console.log('Files:', data);
};
```

#### Get Public URL

```typescript
import { getPublicUrl, MEDIA_BUCKET } from '@/lib/supabase/storage';

// Get a public URL for a file
const fileUrl = getPublicUrl(MEDIA_BUCKET, 'path/to/file.jpg');
```

## Troubleshooting

### Common Issues

1. **Upload Failures**
   - Check file size limits (50MB per file on the Free plan)
   - Verify that the bucket exists and has the correct permissions
   - Ensure your Supabase API keys are correctly configured

2. **Access Permission Errors**
   - Review your Row Level Security (RLS) policies
   - Check that users are properly authenticated
   - Verify bucket permissions in the Supabase dashboard

3. **File Not Found Errors**
   - Confirm the file path is correct
   - Check if the file was deleted or moved
   - Verify the bucket name is correct

### Support Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## Security Considerations

- Always use Row Level Security (RLS) policies to control access to your storage buckets
- Never expose your `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Validate file types and sizes before uploading
- Consider implementing virus scanning for uploaded files
- Use signed URLs for sensitive content that should not be publicly accessible 