export interface CompressedImage {
  id: string;
  original: File;
  compressed: Blob | null;
  originalSize: number;
  compressedSize: number;
  savings: number;
  originalUrl: string;
  compressedUrl: string;
  status: 'pending' | 'compressing' | 'completed' | 'error';
  error?: string;
}

export interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  fileType: 'image/webp' | 'image/jpeg' | 'image/png';
  initialQuality: number;
  maxIteration?: number;
  preserveExif?: boolean;
}

export const DEFAULT_COMPRESSION_OPTIONS: CompressionOptions = {
  maxSizeMB: 0.09, // Target 90KB (below 100KB)
  maxWidthOrHeight: 1200, // Reduced from 1920 for better compression
  useWebWorker: true,
  fileType: 'image/webp', // Best compression ratio
  initialQuality: 1.0, // Start at 100% quality
  maxIteration: 15, // More iterations for aggressive compression
  preserveExif: false,
};

export const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
  'image/bmp': ['.bmp'],
};

export const MAX_FILE_SIZE_MB = 10;
