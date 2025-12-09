import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Image optimization with restricted sources for security
  images: {
    remotePatterns: [
      // Featured images
      {
        protocol: 'https',
        hostname: 'images.nationalgeographic.org',
      },
      {
        protocol: 'https',
        hostname: 'www.artificialintelligence-news.com',
      },
      {
        protocol: 'https',
        hostname: 'www.aljazeera.com',
      },
      {
        protocol: 'https',
        hostname: 'th-i.thgim.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      // News APIs
      {
        protocol: 'https',
        hostname: '*.newsapi.org',
      },
      // Major news sources (consolidated)
      {
        protocol: 'https',
        hostname: '*.apnews.com',
      },
      {
        protocol: 'https',
        hostname: 'dims.apnews.com',
      },
      {
        protocol: 'https',
        hostname: '*.cnn.com',
      },
      {
        protocol: 'https',
        hostname: '*.bbc.co.uk',
      },
      {
        protocol: 'https',
        hostname: '*.bbc.com',
      },
      {
        protocol: 'https',
        hostname: '*.reuters.com',
      },
      {
        protocol: 'https',
        hostname: '*.nytimes.com',
      },
      {
        protocol: 'https',
        hostname: '*.washingtonpost.com',
      },
      {
        protocol: 'https',
        hostname: '*.theguardian.com',
      },
      {
        protocol: 'https',
        hostname: '*.nbcnews.com',
      },
      {
        protocol: 'https',
        hostname: '*.cbsnews.com',
      },
      {
        protocol: 'https',
        hostname: '*.abcnews.go.com',
      },
      {
        protocol: 'https',
        hostname: '*.usatoday.com',
      },
      {
        protocol: 'https',
        hostname: '*.npr.org',
      },
      // Business & Finance
      {
        protocol: 'https',
        hostname: '*.bloomberg.com',
      },
      {
        protocol: 'https',
        hostname: '*.cnbc.com',
      },
      {
        protocol: 'https',
        hostname: '*.forbes.com',
      },
      // Tech news
      {
        protocol: 'https',
        hostname: '*.techcrunch.com',
      },
      {
        protocol: 'https',
        hostname: '*.theverge.com',
      },
      {
        protocol: 'https',
        hostname: '*.wired.com',
      },
      // Sports
      {
        protocol: 'https',
        hostname: '*.espn.com',
      },
      // CDNs (consolidated with wildcards)
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.imgix.net',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '*.zenfs.com',
      },
      {
        protocol: 'https',
        hostname: '*.akamaized.net',
      },
      {
        protocol: 'https',
        hostname: '*.fastly.net',
      },
      {
        protocol: 'https',
        hostname: '*.wp.com',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.twimg.com',
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true, // Needed for our fallback images
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Package optimizations
  experimental: {
    optimizePackageImports: [
      '@fortawesome/react-fontawesome',
      'react-icons',
      'date-fns',
    ],
  },
  
  // Enable static optimization
  output: 'standalone',
  
  // Production optimizations
  compress: true,
  poweredByHeader: false, // Hide X-Powered-By header
  
  // Security and Cache headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security Headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://newsapi.org https://newsdata.io",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          // Cache Control
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
