'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Lock, X } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import QualitySlider from './QualitySlider';
import ImageCard from './ImageCard';
import DownloadButton from './DownloadButton';
import FileInput from './FileInput';
import { CompressedImage, CompressionOptions, DEFAULT_COMPRESSION_OPTIONS } from '@/types/image';
import { compressImage, formatFileSize } from '@/lib/imageCompression';
import { createPreviewUrl, revokePreviewUrl, validateFileType, validateFileSize } from '@/lib/fileUtils';
import { MAX_FILE_SIZE_MB } from '@/types/image';

export default function ImageCompressor() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [options, setOptions] = useState<CompressionOptions>(DEFAULT_COMPRESSION_OPTIONS);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Revoke object URLs only when the component unmounts. Keying this on
  // `images` would revoke URLs that are still rendered after each update.
  const imagesRef = useRef(images);
  imagesRef.current = images;
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => {
        revokePreviewUrl(image.originalUrl);
        revokePreviewUrl(image.compressedUrl);
      });
    };
  }, []);

  const compressImages = useCallback(
    async (imagesToCompress: CompressedImage[]) => {
      const results = await Promise.all(
        imagesToCompress.map(async (image) => {
          try {
            const compressed = await compressImage(image.original, options);
            const compressedSize = compressed.size;
            const savings = Math.round(
              ((image.originalSize - compressedSize) / image.originalSize) * 100
            );
            return {
              id: image.id,
              compressed,
              compressedSize,
              savings,
              compressedUrl: createPreviewUrl(compressed),
              status: 'completed' as const,
            };
          } catch (err) {
            console.error('Error compressing image:', err);
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
        })
      );

      setImages((prev) =>
        prev.map((img) => {
          const result = results.find((r) => r.id === img.id);
          return result ? { ...img, ...result } : img;
        })
      );
    },
    [options]
  );

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      const rejected: string[] = [];
      const validFiles = files.filter((file) => {
        if (!validateFileType(file)) {
          rejected.push(`${file.name} is not a supported image format`);
          return false;
        }
        if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
          rejected.push(`${file.name} is larger than ${MAX_FILE_SIZE_MB}MB`);
          return false;
        }
        return true;
      });

      setError(rejected.length > 0 ? rejected.join('. ') : null);
      if (validFiles.length === 0) return;

      const newImages: CompressedImage[] = validFiles.map((file) => ({
        id: crypto.randomUUID(),
        original: file,
        compressed: null,
        originalSize: file.size,
        compressedSize: 0,
        savings: 0,
        originalUrl: createPreviewUrl(file),
        compressedUrl: '',
        status: 'compressing',
      }));

      setImages((prev) => [...prev, ...newImages]);
      await compressImages(newImages);
    },
    [compressImages]
  );

  const handleClearAll = () => {
    images.forEach((image) => {
      revokePreviewUrl(image.originalUrl);
      revokePreviewUrl(image.compressedUrl);
    });
    setImages([]);
    setError(null);
  };

  // Totals are over completed images only, so the original and compressed
  // sums cover the same set and the percentage stays honest mid-batch.
  const completed = images.filter((img) => img.status === 'completed');
  const completedOriginalSize = completed.reduce((acc, img) => acc + img.originalSize, 0);
  const completedCompressedSize = completed.reduce((acc, img) => acc + img.compressedSize, 0);
  const totalSaved = Math.max(0, completedOriginalSize - completedCompressedSize);
  const totalSavings =
    completedOriginalSize > 0 ? Math.round((totalSaved / completedOriginalSize) * 100) : 0;

  const handleQualityChange = (quality: number) => {
    setOptions({ ...options, initialQuality: quality / 100 });
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
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
    await handleFilesSelected(Array.from(e.dataTransfer?.files || []));
  };

  const completedImages = completed.length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Compress images without the upload
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto mb-4">
              Shrink JPG, PNG, WebP, GIF and BMP files. Everything runs locally in your
              browser, so your images never leave your device.
            </p>
            <p className="inline-flex items-center gap-2 text-sm text-teal-700 font-medium">
              <Lock className="w-4 h-4" />
              100% in-browser — no uploads, no servers
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {error && (
            <div className="mb-6 flex items-start justify-between gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                aria-label="Dismiss"
                className="text-red-500 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {images.length === 0 ? (
            <div className="space-y-6">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDropFiles}
                className={`relative border-2 border-dashed rounded-xl p-16 text-center transition-colors ${
                  isDraggingOver
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <FileInput
                  id="file-input"
                  onChange={handleFileInputChange}
                  labelClassName="flex flex-col items-center justify-center gap-4 cursor-pointer peer-focus-visible:outline-none"
                >
                  <div className="w-14 h-14 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-teal-700" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-800">
                      Choose images or drag them here
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG, WebP, GIF, BMP · up to {MAX_FILE_SIZE_MB}MB each
                    </p>
                  </div>
                </FileInput>
              </div>

              <QualitySlider
                value={Math.round(options.initialQuality * 100)}
                onChange={handleQualityChange}
              />
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Compressed images ({completedImages}/{images.length})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Total saved: {formatFileSize(totalSaved)} ({totalSavings}%)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <DownloadButton images={images} />
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                  >
                    Clear all
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {images.map((image) => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </div>

              <div className="text-center">
                <FileInput
                  id="file-input-more"
                  onChange={handleFileInputChange}
                  labelClassName="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white font-medium rounded-lg hover:bg-teal-800 transition-colors cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-teal-600 peer-focus-visible:ring-offset-2"
                >
                  <Upload className="w-5 h-5" />
                  Add more images
                </FileInput>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
