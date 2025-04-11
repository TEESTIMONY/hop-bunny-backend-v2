// API endpoint for updating user referral counts
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
    const { referrerId, referredUsername } = req.body;

    // Validate input
    if (!referrerId || !referredUsername) {
      return res.status(400).json({ error: 'Referrer ID and referred username are required' });
    }

    // Get a reference to the referrer's document
    const referrerRef = db.collection('users').doc(referrerId);
    
    // Use a transaction to safely update the referral count and list
    const result = await db.runTransaction(async (transaction) => {
      const referrerDoc = await transaction.get(referrerRef);
      
      if (!referrerDoc.exists) {
        throw new Error('Referrer user does not exist');
      }
      
      const referrerData = referrerDoc.data();
      
      // Initialize referral fields if they don't exist
      const referrals = referrerData.referrals || [];
      const referralCount = referrerData.referralCount || 0;
      
      // Make sure we're not double-counting the same referred user
      if (!referrals.includes(referredUsername)) {
        // Update the referrer document with incremented count and new username
        transaction.update(referrerRef, {
          referralCount: referralCount + 1,
          referrals: [...referrals, referredUsername],
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return {
          newCount: referralCount + 1,
          message: 'Referral count updated successfully'
        };
      } else {
        return {
          newCount: referralCount,
          message: 'User was already referred'
        };
      }
    });

    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Error updating referral count:', error);
    return res.status(500).json({
      error: 'Failed to update referral count',
      message: error.message
    });
  }
}; 