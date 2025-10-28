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
  preserveExif?: boolean;
}

export const DEFAULT_COMPRESSION_OPTIONS: CompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp',
  initialQuality: 0.85,
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
