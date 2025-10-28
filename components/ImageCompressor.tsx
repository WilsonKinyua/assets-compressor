'use client';

import { useState, useCallback, useEffect } from 'react';
import { Sparkles, Zap, Shield } from 'lucide-react';
import DropZone from './DropZone';
import ImageCard from './ImageCard';
import CompressionSettings from './CompressionSettings';
import DownloadButton from './DownloadButton';
import { CompressedImage, CompressionOptions, DEFAULT_COMPRESSION_OPTIONS } from '@/types/image';
import { compressImage, formatFileSize } from '@/lib/imageCompression';
import { createPreviewUrl, revokePreviewUrl, validateFileType, validateFileSize } from '@/lib/fileUtils';
import { MAX_FILE_SIZE_MB } from '@/types/image';

export default function ImageCompressor() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [options, setOptions] = useState<CompressionOptions>(DEFAULT_COMPRESSION_OPTIONS);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        revokePreviewUrl(image.originalUrl);
        revokePreviewUrl(image.compressedUrl);
      });
    };
  }, [images]);

  // Full-page drag and drop handlers
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDraggingOver(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target === document.body || e.target === document.documentElement) {
        setIsDraggingOver(false);
      }
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);

      const files = Array.from(e.dataTransfer?.files || []);
      const validFiles = files.filter((file) => {
        if (!validateFileType(file)) {
          alert(`${file.name} is not a supported image format`);
          return false;
        }
        if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
          alert(`${file.name} exceeds the maximum file size of ${MAX_FILE_SIZE_MB}MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        await handleFilesSelected(validFiles);
      }
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, [options]);

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      const newImages: CompressedImage[] = files.map((file) => ({
        id: Math.random().toString(36).substring(7),
        original: file,
        compressed: null,
        originalSize: file.size,
        compressedSize: 0,
        savings: 0,
        originalUrl: createPreviewUrl(file),
        compressedUrl: '',
        status: 'pending',
      }));

      setImages((prev) => [...prev, ...newImages]);
      await compressImages(newImages);
    },
    [options]
  );

  const compressImages = async (imagesToCompress: CompressedImage[]) => {
    setIsCompressing(true);

    setImages((prev) =>
      prev.map((img) =>
        imagesToCompress.find((i) => i.id === img.id)
          ? { ...img, status: 'compressing' as const }
          : img
      )
    );

    const compressionPromises = imagesToCompress.map(async (image) => {
      try {
        const compressed = await compressImage(image.original, options);
        const compressedSize = compressed.size;
        const savings = Math.round(
          ((image.originalSize - compressedSize) / image.originalSize) * 100
        );
        const compressedUrl = createPreviewUrl(compressed);

        return {
          id: image.id,
          compressed,
          compressedSize,
          savings,
          compressedUrl,
          status: 'completed' as const,
        };
      } catch (error) {
        console.error('Error compressing image:', error);
        return {
          id: image.id,
          compressed: null,
          compressedSize: 0,
          savings: 0,
          compressedUrl: '',
          status: 'error' as const,
          error: 'Failed to compress image',
        };
      }
    });

    const results = await Promise.all(compressionPromises);

    setImages((prev) =>
      prev.map((img) => {
        const result = results.find((r) => r.id === img.id);
        return result ? { ...img, ...result } : img;
      })
    );

    setIsCompressing(false);
  };

  const handleClearAll = () => {
    images.forEach((image) => {
      revokePreviewUrl(image.originalUrl);
      revokePreviewUrl(image.compressedUrl);
    });
    setImages([]);
  };

  const totalOriginalSize = images.reduce((acc, img) => acc + img.originalSize, 0);
  const totalCompressedSize = images
    .filter((img) => img.status === 'completed')
    .reduce((acc, img) => acc + img.compressedSize, 0);
  const totalSavings =
    totalOriginalSize > 0
      ? Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100)
      : 0;

  return (
    <>
      {/* Full-page drag overlay */}
      {isDraggingOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/90 backdrop-blur-md animate-fade-in">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/10 border-4 border-dashed border-white/50 animate-bounce-subtle">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Drop your images anywhere!</h2>
            <p className="text-xl text-white/80">We'll compress them instantly</p>
          </div>
        </div>
      )}

      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-scale-in">
            {/* Logo */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-full p-6 border border-white/20">
                  <Zap className="h-12 w-12 text-white animate-float" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Compress<span className="text-primary-200">Pro</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-6">
              Professional image compression powered by AI. Drop anywhere, compress instantly.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="glass px-4 py-2 rounded-full">
                <div className="flex items-center gap-2 text-white">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">100% Client-Side</span>
                </div>
              </div>
              <div className="glass px-4 py-2 rounded-full">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">&lt;100KB Target</span>
                </div>
              </div>
              <div className="glass px-4 py-2 rounded-full">
                <div className="flex items-center gap-2 text-white">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">WebP Format</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compression Settings */}
          <div className="mb-8 animate-slide-up">
            <CompressionSettings options={options} onOptionsChange={setOptions} />
          </div>

          {/* Drop Zone */}
          {images.length === 0 && (
            <div className="mb-8 animate-scale-in">
              <DropZone onFilesSelected={handleFilesSelected} disabled={isCompressing} />
            </div>
          )}

          {/* Summary Stats */}
          {images.length > 0 && (
            <div className="mb-8 glass-strong rounded-2xl p-6 animate-slide-up">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-600">Images: </span>
                    <span className="font-bold text-2xl text-primary-700">{images.length}</span>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div>
                    <span className="text-gray-600">Original: </span>
                    <span className="font-semibold text-gray-900">
                      {formatFileSize(totalOriginalSize)}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div>
                    <span className="text-gray-600">Compressed: </span>
                    <span className="font-semibold text-gray-900">
                      {formatFileSize(totalCompressedSize)}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div>
                    <span className="text-gray-600">Saved: </span>
                    <span className="font-bold text-2xl text-green-600">{totalSavings}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <DownloadButton images={images} />
                  <button
                    onClick={handleClearAll}
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 font-medium border border-white/20"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Image Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {images.map((image) => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>
          )}

          {/* Add more images button */}
          {images.length > 0 && (
            <div className="text-center">
              <DropZone onFilesSelected={handleFilesSelected} disabled={isCompressing} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
