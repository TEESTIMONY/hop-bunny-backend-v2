// Script to fix user authentication status
const firebase = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const auth = firebase.auth();

async function fixUserAuthentication() {
  try {
    // Parameters from command line or default values
    const email = process.argv[2] || 'fola@gmail.com';
    const password = process.argv[3] || 'new-password123';
    const uid = process.argv[4] || 'dA8jywaI6HRYJ4ynZTNKZEf9Cxn1';
    
    console.log(`Attempting to fix authentication for user: ${email}`);
    
    try {
      // First try to get the user to see if they already exist
      await auth.getUser(uid);
      console.log(`User with UID ${uid} already exists in Firebase Auth.`);
      
      // Update user email and password
      await auth.updateUser(uid, {
        email: email,
        password: password,
        emailVerified: true
      });
      
      console.log(`Updated user authentication details.`);
    } catch (error) {
      // If user doesn't exist, create them with the specified UID
      if (error.code === 'auth/user-not-found') {
        await auth.createUser({
          uid: uid,
          email: email,
          password: password,
          emailVerified: true
        });
        
        console.log(`Created new user in Firebase Auth with UID: ${uid}`);
      } else {
        throw error; // Rethrow for outer catch
      }
    }
    
    console.log(`\nUser authentication has been fixed.`);
    console.log(`Email: ${email}`);
    console.log(`UID: ${uid}`);
    console.log(`Password: ${password}`);
    console.log(`\nYou can now use these credentials to log in.`);
    
  } catch (error) {
    console.error('Error fixing user authentication:', error);
  }
}

// Show usage info if help flag is provided
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node fix-user-auth.js [email] [password] [uid]');
  console.log('Example: node fix-user-auth.js user@example.com newpassword123 userUID');
  process.exit(0);
}

// Run the function
fixUserAuthentication(); 