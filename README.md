# SEO-Optimized Image Compressor

A professional client-side image compression web application built with Next.js 14+, TypeScript, and Tailwind CSS.

**✨ Quality-First Compression**: Automatically compresses images with **excellent quality preservation** (92% quality, 500KB target). The intelligent algorithm optimizes file size while maintaining visual fidelity - perfect for professional photography and high-quality web assets.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/WilsonKinyua/image-compressor&branch=claude/session-011CUaBu8wRor2awrpTREMek)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/WilsonKinyua/image-compressor)

## Features

- **🎯 Quality-First Defaults**: Preserves excellent quality (92%, 500KB target, Full HD 1920px)
- **Drag & Drop Interface**: Upload multiple images at once with visual feedback - drop anywhere on the page!
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

### Default Settings (Quality-First - Works Out-of-the-Box)
- **Quality**: 92% (excellent quality with minimal loss)
- **Target File Size**: 500KB (perfect balance of quality and size)
- **Max Dimensions**: 1920px (Full HD - preserves detail)
- **Compression Iterations**: 10 iterations (moderate, preserves quality)
- **Output Format**: WebP (best compression ratio)

### Customizable Options (Advanced Settings)
- **Quality**: 10-100% (default: 92%)
- **Max Dimensions**: Up to 4000px (default: 1920px)
- **Target File Size**: 50KB, 90KB, 100KB, 200KB, 300KB, 400KB, 500KB, 1MB, 2MB, or 5MB
- **Compression Iterations**: 5-20 iterations (default: 10)
- **Output Format**: WebP (recommended), JPEG, or PNG
- **EXIF Preservation**: Optional metadata preservation

### 💡 Recommended Settings by Use Case

**Professional Photography / High Quality:**
- Quality: 92-100%
- Target: 500KB - 2MB
- Dimensions: 1920px - 4000px
- Iterations: 10

**Web Assets / Balanced:**
- Quality: 85-92%
- Target: 200KB - 500KB
- Dimensions: 1200px - 1920px
- Iterations: 10-12

**Thumbnails / Small File Size:**
- Quality: 70-85%
- Target: 50KB - 200KB
- Dimensions: 800px - 1200px
- Iterations: 15-20

**Note**: The compression library automatically adjusts quality through iterations to reach your target. Higher iterations = more aggressive quality reduction to meet the target size.

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
