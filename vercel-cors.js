/**
 * CORS configuration for Vercel API
 * This module exports a configured CORS middleware that allows requests 
 * from specified origins. Import and use this in your API routes.
 */
const cors = require('cors');

// Define allowed origins - add your frontend URLs here
const allowedOrigins = [
  // Local development
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:3000',
  
  // Add your production frontend URLs here
  // 'https://your-frontend-domain.com',
  // 'https://www.your-frontend-domain.com',
  
  // For testing from any origin during development (remove in production)
  '*'
];

// Configure CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // For development, allowing all origins with '*'
    if (allowedOrigins.includes('*')) return callback(null, true);
    
    // Check if the origin is in our allowlist
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  maxAge: 86400 // Cache preflight response for 24 hours
};

// Create middleware
const corsMiddleware = cors(corsOptions);

// Export the middleware for use in API routes
module.exports = corsMiddleware;

// Example usage in your API file:
/*
const express = require('express');
const corsMiddleware = require('./vercel-cors');
const app = express();

// Apply CORS middleware to all routes
app.use(corsMiddleware);

// Or apply to specific routes
app.options('/api/login', corsMiddleware);
app.post('/api/login', corsMiddleware, (req, res) => {
  // Your login logic here
});
*/ 