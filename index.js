// Simple Express server for local development
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import API handlers
const rootHandler = require('./api/index');
const leaderboardHandler = require('./api/leaderboard');
const userProfileHandler = require('./api/user-profile');
const loginHandler = require('./api/login');
const registerHandler = require('./api/register');
const updateScoreHandler = require('./api/update-score');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.all('/api', (req, res) => rootHandler(req, res));
app.all('/api/leaderboard', (req, res) => leaderboardHandler(req, res));
app.all('/api/user-profile', (req, res) => userProfileHandler(req, res));
app.all('/api/login', (req, res) => loginHandler(req, res));
app.all('/api/register', (req, res) => registerHandler(req, res));
app.all('/api/update-score', (req, res) => updateScoreHandler(req, res));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 