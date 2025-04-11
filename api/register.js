// API endpoint for user registration
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
    const { email, password, username, referrerId, referrerUsername } = req.body;

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    // Store additional user info in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      username,
      email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      highScore: 0,
      gamesPlayed: 0,
      referralCount: 0,  // Initialize referral count
      referrals: [],     // Initialize empty array of referrals
      referredBy: referrerId || null,  // Track who referred this user
      referredByUsername: referrerUsername || null  // Store the username of the referrer
    });

    // Prepare the response
    const responseData = {
      message: 'User registered successfully',
      userId: userRecord.uid
    };

    // If this user was referred by someone, update the referrer's stats
    if (referrerId && referrerUsername) {
      try {
        // Get a reference to the referrer's document
        const referrerRef = db.collection('users').doc(referrerId);
        
        // Use a transaction to safely update the referral count and list
        const referralResult = await db.runTransaction(async (transaction) => {
          const referrerDoc = await transaction.get(referrerRef);
          
          if (!referrerDoc.exists) {
            return { success: false, message: 'Referrer user does not exist' };
          }
          
          const referrerData = referrerDoc.data();
          
          // Initialize referral fields if they don't exist
          const referrals = referrerData.referrals || [];
          const referralCount = referrerData.referralCount || 0;
          
          // Update the referrer document with incremented count and new username
          transaction.update(referrerRef, {
            referralCount: referralCount + 1,
            referrals: [...referrals, username],
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
          });
          
          return { 
            success: true, 
            newCount: referralCount + 1,
            message: 'Referral count updated successfully' 
          };
        });
        
        // Add referral info to the response
        responseData.referralUpdated = referralResult.success;
        responseData.referralMessage = referralResult.message;
        
      } catch (referralError) {
        console.error('Error updating referral count:', referralError);
        responseData.referralUpdated = false;
        responseData.referralMessage = 'Failed to update referral count';
      }
    }

    return res.status(201).json(responseData);
  } catch (error) {
    console.error('Error registering new user:', error);
    return res.status(500).json({ 
      error: 'Registration failed', 
      message: error.message 
    });
  }
}; 