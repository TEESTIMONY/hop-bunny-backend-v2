// Script to test the leaderboard endpoint
const fetch = require('node-fetch');
require('dotenv').config();

// Use deployed URL or override with environment variable
const API_URL = process.env.API_URL || 'https://hop-bunny-backend-v2.vercel.app/api';

async function testLeaderboard() {
  try {
    console.log('Testing leaderboard endpoint...');
    
    // Get limit from command line or use default
    const limit = parseInt(process.argv[2]) || 10;
    
    console.log(`Fetching top ${limit} players from leaderboard`);
    
    const response = await fetch(`${API_URL}/leaderboard?limit=${limit}`);
    
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      console.log('Response text:', await response.text());
      return;
    }
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    
    if (data.leaderboard && data.leaderboard.length > 0) {
      console.log(`\nTop ${data.leaderboard.length} players:`);
      console.log('-------------------');
      
      // Print leaderboard in a nice format
      data.leaderboard.forEach(player => {
        console.log(`${player.rank}. ${player.username}`);
        console.log(`   Score: ${player.highScore}`);
        console.log(`   Games: ${player.gamesPlayed}`);
        console.log(`   ID: ${player.userId}`);
        console.log('-------------------');
      });
      
      console.log(`\nTotal players: ${data.totalPlayers}`);
    } else {
      console.log('\nNo high scores found in the leaderboard.');
    }
  } catch (error) {
    console.error('Error testing leaderboard endpoint:', error);
  }
}

// Show usage info if help flag is provided
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node test-leaderboard.js [limit]');
  console.log('Example: node test-leaderboard.js 5');
  process.exit(0);
}

// Run the test
testLeaderboard(); 