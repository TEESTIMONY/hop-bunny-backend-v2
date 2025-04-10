// API endpoint for user operations by userId
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

  // Check authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Valid Bearer token is required.' });
  }

  // Extract the token
  const token = authHeader.split(' ')[1];
  
  // Verify token (you would implement actual verification here)
  try {
    // In a real implementation, you would verify the token with Firebase
    // This is a simplified version - replace with actual token verification
    if (!token) {
      throw new Error('Invalid token');
    }
    
    // For now, we'll just continue if there's any token
    // In production, you should properly verify the token
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  // Get the userId from the URL path parameter
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getUserData(userId, res);
    case 'DELETE':
      return deleteUser(userId, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
};

// Get user data
async function getUserData(userId, res) {
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    
    // Return user data without sensitive information
    return res.status(200).json({
      id: userId,
      highScore: userData.highScore || 0,
      gamesPlayed: userData.gamesPlayed || 0,
      lastPlayed: userData.lastPlayed ? userData.lastPlayed.toDate() : null,
      // Add other non-sensitive fields as needed
    });
  } catch (error) {
    console.error('Error getting user data:', error);
    return res.status(500).json({
      error: 'Failed to get user data',
      message: error.message
    });
  }
}

// Delete user
async function deleteUser(userId, res) {
  try {
    // Check if user exists
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user document from Firestore
    await userRef.delete();

    // Try to delete the user from Firebase Authentication as well
    try {
      await auth.deleteUser(userId);
    } catch (authError) {
      // If auth deletion fails, still proceed with the function
      // This could happen if the user exists in Firestore but not in Auth
      console.warn(`Could not delete user ${userId} from Authentication: ${authError.message}`);
    }

    return res.status(200).json({
      message: 'User deleted successfully',
      userId: userId
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      error: 'Failed to delete user',
      message: error.message
    });
  }
} 