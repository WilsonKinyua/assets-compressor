# SEO-Optimized Image Compressor

A professional client-side image compression web application built with Next.js 14+, TypeScript, and Tailwind CSS.

**✨ Optimized by Default**: Automatically compresses images to **less than 100KB** while starting with **100% quality**. The intelligent compression algorithm automatically adjusts quality through multiple iterations to achieve the perfect balance between file size and visual quality.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/WilsonKinyua/image-compressor&branch=claude/session-011CUaBu8wRor2awrpTREMek)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/WilsonKinyua/image-compressor)

## Features

- **🎯 Smart Default Settings**: Automatically targets <100KB with 100% starting quality (90KB target, 1200px max dimension)
- **Drag & Drop Interface**: Upload multiple images at once with visual feedback
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

### Default Settings (Works Out-of-the-Box)
- **Quality**: 100% starting quality
- **Target File Size**: 90KB (below 100KB)
- **Max Dimensions**: 1200px
- **Compression Iterations**: 15 iterations
- **Output Format**: WebP (best compression)

### Customizable Options (Advanced Settings)
- **Quality**: 10-100% (default: 100%)
- **Max Dimensions**: Up to 4000px (default: 1200px)
- **Target File Size**: 50KB, 90KB, 100KB, 200KB, 300KB, 400KB, 500KB, 1MB, 2MB, or 5MB
- **Compression Iterations**: 5-20 iterations (default: 15)
- **Output Format**: WebP (recommended), JPEG, or PNG
- **EXIF Preservation**: Optional metadata preservation

### 🎯 Achieving Very Small File Sizes (50-100KB)

To compress images to 100KB or smaller while maintaining acceptable quality:

1. **Select Target Size**: Choose 50KB or 100KB from the "Target Max File Size" dropdown
2. **Reduce Dimensions**: Set "Max Width/Height" to 800-1000px for better compression
3. **Increase Iterations**: Set compression iterations to 15-20 for more aggressive compression
4. **Use WebP Format**: WebP provides the best compression ratio
5. **Adjust Quality**: Start with 80-100% quality; the library will automatically reduce it through iterations to meet your target size

**Note**: The compression library automatically adjusts quality through multiple iterations to reach your target file size. The initial quality setting is just a starting point.

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
