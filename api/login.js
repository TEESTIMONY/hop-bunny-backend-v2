// API endpoint for user login
// WARNING: THIS IS A SECURITY VULNERABILITY - ONLY FOR TEMPORARY TESTING
// This code does not validate passwords and should be fixed ASAP
const firebase = require('firebase-admin');
const fetch = require('node-fetch');

// Check if Firebase is already initialized to avoid multiple initializations
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

const db = firebase.firestore();
const auth = firebase.auth();

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST methods
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // VULNERABLE CODE - This is the original vulnerability
    // This only checks that the email exists but doesn't validate the password
    try {
      // Check if the user exists
      const userRecord = await auth.getUserByEmail(email);
      
      // Get user data from Firestore
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      const userData = userDoc.data();
      
      // Generate a fake token - this is not a real auth token
      // In a proper implementation, this would come from Firebase Auth
      const fakeToken = Buffer.from(JSON.stringify({
        uid: userRecord.uid,
        email: email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      })).toString('base64');
      
      return res.status(200).json({
        message: 'Login successful',
        userId: userRecord.uid,
        username: userData.username,
        highScore: userData.highScore || 0,
        token: fakeToken,
        idToken: fakeToken, // For compatibility with new frontend
        refreshToken: fakeToken // For compatibility with new frontend
      });
    } catch (error) {
      // If user doesn't exist
      if (error.code === 'auth/user-not-found') {
        return res.status(404).json({ error: 'User not found' });
      }
      
      throw error; // Rethrow for the outer catch
    }
    
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
}; 