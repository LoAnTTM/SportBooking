// These functions are no longer needed as cookies are handled by the server

/**
 * Validates the user role in localStorage
 * This is needed to ensure only admin users can access the application
 */
export function validateUserRole(): void {
  if (typeof window !== 'undefined') {
    // Get user from localStorage
    const user = localStorage.getItem('user');

    if (user) {
      try {
        // Parse user to check role
        const userData = JSON.parse(user);
        if (userData.role !== 'admin') {
          // Clear invalid user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Failed to parse user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }
}

/**
 * Clears authentication state from localStorage
 * Cookies are handled by the server
 */
export function clearAuthState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

/**
 * Gets the authentication token from cookies first, then localStorage as fallback
 */
export function getAuthToken(): string | null {
  // Fall back to localStorage
  return localStorage.getItem('token');
}
