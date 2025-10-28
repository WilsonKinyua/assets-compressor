'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_MB } from '@/types/image';
import { validateFileType, validateFileSize } from '@/lib/fileUtils';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export default function DropZone({ onFilesSelected, disabled }: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        if (!validateFileType(file)) {
          alert(`${file.name} is not a supported image format`);
          return false;
        }
        if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
          alert(`${file.name} exceeds the maximum file size of ${MAX_FILE_SIZE_MB}MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    multiple: true,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative rounded-xl border-2 border-dashed p-12 text-center
        transition-all duration-300 cursor-pointer
        ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={`
          rounded-full p-6 transition-all duration-300
          ${isDragActive ? 'bg-blue-100 scale-110' : 'bg-gray-100'}
        `}
        >
          {isDragActive ? (
            <Upload className="h-12 w-12 text-blue-600 animate-bounce" />
          ) : (
            <ImageIcon className="h-12 w-12 text-gray-600" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {isDragActive ? 'Drop your images here' : 'Drag & drop images here'}
          </h3>
          <p className="text-sm text-gray-600">
            or click to browse your files
          </p>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>Supported formats: JPEG, PNG, WebP, GIF, BMP</p>
          <p>Maximum file size: {MAX_FILE_SIZE_MB}MB per file</p>
        </div>
      </div>

      {isDragActive && (
        <div className="absolute inset-0 rounded-xl bg-blue-500 bg-opacity-10 pointer-events-none" />
      )}
    </div>
  );
}
