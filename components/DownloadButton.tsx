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
      className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white font-medium rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Preparing ZIP...</span>
        </>
      ) : (
        <>
          <Package className="h-5 w-5" />
          <span>Download All ({completedImages.length})</span>
        </>
      )}
    </button>
  );
}
