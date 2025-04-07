// Shared Firebase admin initialization for all API endpoints
const admin = require('firebase-admin');

// Initialize Firebase admin if not already initialized
function initFirebase() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw error;
    }
  }
  
  return {
    db: admin.firestore(),
    auth: admin.auth(),
    admin // Export the admin object for direct access to other services
  };
}

module.exports = {
  initFirebase
}; 