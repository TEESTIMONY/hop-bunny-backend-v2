// Simple Express server with explicit CORS headers for all responses
// This allows requests only from specified origins

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS with specific allowed origins
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000','https://hop-bunny.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(bodyParser.json());

// Simple in-memory storage for demo purposes
const users = [];

// Create a simplified version of the register endpoint
app.post('/api/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('Registration request received:', { username, email });
    
    // Simple validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        message: 'Username, email, and password are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists', 
        message: 'A user with this email already exists' 
      });
    }
    
    // Create new user (in a real app, you would hash the password)
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // NOTE: Never store plain text passwords in a real app!
      createdAt: new Date(),
      highScore: 0,
      gamesPlayed: 0
    };
    
    // Store user
    users.push(newUser);
    
    // Return success
    return res.status(201).json({
      message: 'User registered successfully',
      userId: newUser.id
    });
  } catch (error) {
    console.error('Error in register endpoint:', error);
    return res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// Simple login endpoint
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login request received:', { email });
    
    // Find user
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }
    
    // Generate a simple token (in a real app, use JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    
    return res.status(200).json({
      userId: user.id,
      username: user.username,
      token
    });
  } catch (error) {
    console.error('Error in login endpoint:', error);
    return res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log('CORS is configured to allow requests from:');
  console.log('- http://127.0.0.1:5500');
  console.log('- http://localhost:5500');
  console.log('- http://localhost:3000');
  console.log('\nAvailable endpoints:');
  console.log('  POST /api/register');
  console.log('  POST /api/login');
}); 