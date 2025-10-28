import imageCompression from 'browser-image-compression';
import { CompressionOptions } from '@/types/image';

export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<Blob> {
  const compressionOptions = {
    maxSizeMB: options.maxSizeMB,
    maxWidthOrHeight: options.maxWidthOrHeight,
    useWebWorker: options.useWebWorker,
    fileType: options.fileType,
    initialQuality: options.initialQuality,
    maxIteration: options.maxIteration || 10,
  };

  try {
    const compressedFile = await imageCompression(file, compressionOptions);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function calculateSavings(originalSize: number, compressedSize: number): number {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

export function getSavingsColor(savings: number): string {
  if (savings >= 50) return 'text-green-600';
  if (savings >= 30) return 'text-blue-600';
  return 'text-gray-600';
}

export function getSavingsBgColor(savings: number): string {
  if (savings >= 50) return 'bg-green-100';
  if (savings >= 30) return 'bg-blue-100';
  return 'bg-gray-100';
}

export function createObjectURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeObjectURL(url: string): void {
  URL.revokeObjectURL(url);
}
