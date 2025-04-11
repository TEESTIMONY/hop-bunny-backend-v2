// API endpoint for user login
const firebase = require('firebase-admin');

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
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

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
    const { email, password, idToken } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // For proper authentication, we need to verify both email and password
    // Since Firebase Admin SDK doesn't support email/password authentication directly,
    // we need to use the idToken from the client's Firebase Auth SDK

    if (!idToken) {
      return res.status(400).json({ 
        error: 'Authentication failed', 
        message: 'ID token is required for authentication' 
      });
    }

    try {
      // Verify the ID token
      const decodedToken = await auth.verifyIdToken(idToken);
      const uid = decodedToken.uid;
      
      // Verify that the token's email matches the provided email
      if (decodedToken.email !== email) {
        return res.status(401).json({ 
          error: 'Authentication failed', 
          message: 'Token email does not match provided email' 
        });
      }
      
      // Get user data from Firestore
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User data not found' });
      }
      
      const userData = userDoc.data();
      
      return res.status(200).json({
        message: 'Login successful',
        userId: uid,
        username: userData.username,
        highScore: userData.highScore || 0
      });
    } catch (error) {
      console.error('Token verification error:', error);
      
      if (error.code === 'auth/id-token-expired' || 
          error.code === 'auth/id-token-revoked' || 
          error.code === 'auth/invalid-id-token') {
        return res.status(401).json({ 
          error: 'Authentication failed', 
          message: 'Invalid or expired token' 
        });
      }
      
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