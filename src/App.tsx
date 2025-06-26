import React, { useState, useEffect } from 'react';
import VideoUpload from './components/VideoUpload';
import FrameDisplay from './components/FrameDisplay';
import SimilaritySearch from './components/SimilaritySearch';
import { extractFrames, searchSimilarFrames } from './api/videoApi';
import type { VideoMetadata, FrameData, SimilarFrame } from './api/videoApi';
import './App.css';

interface AppState {
  currentVideo: VideoMetadata | null;
  frames: FrameData[];
  selectedFrame: FrameData | null;
  uploadProgress: number;
  isProcessing: boolean;
  processStatus: string;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    // Restore state from localStorage
    const saved = localStorage.getItem('videoFrameApp');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          currentVideo: parsed.currentVideo || null,
          frames: parsed.frames || [],
          selectedFrame: null, // Don't restore selected frame
          uploadProgress: 0,
          isProcessing: false,
          processStatus: ''
        };
      } catch {
        // Invalid data, use default
      }
    }
    return {
      currentVideo: null,
      frames: [],
      selectedFrame: null,
      uploadProgress: 0,
      isProcessing: false,
      processStatus: ''
    };
  });

  // Save state to localStorage (excluding temporary states)
  useEffect(() => {
    const dataToSave = {
      currentVideo: state.currentVideo,
      frames: state.frames
    };
    localStorage.setItem('videoFrameApp', JSON.stringify(dataToSave));
  }, [state.currentVideo, state.frames]);

  const handleVideoUploaded = (video: VideoMetadata) => {
    setState(prev => ({
      ...prev,
      currentVideo: video,
      frames: [], // Clear previous frames
      selectedFrame: null,
      uploadProgress: 100
    }));
  };

  const handleUploadProgress = (progress: number) => {
    setState(prev => ({ ...prev, uploadProgress: progress }));
  };

  const handleExtractFrames = async () => {
    if (!state.currentVideo) return;

    setState(prev => ({
      ...prev,
      isProcessing: true,
      processStatus: 'Extracting frames...'
    }));

    try {
      const extractedFrames = await extractFrames(state.currentVideo.id, 1);
      setState(prev => ({
        ...prev,
        frames: extractedFrames,
        isProcessing: false,
        processStatus: 'Frames extracted successfully!'
      }));

      // Clear status after 3 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, processStatus: '' }));
      }, 3000);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        processStatus: `Error: ${error instanceof Error ? error.message : 'Frame extraction failed'}`
      }));
    }
  };

  const handleFrameSelect = (frame: FrameData) => {
    setState(prev => ({ ...prev, selectedFrame: frame }));
  };

  const handleSimilaritySearch = async (frameId: string, limit: number): Promise<SimilarFrame[]> => {
    return await searchSimilarFrames(frameId, limit);
  };

  const handleReset = () => {
    setState({
      currentVideo: null,
      frames: [],
      selectedFrame: null,
      uploadProgress: 0,
      isProcessing: false,
      processStatus: ''
    });
    localStorage.removeItem('videoFrameApp');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Video Frame Extraction & Similarity Search</h1>
        <p>Upload videos, extract frames, and find similar content using AI-powered vector search</p>
      </header>

      <main className="app-main">
        <section className="upload-section">
          <VideoUpload
            onVideoUploaded={handleVideoUploaded}
            onUploadProgress={handleUploadProgress}
            currentVideo={state.currentVideo}
            isProcessing={state.isProcessing}
          />

          {state.uploadProgress > 0 && state.uploadProgress < 100 && (
            <div className="progress-bar">
              <div 
                className={`progress-fill progress-${Math.floor(state.uploadProgress / 10) * 10}`}
              ></div>
            </div>
          )}

          {state.currentVideo && (
            <div className="action-buttons">
              <button
                onClick={handleExtractFrames}
                disabled={state.isProcessing}
                className="extract-button"
              >
                {state.isProcessing ? 'Processing...' : 'Extract Frames'}
              </button>
              
              <button
                onClick={handleReset}
                className="reset-button"
                disabled={state.isProcessing}
              >
                Upload New Video
              </button>
            </div>
          )}

          {state.processStatus && (
            <div className={`status-message ${state.processStatus.startsWith('Error') ? 'error' : 'success'}`}>
              {state.processStatus}
            </div>
          )}
        </section>

        {state.currentVideo && (
          <section className="frames-section">
            <FrameDisplay
              video={state.currentVideo}
              frames={state.frames}
              onFrameSelect={handleFrameSelect}
              selectedFrame={state.selectedFrame}
              isProcessing={state.isProcessing}
            />
          </section>
        )}

        {state.currentVideo && state.frames.length > 0 && (
          <section className="search-section">
            <SimilaritySearch
              selectedFrame={state.selectedFrame}
              onSearch={handleSimilaritySearch}
            />
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with React, TypeScript, Express.js, and Vector Similarity Search</p>
      </footer>
    </div>
  );
};

export default App;
