import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadVideo } from '../api/videoApi';
import type { VideoMetadata } from '../api/videoApi';

interface VideoUploadProps {
  onVideoUploaded: (video: VideoMetadata) => void;
  onUploadProgress: (progress: number) => void;
  currentVideo: VideoMetadata | null;
  isProcessing: boolean;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  onVideoUploaded,
  onUploadProgress,
  currentVideo,
  isProcessing
}) => {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadError(null);
    onUploadProgress(0);

    try {
      const video = await uploadVideo(file);
      onVideoUploaded(video);
      onUploadProgress(100);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      onUploadProgress(0);
    }
  }, [onVideoUploaded, onUploadProgress]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.quicktime']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-upload-section">
      <h2>Video Upload</h2>
      
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${isProcessing ? 'disabled' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          {isDragActive ? (
            <p>Drop the video file here...</p>
          ) : (
            <>
              <div className="upload-icon">📹</div>
              <p>Drag & drop a video file here, or click to select</p>
              <p className="file-types">Supported formats: MP4, AVI, MOV</p>
            </>
          )}
        </div>
      </div>

      {uploadError && (
        <div className="error-message">
          <strong>Upload Error:</strong> {uploadError}
        </div>
      )}

      {currentVideo && (
        <div className="video-summary">
          <h3>Uploaded Video</h3>
          <div className="video-info">
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{currentVideo.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Size:</span>
              <span className="value">{formatFileSize(currentVideo.size)}</span>
            </div>
            {currentVideo.duration && (
              <div className="info-row">
                <span className="label">Duration:</span>
                <span className="value">{formatDuration(currentVideo.duration)}</span>
              </div>
            )}
            {currentVideo.width && currentVideo.height && (
              <div className="info-row">
                <span className="label">Resolution:</span>
                <span className="value">{currentVideo.width} × {currentVideo.height}</span>
              </div>
            )}
            <div className="info-row">
              <span className="label">Upload Time:</span>
              <span className="value">{new Date(currentVideo.uploadTime).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
