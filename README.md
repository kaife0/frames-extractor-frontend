# Video Frame Extraction & Similarity Search - Frontend

A modern React + TypeScript web application for extracting frames from videos and finding similar frames using AI-powered vector similarity search.

## 🚀 Features

- **Video Upload**: Drag & drop or click to upload video files (MP4, AVI, MOV)
- **Frame Extraction**: Automatically extract frames from uploaded videos at specified intervals
- **Frame Display**: View all extracted frames in an organized grid layout
- **Similarity Search**: Find visually similar frames using AI-powered vector search
- **Real-time Processing**: Live status updates during video processing
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Persistent State**: Remembers your work across browser sessions

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features (Grid, Flexbox, Backdrop Filter)
- **HTTP Client**: Axios for API communication
- **File Upload**: React Dropzone for drag & drop functionality
- **Linting**: ESLint with TypeScript support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🚦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🏗️ Project Structure

```
src/
├── components/
│   ├── VideoUpload.tsx      # Video upload component with drag & drop
│   ├── FrameDisplay.tsx     # Grid display of extracted frames
│   └── SimilaritySearch.tsx # Similarity search interface
├── api/
│   └── videoApi.ts          # API client and type definitions
├── App.tsx                  # Main application component
├── App.css                  # Application styles
├── main.tsx                 # Application entry point
└── vite-env.d.ts           # Vite type definitions
```

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL` - Backend API base URL (required)

### Supported Video Formats

- MP4 (.mp4)
- AVI (.avi)
- MOV (.mov)
- QuickTime (.quicktime)

## 🎯 Usage

1. **Upload a Video**: Drag and drop a video file or click to browse
2. **Extract Frames**: Click "Extract Frames" to process the video
3. **View Frames**: Browse the extracted frames in the grid
4. **Search Similar**: Click on any frame and use "Find Similar Frames" to discover visually similar content
5. **Analyze Results**: View similarity scores and navigate through results

## 🌟 Key Features Explained

### Frame Extraction
- Extracts frames at 1-second intervals by default
- Generates thumbnails for quick preview
- Computes AI features for similarity search

### Similarity Search
- Uses vector similarity algorithms
- Provides percentage-based similarity scores
- Configurable number of results (1-50)
- Real-time visual feedback

### Responsive Design
- Mobile-first approach
- Optimized for touch interactions
- Adaptive grid layouts
- Smooth animations and transitions

## 🔌 API Integration

The frontend communicates with a backend API that provides:

- Video upload and processing
- Frame extraction with FFmpeg
- AI-powered feature computation
- Vector similarity search
- Static file serving for frame images

## 🎨 UI/UX Features

- **Modern Glass-morphism Design**: Translucent backgrounds with blur effects
- **Gradient Themes**: Beautiful color gradients throughout the interface
- **Loading States**: Clear visual feedback during processing
- **Error Handling**: User-friendly error messages and recovery options
- **Progress Indicators**: Real-time upload and processing progress
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting platform (Vercel, Netlify, etc.)

3. **Configure environment variables** in your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React and TypeScript
- Powered by Vite for fast development
- Uses modern web technologies for optimal performance
