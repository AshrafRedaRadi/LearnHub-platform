import axios from "axios";
import { getToken } from "./auth";

// 1. Create an Axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Add a Request Interceptor
// This interceptor will run before every request is sent out
api.interceptors.request.use(
  (config) => {
    // Check if we are running in the browser (client-side) to access localStorage safely
    if (typeof window !== "undefined") {
      const token = getToken(); // Retrieve the JWT token
      
      // If a token exists, attach it to the Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Handle request errors (e.g., network issues before reaching the server)
    console.error("🚀 API Request Error:", error);
    return Promise.reject(error);
  }
);

// 3. Add a Response Interceptor
// This interceptor will run when a response is received from the server
api.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    // Return the response data directly for convenience
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    
    // Global Error Handling & Logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      
      // Optional: Handle common global errors here
      // For example, redirecting to login on 401 Unauthorized
      if (error.response.status === 401) {
        // We can add global redirect logic here if needed
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("🚀 API Network Error: No response received from server.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("🚀 API Configuration Error:", error.message);
    }
    
    // Reject the promise to pass the error down to the caller component
    return Promise.reject(error);
  }
);

export default api;
