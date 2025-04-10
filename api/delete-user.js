// API endpoint for deleting a user
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

  // Accept both DELETE and POST methods for flexibility
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please use DELETE or POST.' });
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

  try {
    // Get userId from query params, URL params, or request body
    const userId = req.query.userId || (req.body && req.body.userId);

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

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
}; 