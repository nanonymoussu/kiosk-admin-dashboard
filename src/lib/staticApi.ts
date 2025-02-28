/**
 * Helper for handling API calls in static builds
 * - In development/regular builds: Makes actual API calls
 * - In static builds: Returns mocked data or empty results
 */
export const isStaticBuild = process.env.NEXT_OUTPUT === 'export'

export function getStaticApiUrl(path: string): string {
  if (isStaticBuild) {
    // For static builds, point to JSON files in the /public directory
    return `/api-data${path}.json`
  } else {
    // Normal API calls
    return `/api${path}`
  }
}

export function createStaticApiHandler(mockData: any) {
  return isStaticBuild ? mockData : null
}
