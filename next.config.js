/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Strict mode for catching potential issues early
  reactStrictMode: true,
  // Disable x-powered-by header
  poweredByHeader: false,
  // Enable gzip compression
  compress: true,
};

module.exports = nextConfig;
