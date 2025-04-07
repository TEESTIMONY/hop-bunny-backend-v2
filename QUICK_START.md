# Quick Start Guide

## Setting Up Your Firebase Backend

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Firebase Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings > Service accounts
4. Click "Generate new private key"
5. Save the downloaded JSON file securely

### 3. Set Environment Variables
Create a `.env` file in the root of your project:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@example.com
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
CORS_ORIGIN=http://localhost:3000
```

Fill in these values from your downloaded service account JSON file.

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test Your API
In a new terminal:
```bash
npm test
```

### 6. Deploy to Vercel
```bash
npm run deploy
```

Remember to add the environment variables to your Vercel project settings when deploying.

## Firebase Database Structure

This backend expects the following Firestore collections:

### `users` Collection
- Document ID: User's UID from Firebase Authentication
- Fields:
  - `username`: String
  - `email`: String
  - `highScore`: Number
  - `created_at`: Timestamp

### `scores` Collection
- Document ID: Auto-generated
- Fields:
  - `userId`: String (Reference to user's UID)
  - `username`: String
  - `score`: Number
  - `timestamp`: Timestamp 