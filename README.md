# SEO-Optimized Image Compressor

A professional client-side image compression web application built with Next.js 14+, TypeScript, and Tailwind CSS.

**✨ Balanced Compression**: Automatically compresses images to **~100KB** while preserving excellent quality (95% starting quality, Full HD 1920px). Smart algorithm uses moderate iterations to achieve the perfect balance between file size and visual fidelity.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/WilsonKinyua/image-compressor&branch=claude/session-011CUaBu8wRor2awrpTREMek)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/WilsonKinyua/image-compressor)

## Features

- **🎯 Balanced Smart Defaults**: Targets ~100KB with 95% quality, Full HD 1920px, 10 iterations - excellent quality preservation!
- **Drag & Drop Anywhere**: Upload multiple images - drop anywhere on the page with visual feedback
- **Advanced Compression**: Compress images to WebP, JPEG, or PNG format with customizable settings
- **Real-time Processing**: Process multiple images simultaneously using Web Workers
- **Side-by-side Comparison**: Preview original and compressed images
- **Batch Download**: Download individual images or all as a ZIP file
- **Advanced Settings**: Customize quality, dimensions, file size, and format (50KB-5MB range)
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

### 🎯 Balanced Default Settings (Works Out-of-the-Box)
Our defaults are carefully tuned for the perfect balance of quality and file size:

- **Quality**: 95% starting quality (prevents over-compression)
- **Target File Size**: 100KB (sweet spot for web use)
- **Max Dimensions**: 1920px Full HD (preserves detail)
- **Compression Iterations**: 10 iterations (moderate, quality-preserving)
- **Output Format**: WebP (best compression ratio)

**Why these settings work:** Starting at 95% instead of 100% gives the algorithm room to optimize without dramatic quality loss. Full HD dimensions preserve image detail. Fewer iterations (10 vs 15) means less aggressive quality reduction.

### Customizable Options (Advanced Settings)
- **Quality**: 10-100% (default: 95%)
- **Max Dimensions**: Up to 4000px (default: 1920px)
- **Target File Size**: 50KB, 90KB, 100KB, 200KB, 300KB, 400KB, 500KB, 1MB, 2MB, or 5MB
- **Compression Iterations**: 5-20 iterations (default: 10)
- **Output Format**: WebP (recommended), JPEG, or PNG
- **EXIF Preservation**: Optional metadata preservation

### 💡 Recommended Settings by Goal

**Balanced (Default - Recommended):**
- Quality: 95%, Target: 100KB, Dimensions: 1920px, Iterations: 10
- Perfect balance of quality and file size

**Maximum Quality:**
- Quality: 100%, Target: 500KB-1MB, Dimensions: 1920-4000px, Iterations: 5-10
- Best for professional photography

**Ultra Small Files:**
- Quality: 85-95%, Target: 50-90KB, Dimensions: 800-1200px, Iterations: 15-20
- Best for thumbnails and previews

**Note**: The compression library automatically adjusts quality through iterations to reach your target. Higher iterations = more aggressive quality reduction.

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
