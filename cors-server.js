// Simple Express server to handle POST requests and add CORS headers
// This is a simplified version of server.js that you can run locally

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Simple in-memory storage for demo purposes
const users = [
  // Add a test user that will always be available
  {
    id: '1234567890',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    createdAt: new Date(),
    highScore: 100,
    gamesPlayed: 5
  }
];

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
    console.log(`Current users in system: ${JSON.stringify(users.map(u => u.email))}`);
    
    // First find user by email only
    const userByEmail = users.find(user => user.email === email);
    
    if (!userByEmail) {
      console.log(`Authentication failed: No user found with email "${email}"`);
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }
    
    // Then check password
    if (userByEmail.password !== password) {
      console.log(`Authentication failed: Password incorrect for user "${email}"`);
      console.log(`Attempted password: "${password}", Stored password: "${userByEmail.password}"`);
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }
    
    console.log(`Authentication successful for user: ${userByEmail.username}`);
    
    // Generate a simple token (in a real app, use JWT)
    const token = Buffer.from(`${userByEmail.id}:${Date.now()}`).toString('base64');
    
    return res.status(200).json({
      userId: userByEmail.id,
      username: userByEmail.username,
      highScore: userByEmail.highScore || 0,
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

// User profile endpoint
app.get('/api/user-profile', (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const user = users.find(user => user.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json({
      profile: {
        userId: user.id,
        username: user.username,
        email: user.email,
        highScore: user.highScore,
        gamesPlayed: user.gamesPlayed,
        rank: 1, // Mock rank
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error in user profile endpoint:', error);
    return res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// Users list endpoint
app.get('/api/users', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const username = req.query.username || '';
    
    // Filter users if username provided
    let filteredUsers = users;
    if (username) {
      filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(username.toLowerCase())
      );
    }
    
    // Paginate users
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return res.status(200).json({
      users: paginatedUsers.map(user => ({
        userId: user.id,
        username: user.username,
        email: user.email,
        highScore: user.highScore,
        gamesPlayed: user.gamesPlayed,
        createdAt: user.createdAt
      })),
      pagination: {
        total: filteredUsers.length,
        page,
        limit,
        pages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    console.error('Error in users endpoint:', error);
    return res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/register');
  console.log('  POST /api/login');
  console.log('  GET /api/user-profile?userId=<id>');
  console.log('  GET /api/users');
}); 