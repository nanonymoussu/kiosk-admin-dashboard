/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // Enable static export for GitHub Pages
  output: process.env.NEXT_OUTPUT === 'export' ? 'export' : undefined,
  // Configure the base path for GitHub Pages
  basePath: process.env.NEXT_BASE_PATH || '',
  // When doing static export, don't try to build API routes
  ...(process.env.NEXT_OUTPUT === 'export' && {
    // This disables App Router features that require a server
    experimental: {
      appDir: false,
    },
  }),
}

export default nextConfig
