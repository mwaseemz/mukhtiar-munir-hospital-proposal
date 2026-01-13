/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Skip static page generation errors for dynamic pages
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
