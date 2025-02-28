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
  // For static export, exclude API routes
  ...(process.env.NEXT_OUTPUT === 'export' && {
    // Don't attempt to build API routes for static export
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'].filter(
      (ext) => !(process.env.NEXT_BUILD_EXCLUDE_API === '1')
    ),
  }),
}

export default nextConfig
