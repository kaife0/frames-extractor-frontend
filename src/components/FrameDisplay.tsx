import React from 'react';
import type { FrameData, VideoMetadata } from '../api/videoApi';

interface FrameDisplayProps {
  video: VideoMetadata | null;
  frames: FrameData[];
  onFrameSelect: (frame: FrameData) => void;
  selectedFrame: FrameData | null;
  isProcessing: boolean;
}

const FrameDisplay: React.FC<FrameDisplayProps> = ({
  video,
  frames,
  onFrameSelect,
  selectedFrame,
  isProcessing
}) => {
  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFrameUrl = (frame: FrameData): string => {
    // Construct URL for frame image from backend static serving
    // The backend serves static files from /frames endpoint
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';
    return `${baseUrl}/frames/${frame.videoId}/${frame.filename}`;
  };

  if (!video) {
    return (
      <div className="frame-display-section">
        <h2>Extracted Frames</h2>
        <div className="empty-state">
          <p>Upload a video to see extracted frames</p>
        </div>
      </div>
    );
  }

  return (
    <div className="frame-display-section">
      <h2>Extracted Frames</h2>
      
      <div className="video-info-summary">
        <h3>{video.name}</h3>
        <p>{frames.length} frames extracted</p>
      </div>

      {isProcessing && (
        <div className="processing-indicator">
          <div className="spinner"></div>
          <p>Extracting frames and computing features...</p>
        </div>
      )}

      {frames.length > 0 && (
        <div className="frames-grid">
          {frames.map((frame) => (              <div
                key={frame.id}
                className={`frame-item ${selectedFrame?.id === frame.id ? 'selected' : ''}`}
                onClick={() => onFrameSelect(frame)}
              >
                <div className="frame-image-container">
                  <img
                    src={getFrameUrl(frame)}
                    alt={`Frame at ${formatTimestamp(frame.timestamp)}`}
                    className="frame-image"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const imageUrl = getFrameUrl(frame);
                      console.error('Failed to load image:', imageUrl);
                      console.error('Frame data:', frame);
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="frame-error">
                            <div>❌</div>
                            <div>Image not found</div>
                            <div class="debug-info">
                              <div>Video ID: ${frame.videoId}</div>
                              <div>Filename: ${frame.filename}</div>
                              <div>URL: ${imageUrl}</div>
                            </div>
                          </div>
                        `;
                      }
                    }}
                    onLoad={() => {
                      console.log('Successfully loaded image:', getFrameUrl(frame));
                    }}
                  />
                </div>
              <div className="frame-info">
                <span className="timestamp">{formatTimestamp(frame.timestamp)}</span>
                {frame.features && (
                  <span className="features-indicator">✓ Features computed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {frames.length === 0 && !isProcessing && (
        <div className="empty-frames">
          <p>No frames extracted yet. Click "Extract Frames" to start processing.</p>
        </div>
      )}
    </div>
  );
};

export default FrameDisplay;
