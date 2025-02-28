/**
 * Utility functions for handling API data in static builds
 */

// Check if we're in a static build environment
export const isStaticBuild = process.env.NEXT_OUTPUT === 'export'

/**
 * Fetch data with fallback to static JSON for GitHub Pages
 * @param apiPath The API path to fetch from in development/production
 * @param staticDataPath The path to the static JSON file for GitHub Pages builds
 */
export async function fetchWithStaticFallback<T>(
  apiPath: string,
  staticDataPath: string
): Promise<T> {
  // In static builds, use the static data
  if (isStaticBuild) {
    try {
      // For client-side code during static build
      if (typeof window !== 'undefined') {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
        const response = await fetch(`${basePath}/data/${staticDataPath}`)
        if (!response.ok)
          throw new Error(`Static data fetch failed: ${response.status}`)
        return await response.json()
      }
      // For server-side code during static build
      else {
        // Return empty data structure based on expected type
        return {} as T
      }
    } catch (error) {
      console.error('Error loading static data:', error)
      return {} as T
    }
  }

  // In development/production, use the real API
  try {
    const response = await fetch(`/api/${apiPath}`)
    if (!response.ok) throw new Error(`API request failed: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error(`Error fetching from API: ${apiPath}`, error)
    return {} as T
  }
}
