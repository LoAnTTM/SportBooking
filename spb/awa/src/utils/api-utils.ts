/**
 * Fetches data from an API endpoint with fallback to mock data
 * @param url The API endpoint URL
 * @param mockData The mock data to use as fallback
 * @returns The API response data or mock data if the API call fails
 */
export async function fetchWithFallback<T>(url: string, mockData: T): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`API call to ${url} failed with status ${response.status}, using mock data`);
      return mockData;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return mockData;
  }
}
