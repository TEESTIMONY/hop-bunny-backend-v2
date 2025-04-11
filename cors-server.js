// Simple Express server with explicit CORS headers for all responses
// This completely disables CORS restrictions

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to manually add CORS headers to all responses
app.use((req, res, next) => {
  // Allow requests from any origin
  res.header('Access-Control-Allow-Origin', '*');
  
  // Allow all HTTP methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Allow all headers that might be sent by the client
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Allow credentials
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

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
  console.log(`API server with CORS disabled running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/register');
  console.log('  POST /api/login');
}); 