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
  // Optional size target. When set, quality is reduced over several passes to
  // fit within it. When omitted, the image is encoded once at `initialQuality`.
  maxSizeMB?: number;
  maxWidthOrHeight: number;
  fileType: 'image/webp' | 'image/jpeg' | 'image/png';
  initialQuality: number;
  maxIteration?: number;
  preserveExif?: boolean;
}

export const DEFAULT_COMPRESSION_OPTIONS: CompressionOptions = {
  maxWidthOrHeight: 1920, // Full HD - preserves detail
  fileType: 'image/webp', // Best compression with jSquash WebP encoder
  initialQuality: 0.8, // Balanced default; the slider moves this directly
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
