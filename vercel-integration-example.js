// Example of how to implement CORS in a Vercel serverless function or API route

// For Express-based API
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// CORS Configuration - Add your frontend URLs here
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());

// API routes...
app.post('/api/login', (req, res) => {
  // Your login logic
});

// Export for Vercel
module.exports = app;

// ---------------------------------------
// Alternatively, for Next.js API Routes:
// ---------------------------------------

/*
// pages/api/login.js
import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'],
  methods: ['POST', 'OPTIONS'],
  credentials: true,
});

// Helper function to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run the CORS middleware
  await runMiddleware(req, res, cors);

  // Only allow POST for the actual login
  if (req.method === 'POST') {
    try {
      // Your login logic here
      const { email, password } = req.body;
      
      // Example response
      res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
*/ 