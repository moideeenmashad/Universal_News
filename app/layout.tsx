import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import '@/styles/font.scss';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Universal News - Latest News from Around the World',
    template: '%s | Universal News',
  },
  description: 'Stay updated with the latest news from business, technology, sports, entertainment, health, science, and more.',
  keywords: ['news', 'latest news', 'world news', 'breaking news', 'current events'],
  authors: [{ name: 'Universal News' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Universal News',
    title: 'Universal News - Latest News from Around the World',
    description: 'Stay updated with the latest news from around the world',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="lenis lenis-smooth">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

