// API endpoint for fetching all registered users
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
    console.log('Fetching all users');
    
    // Get pagination parameters with defaults
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    
    // Make sure limit is reasonable
    if (limit > 100) {
      return res.status(400).json({ error: 'Limit cannot exceed 100' });
    }

    // Query the users collection
    let usersQuery = db.collection('users');
    
    // Optional filtering by username if provided
    if (req.query.username) {
      // Firebase doesn't support case-insensitive search directly
      // so we're searching for strings that start with the query
      const searchValue = req.query.username;
      const endValue = searchValue.slice(0, -1) + String.fromCharCode(searchValue.charCodeAt(searchValue.length - 1) + 1);
      
      usersQuery = usersQuery.where('username', '>=', searchValue)
                             .where('username', '<', endValue);
    }
    
    // Execute the query with pagination
    const snapshot = await usersQuery
      .orderBy('username', 'asc')
      .limit(limit)
      .offset(offset)
      .get();

    console.log(`Query returned ${snapshot.size} users`);

    if (snapshot.empty) {
      return res.status(200).json({ 
        message: 'No users found',
        users: [],
        pagination: {
          total: 0,
          page,
          limit,
          pages: 0
        }
      });
    }

    // Format the response
    const users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        userId: doc.id,
        username: data.username || 'Anonymous',
        email: data.email,
        highScore: data.highScore || 0,
        gamesPlayed: data.gamesPlayed || 0,
        createdAt: data.createdAt ? data.createdAt.toDate() : null
      };
    });

    // Get total count for pagination info
    const totalSnapshot = await db.collection('users').count().get();
    const total = totalSnapshot.data().count;
    const pages = Math.ceil(total / limit);

    console.log(`Returning ${users.length} users out of ${total} total`);
    return res.status(200).json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message
    });
  }
}; 