// Base URL configuration for API calls across environments.
// When deployed with Vercel Services (or in production), the frontend and backend share
// the same domain, so API calls default to relative paths ("/api/...").
// In local development outside Vercel, it falls back to "http://localhost:5000".
const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL !== undefined) {
    return process.env.REACT_APP_API_URL;
  }
  return process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;

