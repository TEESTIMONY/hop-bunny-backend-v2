// Script to test the register endpoint
const fetch = require('node-fetch');
require('dotenv').config();

// Use deployed URL or override with environment variable
const API_URL = process.env.API_URL || 'https://hop-bunny-backend-v2.vercel.app/api';

async function testRegister() {
  try {
    console.log('Testing register endpoint...');
    
    // Generate a unique email to avoid conflicts
    const uniqueId = Date.now();
    const testUser = {
      email: `test${uniqueId}@example.com`,
      password: 'password123',
      username: `TestUser${uniqueId}`
    };
    
    console.log(`Trying to register user: ${testUser.username} (${testUser.email})`);
    
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\nUser registered successfully!');
      console.log('User ID:', data.userId);
      console.log('\nYou can now try to login with these credentials or update the score.');
    } else {
      console.log('\nRegistration failed.');
    }
  } catch (error) {
    console.error('Error testing register endpoint:', error);
  }
}

// Run the test
testRegister(); 