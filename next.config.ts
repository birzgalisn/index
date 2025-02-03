import type { NextConfig } from 'next';

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    reactCompiler: true,
  },
} satisfies NextConfig;

export default nextConfig;
