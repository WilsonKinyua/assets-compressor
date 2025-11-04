'use client';

import { useState, useCallback, useEffect } from 'react';
import { Upload } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import QualitySlider from './QualitySlider';
import ImageCard from './ImageCard';
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

  const handleQualityChange = (quality: number) => {
    setOptions({ ...options, initialQuality: quality / 100 });
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFilesSelected(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDropFiles = async (e: React.DragEvent) => {
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

  const completedImages = images.filter((img) => img.status === 'completed').length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Fast & Efficient Image Compression
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-2">
              BlazTools offering Powerful, Fast and Efficient Image Compressor to Optimize and
              Reduce image file sizes without losing quality.
            </p>
            <p className="text-sm text-gray-500">
              Allowed: JPG, PNG, JPEG, GIF, WEBP, JFIF
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Upload Zone - Only show when no images */}
          {images.length === 0 && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDropFiles}
              className={`relative mb-8 border-2 border-dashed rounded-lg p-20 text-center transition-all ${
                isDraggingOver
                  ? 'border-teal-400 bg-teal-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <input
                type="file"
                id="file-input"
                multiple
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-700">
                    Choose a Image or drag it here.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Quality Slider - Show when no images */}
          {images.length === 0 && (
            <QualitySlider
              value={Math.round(options.initialQuality * 100)}
              onChange={handleQualityChange}
            />
          )}

          {/* Images Grid */}
          {images.length > 0 && (
            <>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Compressed Images ({completedImages}/{images.length})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Total Saved: {formatFileSize(totalOriginalSize - totalCompressedSize)} (
                    {totalSavings}%)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <DownloadButton images={images} />
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {images.map((image) => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </div>

              {/* Add More Button */}
              <div className="text-center">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDropFiles}
                  className="relative inline-block"
                >
                  <input
                    type="file"
                    id="file-input-more"
                    multiple
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-input-more"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-400 text-white font-medium rounded-lg hover:bg-teal-500 transition-colors cursor-pointer"
                  >
                    <Upload className="w-5 h-5" />
                    Add More Images
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer with stats */}
      <div className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">
            Total Compressed: <span className="font-bold text-gray-900">{completedImages}</span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
