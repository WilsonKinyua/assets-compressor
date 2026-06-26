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

    let quality = options.initialQuality;
    let compressed = await encodeImage(imageData, options.fileType, quality);

    // When a size target is set, step quality down over a few passes to fit it.
    if (options.maxSizeMB) {
      const targetSizeBytes = options.maxSizeMB * 1024 * 1024;
      const maxIterations = options.maxIteration || 10;

      for (let i = 1; i < maxIterations && compressed.length > targetSizeBytes; i++) {
        const compressionRatio = targetSizeBytes / compressed.length;
        quality = Math.max(0.1, quality * Math.sqrt(compressionRatio) * 0.9);
        compressed = await encodeImage(imageData, options.fileType, quality);
      }
    }

    // Convert Uint8Array to Blob
    return new Blob([compressed.buffer as ArrayBuffer], { type: options.fileType });
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

