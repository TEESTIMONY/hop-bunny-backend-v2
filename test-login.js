// Script to test the login endpoint
const fetch = require('node-fetch');
require('dotenv').config();

// Use deployed URL or override with environment variable
const API_URL = process.env.API_URL || 'https://hop-bunny-backend-v2.vercel.app/api';

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    
    // Use command line arguments for email and password or use defaults
    const email = process.argv[2] || 'test@example.com';
    const password = process.argv[3] || 'password123';
    
    console.log(`Attempting to login with email: ${email}`);
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\nLogin successful!');
      console.log('User ID:', data.userId);
      console.log('Username:', data.username);
      console.log('High score:', data.highScore);
    } else {
      console.log('\nLogin failed.');
    }
  } catch (error) {
    console.error('Error testing login endpoint:', error);
  }
}

// Show usage info if help flag is provided
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node test-login.js [email] [password]');
  console.log('Example: node test-login.js test@example.com password123');
  process.exit(0);
}

// Run the test
testLogin(); 