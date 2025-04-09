// Default API endpoint for testing
module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Return API info
  res.status(200).json({
    name: 'Hop Bunny Game API',
    version: '1.0.0',
    endpoints: [
      { path: '/api/register', method: 'POST', description: 'Register a new user' },
      { path: '/api/login', method: 'POST', description: 'User login' },
      { path: '/api/update-score', method: 'POST', description: 'Update a user\'s high score' },
      { path: '/api/leaderboard', method: 'GET', description: 'Get the global leaderboard' },
      { path: '/api/user-profile', method: 'GET', description: 'Get a user\'s profile data' }
    ],
    status: 'active'
  });
}; 