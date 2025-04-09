// API endpoint for fetching user profile data
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET methods
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Please use GET.' });
  }

  try {
    // Get user ID from query parameter
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();

    // Get user rank by querying users with higher scores
    const higherScoresQuery = await db.collection('users')
      .where('highScore', '>', userData.highScore || 0)
      .count()
      .get();
    
    const rank = higherScoresQuery.data().count + 1; // Add 1 because ranks start at 1, not 0

    // Format and return user profile data
    return res.status(200).json({
      profile: {
        userId: userDoc.id,
        username: userData.username || 'Anonymous',
        email: userData.email,
        highScore: userData.highScore || 0,
        gamesPlayed: userData.gamesPlayed || 0,
        rank,
        createdAt: userData.createdAt ? userData.createdAt.toDate() : null,
        lastPlayed: userData.lastPlayed ? userData.lastPlayed.toDate() : null
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      error: 'Failed to fetch user profile',
      message: error.message
    });
  }
}; 