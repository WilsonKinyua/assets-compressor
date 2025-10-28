# SEO-Optimized Image Compressor

A professional client-side image compression web application built with Next.js 14+, TypeScript, and Tailwind CSS.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/WilsonKinyua/image-compressor&branch=claude/session-011CUaBu8wRor2awrpTREMek)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/WilsonKinyua/image-compressor)

## Features

- **Drag & Drop Interface**: Upload multiple images at once with visual feedback
- **Advanced Compression**: Compress images to WebP, JPEG, or PNG format with customizable settings
- **Real-time Processing**: Process multiple images simultaneously using Web Workers
- **Side-by-side Comparison**: Preview original and compressed images
- **Batch Download**: Download individual images or all as a ZIP file
- **Advanced Settings**: Customize quality, dimensions, file size, and format
- **SEO Optimized**: Convert images to WebP for best web performance
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **browser-image-compression** for image compression
- **react-dropzone** for drag-and-drop functionality
- **JSZip** for batch downloads
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Upload Images**: Drag and drop images or click to browse
2. **Adjust Settings**: Customize compression options in the Advanced Settings panel
3. **Wait for Compression**: Images are compressed automatically using Web Workers
4. **Download**: Download individual images or all as a ZIP file

## Compression Settings

- **Quality**: 10-100% (default: 85%)
- **Max Dimensions**: Up to 4000px (default: 1920px)
- **Target File Size**: 500KB, 1MB, 2MB, or 5MB
- **Output Format**: WebP (recommended), JPEG, or PNG
- **EXIF Preservation**: Optional metadata preservation

## Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)
- BMP (.bmp)

## File Size Limits

- Maximum file size: 10MB per image
- No limit on number of images

## Performance

- Client-side processing (no server upload required)
- Web Workers for non-blocking compression
- Parallel processing of multiple images
- Memory-efficient with automatic URL cleanup

## Browser Support

Works on all modern browsers that support:
- Web Workers
- File API
- Drag and Drop API

## License

ISC

## Author

Built with Next.js and TypeScript
