'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { CompressionOptions } from '@/types/image';

interface CompressionSettingsProps {
  options: CompressionOptions;
  onOptionsChange: (options: CompressionOptions) => void;
}

export default function CompressionSettings({
  options,
  onOptionsChange,
}: CompressionSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quality = parseInt(e.target.value) / 100;
    onOptionsChange({ ...options, initialQuality: quality });
  };

  const handleMaxWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxWidth = parseInt(e.target.value);
    onOptionsChange({ ...options, maxWidthOrHeight: maxWidth });
  };

  const handleMaxSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const maxSize = parseFloat(e.target.value);
    onOptionsChange({ ...options, maxSizeMB: maxSize });
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fileType = e.target.value as 'image/webp' | 'image/jpeg' | 'image/png';
    onOptionsChange({ ...options, fileType });
  };

  const handlePreserveExifChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({ ...options, preserveExif: e.target.checked });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 rounded-xl"
      >
        <div className="flex items-center space-x-3">
          <Settings className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Advanced Options</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-600" />
        )}
      </button>

      {/* Settings Panel */}
      {isExpanded && (
        <div className="p-6 pt-0 space-y-6 animate-fade-in">
          {/* Quality Slider */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Quality: {Math.round(options.initialQuality * 100)}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={Math.round(options.initialQuality * 100)}
              onChange={handleQualityChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-xs text-gray-500">
              Higher quality means larger file size
            </p>
          </div>

          {/* Max Width/Height */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Max Width/Height (px)
            </label>
            <input
              type="number"
              min="100"
              max="4000"
              step="100"
              value={options.maxWidthOrHeight}
              onChange={handleMaxWidthChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">
              Images will be resized to fit within this dimension
            </p>
          </div>

          {/* Max File Size */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Target Max File Size
            </label>
            <select
              value={options.maxSizeMB}
              onChange={handleMaxSizeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="0.5">500 KB</option>
              <option value="1">1 MB</option>
              <option value="2">2 MB</option>
              <option value="5">5 MB</option>
            </select>
            <p className="text-xs text-gray-500">
              Compression will attempt to reach this target size
            </p>
          </div>

          {/* Output Format */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Output Format
            </label>
            <select
              value={options.fileType}
              onChange={handleFormatChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="image/webp">WebP (Best for SEO)</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
            </select>
            <p className="text-xs text-gray-500">
              WebP provides the best compression with quality
            </p>
          </div>

          {/* Preserve EXIF */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="preserveExif"
              checked={options.preserveExif || false}
              onChange={handlePreserveExifChange}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="preserveExif" className="text-sm font-medium text-gray-700">
              Preserve EXIF metadata
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
