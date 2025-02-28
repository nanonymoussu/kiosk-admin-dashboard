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
  // Disable server components when doing static export
  ...(process.env.NEXT_OUTPUT === 'export'
    ? {
        appDir: false,
      }
    : {}),
}

export default nextConfig
