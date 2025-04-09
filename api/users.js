// API endpoint for fetching all registered users
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
    console.log('Firebase initialized successfully in users.js');
  } catch (error) {
    console.error('Error initializing Firebase in users.js:', error);
  }
}

const db = firebase.firestore();
const auth = firebase.auth();

module.exports = async (req, res) => {
  console.log('Users endpoint called with method:', req.method);
  console.log('Query parameters:', req.query);
  
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

  // Add basic admin authorization check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  try {
    // Get query parameters with defaults
    const limit = parseInt(req.query.limit) || 100;
    const search = req.query.search || '';
    
    // Make sure limit is reasonable
    if (limit > 200) {
      return res.status(400).json({ error: 'Limit cannot exceed 200' });
    }

    console.log(`Querying users collection with limit: ${limit}, search: ${search}`);
    
    // First get users from Firestore for game data
    let query = db.collection('users');
    
    // Don't apply the limit yet as we might need to filter by search term
    let snapshot = await query.get();

    console.log(`Query returned ${snapshot.size} documents from Firestore`);

    if (snapshot.empty) {
      console.log('No users found in the database');
      return res.status(200).json({ 
        message: 'No users found',
        users: []
      });
    }

    // Get all user data from Firestore
    let users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        username: data.username || 'Anonymous',
        email: data.email || '',
        highScore: data.highScore || 0,
        gamesPlayed: data.gamesPlayed || 0,
        createdAt: data.createdAt || null,
        lastLogin: data.lastLogin || null
      };
    });

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user => 
        (user.username && user.username.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower))
      );
    }

    // Apply limit after filtering
    users = users.slice(0, limit);

    console.log(`Returning ${users.length} users after filtering and limiting`);
    return res.status(200).json({
      users,
      totalUsers: users.length
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 