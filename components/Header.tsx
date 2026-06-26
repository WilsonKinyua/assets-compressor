'use client';

import { ImageIcon } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-teal-700 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Image Compressor
              </h1>
              <p className="text-xs text-gray-500">Compress images in your browser</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
