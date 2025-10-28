import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free Image Compressor - Optimize Images for SEO | WebP, JPEG, PNG',
  description:
    'Compress JPEG, PNG, and WebP images without losing quality. Free online image compression tool perfect for web developers and SEO optimization. Reduce file sizes by up to 80%.',
  keywords: [
    'image compressor',
    'compress images',
    'optimize images',
    'webp converter',
    'image optimization',
    'SEO images',
    'reduce image size',
    'image converter',
    'free image compressor',
  ],
  authors: [{ name: 'Image Compressor' }],
  creator: 'Image Compressor',
  publisher: 'Image Compressor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Free Image Compressor - Optimize Images for SEO',
    description:
      'Compress JPEG, PNG, and WebP images without losing quality. Perfect for web developers and SEO optimization.',
    url: 'https://imagecompressor.com',
    siteName: 'Image Compressor',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Compressor - Optimize Images for SEO',
    description:
      'Compress JPEG, PNG, and WebP images without losing quality. Perfect for web developers and SEO optimization.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
