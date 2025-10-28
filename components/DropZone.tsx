'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Sparkles } from 'lucide-react';
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
        relative glass-strong rounded-2xl border-2 border-dashed p-16 text-center
        transition-all duration-300 cursor-pointer overflow-hidden group
        ${
          isDragActive
            ? 'border-primary-400 bg-primary-50/50 scale-[1.02] shadow-2xl'
            : 'border-white/30 hover:border-primary-300 hover:shadow-xl'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />

      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative flex flex-col items-center justify-center space-y-6">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div
            className={`
            relative rounded-full p-8 transition-all duration-300
            ${isDragActive ? 'bg-primary-100 scale-110' : 'bg-primary-50 group-hover:bg-primary-100'}
          `}
          >
            {isDragActive ? (
              <Upload className="h-16 w-16 text-primary-600 animate-bounce" />
            ) : (
              <Sparkles className="h-16 w-16 text-primary-600 group-hover:animate-bounce-subtle" />
            )}
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            {isDragActive ? '✨ Drop your images here' : 'Drop images or click to upload'}
          </h3>
          <p className="text-base text-gray-600">
            Drag & drop anywhere on the page or click to browse
          </p>
        </div>

        {/* Info badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-primary-200/50">
            <span className="text-xs font-medium text-gray-700">JPEG, PNG, WebP, GIF, BMP</span>
          </div>
          <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-primary-200/50">
            <span className="text-xs font-medium text-gray-700">Max {MAX_FILE_SIZE_MB}MB per file</span>
          </div>
        </div>
      </div>

      {/* Active state overlay */}
      {isDragActive && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-700/10 pointer-events-none animate-fade-in" />
      )}
    </div>
  );
}
