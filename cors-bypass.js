/**
 * CORS Bypass Utility
 * This script provides functions to make API calls to your backend
 * while bypassing CORS restrictions using various proxy services.
 */

// Configuration
const API_BASE_URL = 'https://hop-bunny-backend-v2.vercel.app';
const PROXY_SERVICES = [
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url='
];

/**
 * Makes an API request through CORS proxies
 * @param {string} endpoint - The API endpoint (e.g., '/api/login')
 * @param {Object} data - The request payload
 * @param {string} method - HTTP method (default: 'POST')
 * @returns {Promise<Object>} - The API response
 */
async function apiRequest(endpoint, data, method = 'POST') {
    // Try each proxy in sequence until one works
    for (const proxyUrl of PROXY_SERVICES) {
        try {
            const url = proxyUrl + encodeURIComponent(API_BASE_URL + endpoint);
            console.log(`Trying proxy: ${proxyUrl}`);
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            // Parse and return the response
            const responseData = await response.json();
            console.log('API response:', responseData);
            
            return {
                success: response.ok,
                status: response.status,
                data: responseData
            };
        } catch (error) {
            console.error(`Proxy failed: ${error.message}`);
            // Continue to the next proxy
        }
    }
    
    // If all proxies fail
    throw new Error('All CORS proxies failed. Unable to make the request.');
}

/**
 * Login to the API
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Login response
 */
async function login(email, password) {
    return apiRequest('/api/login', { email, password });
}

/**
 * Register a new user
 * @param {string} username - Username
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Registration response
 */
async function register(username, email, password) {
    return apiRequest('/api/register', { username, email, password });
}

/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User profile data
 */
async function getUserProfile(userId) {
    return apiRequest('/api/user-profile?userId=' + userId, {}, 'GET');
}

// Example usage:
/*
// Login example
login("user@example.com", "password123")
    .then(result => {
        if (result.success) {
            console.log("Logged in successfully!", result.data);
        } else {
            console.error("Login failed:", result.data.error);
        }
    })
    .catch(error => {
        console.error("Request failed:", error);
    });

// Register example
register("newuser", "newuser@example.com", "password123")
    .then(result => {
        if (result.success) {
            console.log("Registered successfully!", result.data);
        } else {
            console.error("Registration failed:", result.data.error);
        }
    })
    .catch(error => {
        console.error("Request failed:", error);
    });
*/ 