# Firebase Setup Guide

This guide will help you set up Firebase for the Hop Bunny backend.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "hop-bunny-game")
4. Follow the prompts to create your project

## 2. Set Up Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left navigation
2. Click "Create database"
3. Start in production mode or test mode as needed
4. Choose a location close to your target users

## 3. Generate Service Account Keys

1. In your Firebase project, click the gear icon ⚙️ to access Project Settings
2. Navigate to the "Service accounts" tab
3. Click "Generate new private key"
4. Save the downloaded JSON file securely (do not commit to git)

## 4. Configure Environment Variables

Extract the following information from your downloaded JSON file:

- `FIREBASE_PROJECT_ID`: The "project_id" field
- `FIREBASE_CLIENT_EMAIL`: The "client_email" field
- `FIREBASE_PRIVATE_KEY`: The "private_key" field (keep the quotes)
- `FIREBASE_DATABASE_URL`: https://YOUR_PROJECT_ID.firebaseio.com

Add these to your `.env` file.

## 5. Set Up Authentication

1. In your Firebase project, go to "Authentication" in the left navigation
2. Click "Get started"
3. Enable the "Email/Password" sign-in method
4. Optionally, add other auth providers as needed

## 6. Firestore Database Structure

The backend expects the following collections in Firestore:

- `users`: User profile information
  - Fields: username, email, highScore, created_at
- `scores`: Individual score records
  - Fields: userId, username, score, timestamp

## 7. Vercel Deployment

When deploying to Vercel, add these environment variables in your project settings:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add each variable from your `.env` file
4. Make sure to properly escape the private key if necessary 