# Media Gallery and Live Streaming

This section of the application provides comprehensive media management and live streaming capabilities for DJs, managers, and staff members.

## Features

### Media Gallery

The Media Gallery allows users to:

- Upload media files (images, audio, video, documents) via drag-and-drop or file selection
- Browse uploaded files in grid or list view
- Filter files by type (image, audio, video, document)
- Search files by name
- View file details and metadata
- Download files
- Delete files when needed
- Organize files with tags

### Live Streaming

The Live Streaming feature enables DJs and managers to:

- Stream music and commentary in real-time
- Choose between microphone input, playlist audio, or both
- Monitor viewer count and stream health
- Configure stream quality and settings
- Record streams for later playback
- Share stream links with audience
- View stream analytics and history

## Technical Implementation

### Storage

Media files are stored in Supabase Storage buckets:

- `media` - For general media files (images, audio, video, documents)
- `profiles` - For user profile images
- `assets` - For website assets

### Database Tables

The following database tables support the media and streaming features:

- `stream_logs` - Records information about live streams including title, description, duration, viewer count, and timestamps

### Row Level Security (RLS)

Access to media files and stream data is controlled through Supabase Row Level Security policies:

- Users can only access their own media files and stream logs
- Admins and managers have access to all media files and stream logs
- Staff members have limited access based on their assigned permissions

## Usage

### Uploading Media

1. Navigate to the Media Gallery page
2. Click the "Upload Files" button
3. Drag and drop files or click to select files
4. Add optional metadata and tags
5. Click "Upload" to start the upload process

### Starting a Live Stream

1. Navigate to the Media Gallery page
2. Click the "Live Stream" button
3. Enter a stream title and optional description
4. Select your audio source (microphone, playlist, or both)
5. Configure stream settings if needed
6. Click "Go Live" to start streaming
7. Use the microphone controls and playlist during your stream
8. Click "End Stream" when finished

### Viewing Stream History

1. Navigate to the Streams page
2. View a list of all your past and current streams
3. Filter streams by status (live, ended, scheduled)
4. Search for specific streams by title or description
5. Click on a stream to view detailed analytics

## Permissions

Access to media and streaming features is role-based:

- **Admin**: Full access to all media and streaming features
- **Manager**: Full access to all media and streaming features
- **Staff**: Can upload and manage media, and view streams
- **User**: Limited access to media based on permissions

## API Endpoints

The following API endpoints support the media and streaming features:

- `GET /api/media` - Get a list of media files
- `POST /api/media/upload` - Upload media files
- `DELETE /api/media/:id` - Delete a media file
- `GET /api/streams` - Get a list of streams
- `POST /api/streams` - Create a new stream
- `PUT /api/streams/:id` - Update a stream
- `DELETE /api/streams/:id` - Delete a stream

## Future Enhancements

Planned enhancements for the media and streaming features include:

- Integration with popular streaming platforms (Twitch, YouTube, Facebook)
- Advanced audio processing and effects
- Audience interaction features (chat, reactions)
- Scheduled streams with automatic start/stop
- Mobile streaming support
- Multi-camera streaming for events 