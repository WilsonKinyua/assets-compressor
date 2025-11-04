'use client';

import { ImageIcon } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Blaz<span className="text-teal-500">Tools</span>
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Image Compressor</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-2">
            <button className="px-4 py-2 bg-teal-400 text-white font-medium rounded-lg hover:bg-teal-500 transition-colors">
              Image Compressor
            </button>
            <button className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">
              Image Cropper
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
