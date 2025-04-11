// API endpoint for fetching user referral information
const firebase = require('firebase-admin');
const handleCors = require('./middleware/cors');

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

module.exports = async (req, res) => {
  // Handle CORS - if it's a preflight request, it stops here
  if (handleCors(req, res)) {
    return; // Preflight request handled, stop execution
  }

  // Allow both GET and POST methods
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please use GET or POST.' });
  }

  try {
    // Get the userId from query params (GET) or request body (POST)
    let userId;
    
    if (req.method === 'GET') {
      userId = req.query.userId;
    } else { // POST
      userId = req.body.userId;
    }

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get the user document
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userDoc.data();
    
    // Return the referral information
    return res.status(200).json({
      referralCount: userData.referralCount || 0,
      referrals: userData.referrals || [],
      username: userData.username
    });
    
  } catch (error) {
    console.error('Error fetching referral information:', error);
    return res.status(500).json({
      error: 'Failed to fetch referral information',
      message: error.message
    });
  }
}; 