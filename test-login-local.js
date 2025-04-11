// Quick test script to verify login functionality
const fetch = require('node-fetch');

// Config
const API_URL = process.env.API_URL || 'https://hop-bunny-backend-v2.vercel.app/api';
const testUser = {
  email: process.argv[2] || 'test@example.com',
  password: process.argv[3] || 'password123'
};

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    console.log('----------------------------');
    console.log(`API URL: ${API_URL}`);
    console.log(`Attempting to login with email: ${testUser.email}`);
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    console.log('\nResponse status:', response.status);
    console.log('Response headers:', Object.fromEntries([...response.headers]));
    console.log('\nResponse data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\nLogin successful!');
      console.log('User ID:', data.userId);
      console.log('Username:', data.username);
      console.log('Token:', data.token);
      console.log('High Score:', data.highScore);
    } else {
      console.log('\nLogin failed.');
      console.log('Error:', data.error);
      console.log('Message:', data.message);
    }
    
  } catch (error) {
    console.error('Error testing login endpoint:', error);
  }
}

console.log('Login Test Tool');
console.log('===============');
console.log('Usage: node test-login-local.js [email] [password]');
console.log('Example: node test-login-local.js test@example.com password123');
console.log('\nIf no credentials are provided, defaults will be used.\n');

testLogin(); 