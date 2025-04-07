// Simple script to test Firebase connection
const firebase = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase
try {
  firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  process.exit(1);
}

const db = firebase.firestore();

async function testFirebase() {
  try {
    console.log('\n🔍 Testing Firebase Firestore connection...');
    
    // Test querying users collection
    console.log('\n📊 Querying users collection:');
    const usersSnapshot = await db.collection('users').limit(5).get();
    
    if (usersSnapshot.empty) {
      console.log('⚠️ No users found. The collection might be empty.');
      
      // Create a test user for demonstration
      console.log('\n✨ Creating a test user...');
      const testUserRef = db.collection('users').doc('test-user-' + Date.now());
      await testUserRef.set({
        username: 'TestUser',
        email: 'test@example.com',
        highScore: 100,
        gamesPlayed: 5,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('✅ Test user created successfully with ID:', testUserRef.id);
      
      // Query again to show the test user
      console.log('\n📊 Querying users collection again:');
      const updatedSnapshot = await db.collection('users').limit(5).get();
      console.log(`Found ${updatedSnapshot.size} user(s):`);
      updatedSnapshot.forEach(doc => {
        console.log(`- User ID: ${doc.id}, Username: ${doc.data().username}, Score: ${doc.data().highScore}`);
      });
    } else {
      console.log(`Found ${usersSnapshot.size} user(s):`);
      usersSnapshot.forEach(doc => {
        console.log(`- User ID: ${doc.id}, Username: ${doc.data().username}, Score: ${doc.data().highScore}`);
      });
    }
    
    console.log('\n✅ Firebase Firestore test completed successfully!');
  } catch (error) {
    console.error('\n❌ Error testing Firebase:', error);
  } finally {
    // Terminate Firebase app
    await firebase.app().delete();
    console.log('\n👋 Firebase app terminated');
  }
}

// Run the test
testFirebase(); 