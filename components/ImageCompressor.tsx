'use client';

import { useState, useCallback, useEffect } from 'react';
import { Trash2, ImageIcon } from 'lucide-react';
import DropZone from './DropZone';
import ImageCard from './ImageCard';
import CompressionSettings from './CompressionSettings';
import DownloadButton from './DownloadButton';
import { CompressedImage, CompressionOptions, DEFAULT_COMPRESSION_OPTIONS } from '@/types/image';
import { compressImage, formatFileSize } from '@/lib/imageCompression';
import { createPreviewUrl, revokePreviewUrl } from '@/lib/fileUtils';

export default function ImageCompressor() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [options, setOptions] = useState<CompressionOptions>(DEFAULT_COMPRESSION_OPTIONS);
  const [isCompressing, setIsCompressing] = useState(false);

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

    // Update status to compressing
    setImages((prev) =>
      prev.map((img) =>
        imagesToCompress.find((i) => i.id === img.id)
          ? { ...img, status: 'compressing' as const }
          : img
      )
    );

    // Compress all images in parallel
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

    // Update images with results
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ImageIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SEO Image Compressor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-3">
            Compress and optimize your images for web without losing quality. Perfect for SEO and
            faster page loads.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm font-medium text-blue-800">
              ✨ Default: Targets &lt;100KB with 100% quality | WebP format | 1200px max
            </span>
          </div>
        </div>

        {/* Compression Settings */}
        <div className="mb-8">
          <CompressionSettings options={options} onOptionsChange={setOptions} />
        </div>

        {/* Drop Zone */}
        <div className="mb-8">
          <DropZone onFilesSelected={handleFilesSelected} disabled={isCompressing} />
        </div>

        {/* Summary Stats */}
        {images.length > 0 && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
                <div className="flex items-center space-x-6 text-sm">
                  <div>
                    <span className="text-gray-600">Images: </span>
                    <span className="font-semibold text-gray-900">{images.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Original: </span>
                    <span className="font-semibold text-gray-900">
                      {formatFileSize(totalOriginalSize)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Compressed: </span>
                    <span className="font-semibold text-gray-900">
                      {formatFileSize(totalCompressedSize)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Saved: </span>
                    <span className="font-semibold text-green-600">{totalSavings}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <DownloadButton images={images} />
                <button
                  onClick={handleClearAll}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-200">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No images yet</h3>
            <p className="text-gray-600">
              Upload some images to get started with compression
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
