import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { CompressedImage } from '@/types/image';

export function validateFileType(file: File): boolean {
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
  return acceptedTypes.includes(file.type);
}

export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

export function getFileExtension(fileType: string): string {
  const extensions: Record<string, string> = {
    'image/webp': '.webp',
    'image/jpeg': '.jpg',
    'image/png': '.png',
  };
  return extensions[fileType] || '.webp';
}

export function generateCompressedFilename(originalName: string, fileType: string): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const extension = getFileExtension(fileType);
  return `compressed-${nameWithoutExt}${extension}`;
}

export async function downloadSingleImage(blob: Blob, filename: string): Promise<void> {
  saveAs(blob, filename);
}

export async function downloadAllAsZip(images: CompressedImage[]): Promise<void> {
  const zip = new JSZip();

  const completedImages = images.filter(img => img.status === 'completed' && img.compressed);

  if (completedImages.length === 0) {
    throw new Error('No compressed images to download');
  }

  for (const image of completedImages) {
    if (image.compressed) {
      const filename = generateCompressedFilename(
        image.original.name,
        'image/webp'
      );
      zip.file(filename, image.compressed);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `compressed-images-${Date.now()}.zip`);
}

export function createPreviewUrl(file: File | Blob): string {
  return URL.createObjectURL(file);
}

export function revokePreviewUrl(url: string): void {
  if (url) {
    URL.revokeObjectURL(url);
  }
}
