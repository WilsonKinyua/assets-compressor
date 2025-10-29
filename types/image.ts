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
  fileType: 'image/webp' | 'image/jpeg' | 'image/png';
  initialQuality: number;
  maxIteration?: number;
  preserveExif?: boolean;
}

export const DEFAULT_COMPRESSION_OPTIONS: CompressionOptions = {
  maxSizeMB: 0.1, // Target 100KB - balanced quality and size
  maxWidthOrHeight: 1920, // Full HD - preserves detail
  fileType: 'image/webp', // Best compression with jSquash WebP encoder
  initialQuality: 0.95, // 95% quality - jSquash MozJPEG preserves quality better
  maxIteration: 10, // Conservative iterations with professional codecs
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
