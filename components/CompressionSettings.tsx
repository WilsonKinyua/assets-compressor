'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Sliders } from 'lucide-react';
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

  const handleMaxIterationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxIteration = parseInt(e.target.value);
    onOptionsChange({ ...options, maxIteration });
  };

  return (
    <div className="glass-strong rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/50 transition-all duration-200 group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary-100 group-hover:bg-primary-200 transition-colors">
            <Sliders className="h-5 w-5 text-primary-700" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Advanced Options</h3>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-xs text-gray-500 mr-2">
              {Math.round(options.initialQuality * 100)}% • {options.maxWidthOrHeight}px • {options.maxSizeMB < 1 ? `${options.maxSizeMB * 1000}KB` : `${options.maxSizeMB}MB`}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
          )}
        </div>
      </button>

      {/* Settings Panel */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 animate-slide-up border-t border-white/30">
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quality Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-800">
                  Quality
                </label>
                <span className="text-sm font-bold text-primary-700">
                  {Math.round(options.initialQuality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={Math.round(options.initialQuality * 100)}
                onChange={handleQualityChange}
                className="w-full h-2 bg-gradient-to-r from-primary-200 to-primary-400 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-primary-700"
              />
              <p className="text-xs text-gray-600">
                Starting quality (auto-adjusts to meet target size)
              </p>
            </div>

            {/* Max Width/Height */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800">
                Max Dimensions (px)
              </label>
              <input
                type="number"
                min="100"
                max="4000"
                step="100"
                value={options.maxWidthOrHeight}
                onChange={handleMaxWidthChange}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 backdrop-blur-sm font-semibold text-gray-900"
              />
              <p className="text-xs text-gray-600">
                Images resized to fit within this dimension
              </p>
            </div>

            {/* Max File Size */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800">
                Target File Size
              </label>
              <select
                value={options.maxSizeMB}
                onChange={handleMaxSizeChange}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 backdrop-blur-sm font-semibold text-gray-900 cursor-pointer"
              >
                <option value="0.05">50 KB (Ultra)</option>
                <option value="0.09">90 KB (Default)</option>
                <option value="0.1">100 KB</option>
                <option value="0.2">200 KB</option>
                <option value="0.3">300 KB</option>
                <option value="0.4">400 KB</option>
                <option value="0.5">500 KB</option>
                <option value="1">1 MB</option>
                <option value="2">2 MB</option>
                <option value="5">5 MB</option>
              </select>
              <p className="text-xs text-gray-600">
                Auto-adjusts quality through iterations
              </p>
            </div>

            {/* Max Iteration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-800">
                  Iterations
                </label>
                <span className="text-sm font-bold text-primary-700">
                  {options.maxIteration || 10}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                value={options.maxIteration || 10}
                onChange={handleMaxIterationChange}
                className="w-full h-2 bg-gradient-to-r from-primary-200 to-primary-400 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-primary-700"
              />
              <p className="text-xs text-gray-600">
                More = better compression (10-15 recommended)
              </p>
            </div>

            {/* Output Format */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800">
                Output Format
              </label>
              <select
                value={options.fileType}
                onChange={handleFormatChange}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 backdrop-blur-sm font-semibold text-gray-900 cursor-pointer"
              >
                <option value="image/webp">WebP (Best for SEO)</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
              </select>
              <p className="text-xs text-gray-600">
                WebP offers best compression ratio
              </p>
            </div>

            {/* Preserve EXIF */}
            <div className="flex items-center space-x-3 p-4 bg-white/30 rounded-xl">
              <input
                type="checkbox"
                id="preserveExif"
                checked={options.preserveExif || false}
                onChange={handlePreserveExifChange}
                className="h-5 w-5 text-primary-600 rounded border-primary-300 focus:ring-2 focus:ring-primary-500 cursor-pointer"
              />
              <label htmlFor="preserveExif" className="text-sm font-medium text-gray-800 cursor-pointer">
                Preserve EXIF metadata
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
