// API endpoint for user login
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

    // The Admin SDK can't verify passwords, so we need to use the Firebase Auth REST API
    try {
      // Verify email/password with Firebase Auth REST API
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Authentication failed
        let errorMessage = 'Invalid email or password';
        if (data.error && data.error.message) {
          if (data.error.message === 'EMAIL_NOT_FOUND') {
            errorMessage = 'User not found';
          } else if (data.error.message === 'INVALID_PASSWORD') {
            errorMessage = 'Invalid password';
          }
        }
        return res.status(401).json({ error: errorMessage });
      }

      // Authentication successful, get user info from Firestore
      const userRecord = await auth.getUser(data.localId);
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      const userData = userDoc.data();

      return res.status(200).json({
        message: 'Login successful',
        userId: userRecord.uid,
        username: userData.username,
        highScore: userData.highScore || 0,
        idToken: data.idToken,
        refreshToken: data.refreshToken
      });
    } catch (error) {
      console.error('Error during authentication:', error);
      return res.status(500).json({
        error: 'Authentication failed',
        message: error.message
      });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
}; 