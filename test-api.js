// Simple script to test API endpoints locally
const fetch = require('node-fetch');
require('dotenv').config();

// Use deployed URL by default, or override with environment variable
const API_BASE_URL = process.env.API_URL || 'https://hop-bunny-backend-v2.vercel.app/api';
console.log(`Testing API at: ${API_BASE_URL}`);

// Test function to make API requests
async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');

    // Test root endpoint
    console.log('1. Testing root endpoint:');
    const rootResponse = await fetch(`${API_BASE_URL}`);
    const rootData = await rootResponse.json();
    console.log('Status:', rootResponse.status);
    console.log('Response:', JSON.stringify(rootData, null, 2));
    console.log('-----------------------------\n');

    // Test register endpoint (will only work if this user doesn't exist)
    // Uncomment to test registration
    /*
    console.log('2. Testing register endpoint:');
    const registerResponse = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        username: 'TestUser'
      }),
    });
    const registerData = await registerResponse.json();
    console.log('Status:', registerResponse.status);
    console.log('Response:', JSON.stringify(registerData, null, 2));
    console.log('-----------------------------\n');
    */

    // Test leaderboard endpoint
    console.log('3. Testing leaderboard endpoint:');
    try {
      const leaderboardResponse = await fetch(`${API_BASE_URL}/leaderboard?limit=5`);
      console.log('Status:', leaderboardResponse.status);
      
      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json();
        console.log('Response:', JSON.stringify(leaderboardData, null, 2));
      } else {
        console.log('Error response:', await leaderboardResponse.text());
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error.message);
    }
    console.log('-----------------------------\n');

    console.log('API tests completed.');
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run tests
testAPI(); 