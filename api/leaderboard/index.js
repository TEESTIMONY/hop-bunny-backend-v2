// API endpoint for fetching the leaderboard
const firebase = require('firebase-admin');

// Check if Firebase is already initialized to avoid multiple initializations
if (!firebase.apps.length) {
  try {
    firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    console.log('Firebase initialized successfully in leaderboard/index.js');
  } catch (error) {
    console.error('Error initializing Firebase in leaderboard/index.js:', error);
  }
}

const db = firebase.firestore();

module.exports = async (req, res) => {
  console.log('Leaderboard endpoint called with method:', req.method);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

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
    // Get query parameters with defaults
    const limit = parseInt(req.query.limit) || 10;
    
    // Make sure limit is reasonable
    if (limit > 100) {
      return res.status(400).json({ error: 'Limit cannot exceed 100' });
    }

    console.log(`Querying users collection with limit: ${limit}`);
    
    // Query the users collection, ordered by highScore descending
    const snapshot = await db.collection('users')
      .orderBy('highScore', 'desc')
      .limit(limit)
      .get();

    console.log(`Query returned ${snapshot.size} documents`);

    if (snapshot.empty) {
      console.log('No high scores found in the database');
      return res.status(200).json({ 
        message: 'No high scores found',
        leaderboard: []
      });
    }

    // Format the response
    const leaderboard = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        rank: index + 1,
        userId: doc.id,
        username: data.username || 'Anonymous',
        highScore: data.highScore || 0,
        gamesPlayed: data.gamesPlayed || 0
      };
    });

    console.log(`Returning leaderboard with ${leaderboard.length} entries`);
    return res.status(200).json({
      leaderboard,
      totalPlayers: leaderboard.length
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({
      error: 'Failed to fetch leaderboard',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 