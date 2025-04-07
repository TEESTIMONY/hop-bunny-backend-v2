// API endpoint for updating user high scores
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
    const { userId, score } = req.body;

    // Validate input
    if (!userId || score === undefined) {
      return res.status(400).json({ error: 'User ID and score are required' });
    }

    // Validate score is a number
    if (typeof score !== 'number') {
      return res.status(400).json({ error: 'Score must be a number' });
    }

    // Get user document
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const currentHighScore = userData.highScore || 0;

    // Only update if the new score is higher
    if (score > currentHighScore) {
      await userRef.update({
        highScore: score,
        gamesPlayed: firebase.firestore.FieldValue.increment(1),
        lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        message: 'High score updated successfully',
        previousHighScore: currentHighScore,
        newHighScore: score
      });
    } else {
      // Just update play statistics
      await userRef.update({
        gamesPlayed: firebase.firestore.FieldValue.increment(1),
        lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        message: 'Score recorded but not a new high score',
        highScore: currentHighScore
      });
    }
  } catch (error) {
    console.error('Error updating high score:', error);
    return res.status(500).json({
      error: 'Failed to update score',
      message: error.message
    });
  }
}; 