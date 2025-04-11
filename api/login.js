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
    
    console.log(`Login attempt for email: ${email}`);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Email and password are required' 
      });
    }

    try {
      // First check if user exists in Firebase Auth
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(email);
      } catch (error) {
        console.log(`Error finding user: ${error.code} - ${error.message}`);
        if (error.code === 'auth/user-not-found') {
          return res.status(401).json({ 
            error: 'Authentication failed', 
            message: 'Invalid email or password' 
          });
        }
        throw error;
      }
      
      // Get user data from Firestore
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      
      if (!userDoc.exists) {
        console.log(`Firestore document not found for user: ${userRecord.uid}`);
        return res.status(401).json({ 
          error: 'Authentication failed', 
          message: 'User data not found' 
        });
      }
      
      const userData = userDoc.data();
      
      // Simple password verification - in production, use proper password hashing
      // This assumes you store the plain password or a simple hash in Firestore for development
      let isAuthenticated = false;
      
      if (userData.password) {
        // Check stored password if available
        isAuthenticated = (userData.password === password);
        console.log(`Comparing with stored password: ${isAuthenticated ? 'match' : 'no match'}`);
      } else {
        // Fallback: Use universal test password
        const testPassword = process.env.TEST_PASSWORD || 'password123';
        isAuthenticated = (password === testPassword);
        console.log(`No password stored, using test password: ${isAuthenticated ? 'match' : 'no match'}`);
      }
      
      if (!isAuthenticated) {
        return res.status(401).json({ 
          error: 'Authentication failed', 
          message: 'Invalid email or password' 
        });
      }
      
      console.log(`Authentication successful for user: ${email}`);
      
      // Generate a custom token
      const token = Buffer.from(`${userRecord.uid}:${Date.now()}`).toString('base64');
      
      // Return user data with token
      return res.status(200).json({
        userId: userRecord.uid,
        username: userData.username || email.split('@')[0],
        highScore: userData.highScore || 0,
        token: token
      });
      
    } catch (error) {
      console.error('Error during authentication:', error);
      throw error;
    }
    
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login. Please try again.'
    });
  }
}; 