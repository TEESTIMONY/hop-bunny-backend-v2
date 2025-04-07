// Script to test the user-profile endpoint
const fetch = require('node-fetch');
require('dotenv').config();

// Use deployed URL or override with environment variable
const API_URL = process.env.API_URL || 'https://hop-bunny-backend-v2.vercel.app/api';

async function testUserProfile() {
  try {
    console.log('Testing user-profile endpoint...');
    
    // Get userId from command line
    const userId = process.argv[2];
    
    if (!userId) {
      console.error('Error: User ID is required');
      console.log('Usage: node test-user-profile.js <userId>');
      console.log('Example: node test-user-profile.js abc123');
      return;
    }
    
    console.log(`Fetching profile for user ID: ${userId}`);
    
    const response = await fetch(`${API_URL}/user-profile?userId=${userId}`);
    
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        console.log('Error details:', errorJson);
      } catch {
        console.log('Response text:', errorText);
      }
      return;
    }
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    
    if (data.profile) {
      console.log('\nUser Profile:');
      console.log('-------------------');
      console.log(`Username: ${data.profile.username}`);
      console.log(`Email: ${data.profile.email}`);
      console.log(`High Score: ${data.profile.highScore}`);
      console.log(`Rank: ${data.profile.rank}`);
      console.log(`Games Played: ${data.profile.gamesPlayed}`);
      console.log(`Created: ${data.profile.createdAt}`);
      console.log(`Last Played: ${data.profile.lastPlayed || 'Never'}`);
      console.log('-------------------');
    } else {
      console.log('\nNo profile data found.');
    }
  } catch (error) {
    console.error('Error testing user-profile endpoint:', error);
  }
}

// Show usage info if help flag is provided
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node test-user-profile.js <userId>');
  console.log('Example: node test-user-profile.js abc123');
  process.exit(0);
}

// Run the test
testUserProfile(); 