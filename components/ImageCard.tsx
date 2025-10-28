'use client';

import { Download, Loader2, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { CompressedImage } from '@/types/image';
import { formatFileSize, getSavingsColor, getSavingsBgColor } from '@/lib/imageCompression';
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

  const renderStatus = () => {
    switch (image.status) {
      case 'compressing':
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Compressing...</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Error</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 animate-slide-up">
      <div className="p-6">
        {/* Status Badge */}
        <div className="mb-4">{renderStatus()}</div>

        {/* Image Previews */}
        {image.status === 'completed' && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Original Preview */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase">Original</p>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={image.originalUrl}
                  alt="Original"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* Compressed Preview */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase">Compressed</p>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={image.compressedUrl}
                  alt="Compressed"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        )}

        {/* File Info */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-900 truncate" title={image.original.name}>
              {image.original.name}
            </p>
          </div>

          {image.status === 'completed' && (
            <>
              {/* Size Info */}
              <div className="flex justify-between items-center text-sm">
                <div className="space-y-1">
                  <p className="text-gray-600">
                    Original: <span className="font-semibold">{formatFileSize(image.originalSize)}</span>
                  </p>
                  <p className="text-gray-600">
                    Compressed: <span className="font-semibold">{formatFileSize(image.compressedSize)}</span>
                  </p>
                </div>
              </div>

              {/* Savings Badge */}
              <div className="flex items-center justify-between">
                <div
                  className={`
                    inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold
                    ${getSavingsBgColor(image.savings)} ${getSavingsColor(image.savings)}
                  `}
                >
                  {image.savings}% smaller
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </>
          )}

          {/* Error Message */}
          {image.status === 'error' && image.error && (
            <p className="text-sm text-red-600">{image.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
