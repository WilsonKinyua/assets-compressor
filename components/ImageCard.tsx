'use client';

import { Download, Loader2, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { CompressedImage } from '@/types/image';
import { formatFileSize } from '@/lib/imageCompression';
import { downloadSingleImage, generateCompressedFilename } from '@/lib/fileUtils';

interface ImageCardProps {
  image: CompressedImage;
}

export default function ImageCard({ image }: ImageCardProps) {
  const handleDownload = async () => {
    if (image.compressed) {
      const filename = generateCompressedFilename(image.original.name, 'image/webp');
      await downloadSingleImage(image.compressed, filename);
    }
  };

  const getSavingsStyle = (savings: number) => {
    if (savings >= 70) return 'from-green-500 to-emerald-600 text-white';
    if (savings >= 50) return 'from-blue-500 to-indigo-600 text-white';
    if (savings >= 30) return 'from-purple-500 to-pink-600 text-white';
    return 'from-gray-400 to-gray-500 text-white';
  };

  const renderStatus = () => {
    switch (image.status) {
      case 'compressing':
        return (
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Loader2 className="h-4 w-4 text-primary-600 animate-spin" />
            </div>
            <span className="text-sm font-semibold text-gray-800">Compressing...</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-gray-800">Completed</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
            <span className="text-sm font-semibold text-gray-800">Error</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-strong rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group animate-scale-in">
      <div className="p-5">
        {/* Status Badge */}
        <div className="mb-4">{renderStatus()}</div>

        {/* Image Previews */}
        {image.status === 'completed' && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Original Preview */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Original</p>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ring-2 ring-gray-200">
                <Image
                  src={image.originalUrl}
                  alt="Original"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <p className="text-xs font-semibold text-gray-600">
                {formatFileSize(image.originalSize)}
              </p>
            </div>

            {/* Compressed Preview */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-primary-700 uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Compressed
              </p>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 ring-2 ring-primary-300">
                <Image
                  src={image.compressedUrl}
                  alt="Compressed"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <p className="text-xs font-semibold text-primary-700">
                {formatFileSize(image.compressedSize)}
              </p>
            </div>
          </div>
        )}

        {/* File Info */}
        <div className="space-y-3">
          <div className="px-3 py-2 bg-white/40 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 truncate" title={image.original.name}>
              {image.original.name}
            </p>
          </div>

          {image.status === 'completed' && (
            <>
              {/* Savings Badge & Download */}
              <div className="flex items-center justify-between gap-3">
                <div className={`
                  flex-1 px-4 py-2.5 rounded-xl font-bold text-sm
                  bg-gradient-to-r ${getSavingsStyle(image.savings)}
                  shadow-lg transform group-hover:scale-105 transition-transform
                `}>
                  <div className="flex items-center justify-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    <span>{image.savings}% saved</span>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </>
          )}

          {/* Error Message */}
          {image.status === 'error' && image.error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700 font-medium">{image.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
