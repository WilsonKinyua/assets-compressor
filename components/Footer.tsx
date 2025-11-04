'use client';

import { ImageIcon, Link2, Share2, Circle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">About BlazTools</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              BlazTools offering Powerful, Fast and Efficient Image Compressor to Optimize and
              Reduce image file sizes without losing quality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-bold text-gray-900">Quick Links</h3>
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-teal-500 transition-colors">
                  Image Compressor
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-teal-500 transition-colors">
                  Image Cropper
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-teal-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-teal-500 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Share with Friends */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-bold text-gray-900">Share with friends</h3>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center hover:bg-teal-200 transition-colors text-teal-600 font-semibold text-xs"
                aria-label="Share on Facebook"
                title="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center hover:bg-teal-200 transition-colors text-teal-600 font-semibold text-xs"
                aria-label="Share on Twitter"
                title="Twitter"
              >
                𝕏
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center hover:bg-teal-200 transition-colors text-teal-600 font-semibold text-xs"
                aria-label="Share on LinkedIn"
                title="LinkedIn"
              >
                in
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center hover:bg-teal-200 transition-colors text-teal-600 font-semibold text-xs"
                aria-label="Share on Pinterest"
                title="Pinterest"
              >
                P
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center hover:bg-teal-200 transition-colors text-teal-600 font-semibold text-xs"
                aria-label="Share on WhatsApp"
                title="WhatsApp"
              >
                W
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Copyright © {currentYear} BlazTools. v3.1
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-600 hover:text-teal-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-teal-500 transition-colors">
              Terms and Conditions
            </a>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-500 transition-colors">
              <span>🇺🇸</span>
              <span>English</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
