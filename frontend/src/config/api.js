// API Configuration
const getApiUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:5001/';
};

export const API_URL = getApiUrl();

// Helper function to create full API endpoint
export const apiEndpoint = (path) => {
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const endpoint = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${endpoint}`;
};

// Export for debugging
console.log('API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_URL,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
});

export default { API_URL, apiEndpoint };
