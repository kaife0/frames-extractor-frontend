import React, { useState } from 'react';
import type { FrameData, SimilarFrame } from '../api/videoApi';

interface SimilaritySearchProps {
  selectedFrame: FrameData | null;
  onSearch: (frameId: string, limit: number) => Promise<SimilarFrame[]>;
}

const SimilaritySearch: React.FC<SimilaritySearchProps> = ({
  selectedFrame,
  onSearch
}) => {
  const [similarFrames, setSimilarFrames] = useState<SimilarFrame[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [resultLimit, setResultLimit] = useState(10);

  const handleSearch = async () => {
    if (!selectedFrame) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await onSearch(selectedFrame.id, resultLimit);
      setSimilarFrames(results);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Search failed');
      setSimilarFrames([]);
    } finally {
      setIsSearching(false);
    }
  };

  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFrameUrl = (frame: FrameData): string => {
    return `http://localhost:3001/frames/${frame.videoId}/${frame.filename}`;
  };

  const formatScore = (score: number): string => {
    return (score * 100).toFixed(1) + '%';
  };

  return (
    <div className="similarity-search-section">
      <h2>Similarity Search</h2>

      {!selectedFrame ? (
        <div className="empty-state">
          <p>Select a frame from the grid above to search for similar frames</p>
        </div>
      ) : (
        <div className="search-container">
          <div className="reference-frame">
            <h3>Reference Frame</h3>
            <div className="frame-item">
              <div className="frame-image-container">
                <img
                  src={getFrameUrl(selectedFrame)}
                  alt={`Reference frame at ${formatTimestamp(selectedFrame.timestamp)}`}
                  className="frame-image"
                />
              </div>
              <div className="frame-info">
                <span className="timestamp">{formatTimestamp(selectedFrame.timestamp)}</span>
              </div>
            </div>
          </div>

          <div className="search-controls">
            <div className="control-group">
              <label htmlFor="result-limit">Number of results:</label>
              <input
                id="result-limit"
                type="number"
                min="1"
                max="50"
                value={resultLimit}
                onChange={(e) => setResultLimit(Number(e.target.value))}
                disabled={isSearching}
              />
            </div>
            
            <button
              onClick={handleSearch}
              disabled={isSearching || !selectedFrame?.features}
              className="search-button"
            >
              {isSearching ? 'Searching...' : 'Find Similar Frames'}
            </button>

            {!selectedFrame?.features && (
              <p className="warning">Features not computed for this frame yet</p>
            )}
          </div>

          {searchError && (
            <div className="error-message">
              <strong>Search Error:</strong> {searchError}
            </div>
          )}

          {isSearching && (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <p>Searching for similar frames...</p>
            </div>
          )}

          {similarFrames.length > 0 && (
            <div className="search-results">
              <h3>Similar Frames ({similarFrames.length} results)</h3>
              <div className="similar-frames-grid">
                {similarFrames.map((result, index) => (
                  <div key={result.frame.id} className="similar-frame-item">
                    <div className="frame-image-container">
                      <img
                        src={getFrameUrl(result.frame)}
                        alt={`Similar frame at ${formatTimestamp(result.frame.timestamp)}`}
                        className="frame-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="frame-error">❌ Image not found</div>';
                          }
                        }}
                      />
                      <div className="similarity-score">
                        {formatScore(result.score)}
                      </div>
                    </div>
                    <div className="frame-info">
                      <span className="timestamp">{formatTimestamp(result.frame.timestamp)}</span>
                      <span className="rank">#{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {similarFrames.length === 0 && !isSearching && !searchError && selectedFrame && (
            <div className="no-results">
              <p>No similar frames found. Try with a different frame.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimilaritySearch;
