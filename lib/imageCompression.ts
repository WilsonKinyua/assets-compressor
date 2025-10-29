import { encode as encodeJPEG } from '@jsquash/jpeg';
import { encode as encodeWebP } from '@jsquash/webp';
import { encode as encodePNG } from '@jsquash/png';
import { CompressionOptions } from '@/types/image';

interface ImageDimensions {
  width: number;
  height: number;
}

function calculateNewDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidthOrHeight: number
): ImageDimensions {
  const aspectRatio = originalWidth / originalHeight;

  if (originalWidth > originalHeight) {
    if (originalWidth > maxWidthOrHeight) {
      return {
        width: maxWidthOrHeight,
        height: Math.round(maxWidthOrHeight / aspectRatio),
      };
    }
  } else {
    if (originalHeight > maxWidthOrHeight) {
      return {
        width: Math.round(maxWidthOrHeight * aspectRatio),
        height: maxWidthOrHeight,
      };
    }
  }

  return { width: originalWidth, height: originalHeight };
}

async function loadImageData(
  file: File,
  targetWidth?: number,
  targetHeight?: number
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');

      // Use target dimensions if provided, otherwise use original
      canvas.width = targetWidth || img.width;
      canvas.height = targetHeight || img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Use high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(imageData);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

async function encodeImage(
  imageData: ImageData,
  fileType: 'image/webp' | 'image/jpeg' | 'image/png',
  quality: number
): Promise<Uint8Array> {
  // jSquash quality is 0-100 (we convert from 0-1 to 0-100)
  const qualityPercent = Math.round(quality * 100);

  let result: ArrayBuffer;

  switch (fileType) {
    case 'image/webp':
      result = await encodeWebP(imageData, { quality: qualityPercent });
      break;
    case 'image/jpeg':
      result = await encodeJPEG(imageData, { quality: qualityPercent });
      break;
    case 'image/png':
      // PNG doesn't use quality parameter (lossless)
      result = await encodePNG(imageData);
      break;
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }

  // Convert ArrayBuffer to Uint8Array
  return new Uint8Array(result);
}

export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<Blob> {
  try {
    // First load the image to get original dimensions
    const tempImageData = await loadImageData(file);

    // Calculate target dimensions
    const newDimensions = calculateNewDimensions(
      tempImageData.width,
      tempImageData.height,
      options.maxWidthOrHeight
    );

    // Load image with target dimensions (canvas will handle resizing)
    const imageData = await loadImageData(
      file,
      newDimensions.width,
      newDimensions.height
    );

    // Target size in bytes
    const targetSizeBytes = options.maxSizeMB * 1024 * 1024;
    const maxIterations = options.maxIteration || 10;
    let quality = options.initialQuality;
    let compressed: Uint8Array | null = null;

    // Iteratively compress to hit target size
    for (let i = 0; i < maxIterations; i++) {
      compressed = await encodeImage(imageData, options.fileType, quality);

      // Check if we've hit the target
      if (compressed.length <= targetSizeBytes) {
        break;
      }

      // If we're on the last iteration, use this result anyway
      if (i === maxIterations - 1) {
        break;
      }

      // Reduce quality for next iteration (more conservative reduction)
      // This is gentler than browser-image-compression's approach
      const compressionRatio = targetSizeBytes / compressed.length;
      quality = Math.max(0.1, quality * Math.sqrt(compressionRatio) * 0.9);
    }

    if (!compressed) {
      throw new Error('Failed to compress image');
    }

    // Convert Uint8Array to Blob
    return new Blob([compressed.buffer as ArrayBuffer], { type: options.fileType });
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
