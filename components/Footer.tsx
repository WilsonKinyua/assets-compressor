'use client';

import { Lock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <Lock className="w-4 h-4 text-teal-700" />
          Images are processed in your browser and never uploaded.
        </p>
        <p className="text-sm text-gray-500">© {currentYear} Image Compressor</p>
      </div>
    </footer>
  );
}
