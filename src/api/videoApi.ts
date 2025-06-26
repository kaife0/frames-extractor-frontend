import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for video uploads
});

// Types
export interface VideoMetadata {
  id: string;
  name: string;
  size: number;
  duration?: number;
  width?: number;
  height?: number;
  uploadTime: string;
  framePath: string;
}

export interface FrameData {
  id: string;
  videoId: string;
  timestamp: number;
  filename: string;
  path: string;
  features?: number[];
}

export interface SimilarFrame {
  frame: FrameData;
  score: number;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

// API functions
export const uploadVideo = async (file: File): Promise<VideoMetadata> => {
  const formData = new FormData();
  formData.append('video', file);

  const response = await api.post<ApiResponse<{ video: VideoMetadata }>>('/video/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data.video;
};

export const extractFrames = async (videoId: string, interval: number = 1): Promise<FrameData[]> => {
  const response = await api.post<ApiResponse<{ frames: FrameData[]; count: number }>>(
    `/video/extract-frames/${videoId}`,
    { interval }
  );

  return response.data.data.frames;
};

export const searchSimilarFrames = async (frameId: string, limit: number = 10): Promise<SimilarFrame[]> => {
  const response = await api.post<ApiResponse<{ similarFrames: SimilarFrame[]; count: number }>>(
    '/video/search-similar',
    { frameId, limit }
  );

  return response.data.data.similarFrames;
};

export const getVideoInfo = async (videoId: string): Promise<VideoMetadata> => {
  const response = await api.get<ApiResponse<{ video: VideoMetadata }>>(`/video/${videoId}`);
  return response.data.data.video;
};

export const getVideoFrames = async (videoId: string): Promise<FrameData[]> => {
  const response = await api.get<ApiResponse<{ frames: FrameData[]; count: number }>>(
    `/video/${videoId}/frames`
  );
  return response.data.data.frames;
};
