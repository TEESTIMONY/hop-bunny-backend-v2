// Script to test the update-score endpoint
const fetch = require('node-fetch');
require('dotenv').config();

// Use deployed URL or override with environment variable
const API_URL = process.env.API_URL || 'https://hop-bunny-backend-v2.vercel.app/api';

async function testUpdateScore() {
  try {
    console.log('Testing update-score endpoint...');
    
    // Use command line arguments or default values
    const userId = process.argv[2];
    const score = parseInt(process.argv[3]) || 500;
    
    if (!userId) {
      console.error('Error: User ID is required');
      console.log('Usage: node test-update-score.js <userId> [score]');
      console.log('Example: node test-update-score.js abc123 500');
      return;
    }
    
    console.log(`Updating score for user ID: ${userId} to ${score} points`);
    
    const response = await fetch(`${API_URL}/update-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        score
      }),
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\nScore update successful!');
      if (data.newHighScore && data.previousHighScore) {
        console.log(`New high score: ${data.newHighScore} (previous: ${data.previousHighScore})`);
      } else {
        console.log(`Current high score: ${data.highScore}`);
      }
    } else {
      console.log('\nScore update failed.');
    }
  } catch (error) {
    console.error('Error testing update-score endpoint:', error);
  }
}

// Show usage info if help flag is provided
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node test-update-score.js <userId> [score]');
  console.log('Example: node test-update-score.js abc123 500');
  process.exit(0);
}

// Run the test
testUpdateScore(); 