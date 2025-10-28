'use client';

import { useState } from 'react';
import { Download, Loader2, Package } from 'lucide-react';
import { CompressedImage } from '@/types/image';
import { downloadAllAsZip } from '@/lib/fileUtils';

interface DownloadButtonProps {
  images: CompressedImage[];
}

export default function DownloadButton({ images }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const completedImages = images.filter((img) => img.status === 'completed');
  const hasCompletedImages = completedImages.length > 0;

  const handleDownloadAll = async () => {
    if (!hasCompletedImages) return;

    setIsDownloading(true);
    try {
      await downloadAllAsZip(images);
    } catch (error) {
      console.error('Error downloading images:', error);
      alert('Failed to download images. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!hasCompletedImages) {
    return null;
  }

  return (
    <button
      onClick={handleDownloadAll}
      disabled={isDownloading}
      className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold transform hover:scale-105"
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Preparing ZIP...</span>
        </>
      ) : (
        <>
          <Package className="h-5 w-5 group-hover:animate-bounce-subtle" />
          <span>Download All ({completedImages.length})</span>
        </>
      )}
    </button>
  );
}
