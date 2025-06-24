import axios from "axios"

// Get API URL from environment variables, fallback to localhost for development
// Force production URL if we're on a deployed domain
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
const API_URL = isProduction
    ? "https://url-shortner-xgdk.vercel.app"
    : (import.meta.env.VITE_API_URL || "http://localhost:3000")

// Log the API URL for debugging (remove in production)
console.log("🔗 API URL:", API_URL)
console.log("🌍 Environment:", import.meta.env.MODE)
console.log("🔧 All env vars:", import.meta.env)

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout:10000, //10s
    withCredentials:true
})

// Request interceptor to add auth token and log requests
axiosInstance.interceptors.request.use(
    (config) => {
        // Add token from localStorage to Authorization header
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
            console.log("🔑 Added token to request")
        }

        console.log(`🚀 Making ${config.method?.toUpperCase()} request to:`, config.baseURL + config.url)
        console.log("📝 Request config:", {
            url: config.url,
            method: config.method,
            baseURL: config.baseURL,
            withCredentials: config.withCredentials,
            hasToken: !!token
        })
        return config
    },
    (error) => {
        console.error("❌ Request error:", error)
        return Promise.reject(error)
    }
)

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Any status code within the range of 2xx
        return response;
    },
    (error) => {
        // Handle different types of errors
        if (error.response) {
            // The server responded with a status code outside the 2xx range
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    console.error("Bad Request:", data);
                    break;
                case 401:
                    console.error("Unauthorized:", data);
                    // You could redirect to login page or refresh token here
                    break;
                case 403:
                    console.error("Forbidden:", data);
                    break;
                case 404:
                    console.error("Not Found:", data);
                    break;
                case 500:
                    console.error("Server Error:", data);
                    break;
                default:
                    console.error(`Error (${status}):`, data);
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Network Error: No response received", error.request);
        } else {
            // Something happened in setting up the request
            console.error("Error:", error.message);
        }

        // You can customize the error object before rejecting
        return Promise.reject({
            // isAxiosError: true,
            message: error.response?.data?.message || error.message || "Unknown error occurred",
            status: error.response?.status,
            data: error.response?.data,
            // originalError: error
        });
    }
);
export default axiosInstance