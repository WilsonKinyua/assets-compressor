'use client';

import { Download, Loader2, CheckCircle, XCircle } from 'lucide-react';
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

  const renderStatus = () => {
    switch (image.status) {
      case 'compressing':
        return (
          <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Compressing…
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 text-sm font-medium text-teal-700">
            <CheckCircle className="h-4 w-4" />
            Done
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1.5 text-sm font-medium text-red-600">
            <XCircle className="h-4 w-4" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          {renderStatus()}
          {image.status === 'completed' &&
            (image.savings > 0 ? (
              <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-xs font-semibold">
                {image.savings}% smaller
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-semibold">
                Already optimized
              </span>
            ))}
        </div>

        {image.status === 'completed' && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Original
              </p>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <Image src={image.originalUrl} alt="Original" fill className="object-cover" unoptimized />
              </div>
              <p className="text-xs text-gray-600 mt-1.5">{formatFileSize(image.originalSize)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Compressed
              </p>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <Image src={image.compressedUrl} alt="Compressed" fill className="object-cover" unoptimized />
              </div>
              <p className="text-xs font-medium text-teal-700 mt-1.5">
                {formatFileSize(image.compressedSize)}
              </p>
            </div>
          </div>
        )}

        <p className="text-sm font-medium text-gray-900 truncate" title={image.original.name}>
          {image.original.name}
        </p>

        {image.status === 'completed' && (
          <button
            onClick={handleDownload}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        )}

        {image.status === 'error' && image.error && (
          <p className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {image.error}
          </p>
        )}
      </div>
    </div>
  );
}
