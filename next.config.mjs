/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow external domains for images
    domains: [
      'cdnwpedutorenews.gramedia.net',
      'images.weserv.nl', // Proxy service
      'img.youtube.com',
      'i.ytimg.com',
      // Add more domains as needed
    ],
    // Alternative: allow all external domains (less secure)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Additional headers for CORS
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
