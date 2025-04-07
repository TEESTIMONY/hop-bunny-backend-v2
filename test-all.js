// Comprehensive test script for the Hop Bunny API
const fetch = require('node-fetch');
require('dotenv').config();

// Use deployed URL or override with environment variable
const API_URL = process.env.API_URL || 'https://hop-bunny-backend-v2.vercel.app/api';
console.log(`Testing API at: ${API_URL}\n`);

// Store test user credentials for use between tests
const testUser = {
  email: `test${Date.now()}@example.com`,
  password: 'password123',
  username: `TestUser${Date.now()}`,
  userId: null
};

async function runAllTests() {
  try {
    // Test 1: Root endpoint
    await testRootEndpoint();
    
    // Test 2: Register a new user
    await testRegister();
    
    // Test 3: Login with created user
    await testLogin();
    
    // Test 4: Update user's score
    await testUpdateScore();
    
    // Test 5: Check leaderboard
    await testLeaderboard();
    
    // Test 6: Get user profile
    await testUserProfile();
    
    console.log('\n✅ All tests completed!\n');
    console.log(`Test user created: ${testUser.username} (${testUser.email})`);
    console.log(`User ID: ${testUser.userId}`);
    console.log('You can use these credentials for further testing.');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
  }
}

async function testRootEndpoint() {
  console.log('📌 TEST 1: Root endpoint');
  console.log('------------------------');
  
  try {
    const response = await fetch(`${API_URL}`);
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('API Name:', data.name);
    console.log('Version:', data.version);
    console.log('Available endpoints:', data.endpoints.length);
    console.log('Status:', data.status);
    console.log('✅ Root endpoint test passed!');
  } catch (error) {
    console.error('❌ Root endpoint test failed:', error);
    throw error;
  }
  
  console.log('------------------------\n');
}

async function testRegister() {
  console.log('📌 TEST 2: Register endpoint');
  console.log('------------------------');
  
  try {
    console.log(`Registering user: ${testUser.username} (${testUser.email})`);
    
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    
    if (response.ok) {
      console.log('User registered successfully!');
      console.log('User ID:', data.userId);
      
      // Store the user ID for later tests
      testUser.userId = data.userId;
      
      console.log('✅ Register endpoint test passed!');
    } else {
      console.log('Response:', data);
      throw new Error('Registration failed');
    }
  } catch (error) {
    console.error('❌ Register endpoint test failed:', error);
    throw error;
  }
  
  console.log('------------------------\n');
}

async function testLogin() {
  console.log('📌 TEST 3: Login endpoint');
  console.log('------------------------');
  
  try {
    console.log(`Attempting to login with email: ${testUser.email}`);
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      }),
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    
    if (response.ok) {
      console.log('Login successful!');
      console.log('User ID:', data.userId);
      console.log('Username:', data.username);
      console.log('High score:', data.highScore);
      
      console.log('✅ Login endpoint test passed!');
    } else {
      console.log('Response:', data);
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('❌ Login endpoint test failed:', error);
    throw error;
  }
  
  console.log('------------------------\n');
}

async function testUpdateScore() {
  console.log('📌 TEST 4: Update score endpoint');
  console.log('------------------------');
  
  try {
    const score = 1000;
    console.log(`Updating score for user ID: ${testUser.userId} to ${score} points`);
    
    const response = await fetch(`${API_URL}/update-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: testUser.userId,
        score
      }),
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    
    if (response.ok) {
      console.log('Score update successful!');
      if (data.newHighScore !== undefined && data.previousHighScore !== undefined) {
        console.log(`New high score: ${data.newHighScore} (previous: ${data.previousHighScore})`);
      } else {
        console.log(`High score: ${data.highScore}`);
      }
      
      console.log('✅ Update score endpoint test passed!');
    } else {
      console.log('Response:', data);
      throw new Error('Score update failed');
    }
  } catch (error) {
    console.error('❌ Update score endpoint test failed:', error);
    throw error;
  }
  
  console.log('------------------------\n');
}

async function testLeaderboard() {
  console.log('📌 TEST 5: Leaderboard endpoint');
  console.log('------------------------');
  
  try {
    const limit = 5;
    console.log(`Fetching top ${limit} players from leaderboard`);
    
    const response = await fetch(`${API_URL}/leaderboard?limit=${limit}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error: ${response.status} ${response.statusText}`);
      console.log('Response:', errorText);
      throw new Error('Leaderboard fetch failed');
    }
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    
    if (data.leaderboard && data.leaderboard.length > 0) {
      console.log(`Found ${data.leaderboard.length} players on the leaderboard`);
      
      // Check if our test user is on the leaderboard
      const ourUser = data.leaderboard.find(player => player.userId === testUser.userId);
      if (ourUser) {
        console.log(`Our test user is at rank ${ourUser.rank} with score ${ourUser.highScore}`);
      } else {
        console.log('Our test user is not in the top players yet');
      }
      
      console.log('✅ Leaderboard endpoint test passed!');
    } else {
      console.log('No players found on the leaderboard');
      console.log('✅ Leaderboard endpoint returned empty results, but test passed!');
    }
  } catch (error) {
    console.error('❌ Leaderboard endpoint test failed:', error);
    throw error;
  }
  
  console.log('------------------------\n');
}

async function testUserProfile() {
  console.log('📌 TEST 6: User profile endpoint');
  console.log('------------------------');
  
  try {
    console.log(`Fetching profile for user ID: ${testUser.userId}`);
    
    const response = await fetch(`${API_URL}/user-profile?userId=${testUser.userId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error: ${response.status} ${response.statusText}`);
      console.log('Response:', errorText);
      throw new Error('User profile fetch failed');
    }
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    
    if (data.profile) {
      console.log('Profile found:');
      console.log(`Username: ${data.profile.username}`);
      console.log(`Email: ${data.profile.email}`);
      console.log(`High Score: ${data.profile.highScore}`);
      console.log(`Rank: ${data.profile.rank}`);
      console.log(`Games Played: ${data.profile.gamesPlayed}`);
      
      console.log('✅ User profile endpoint test passed!');
    } else {
      console.log('No profile data found');
      throw new Error('User profile not found');
    }
  } catch (error) {
    console.error('❌ User profile endpoint test failed:', error);
    throw error;
  }
  
  console.log('------------------------\n');
}

// Run all tests
runAllTests(); 