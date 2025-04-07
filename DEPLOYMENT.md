# Deployment to Vercel

This guide will help you deploy your Hop Bunny backend to Vercel.

## Prerequisites

- Vercel account
- Firebase project set up with service account credentials

## Deployment Steps

1. **Login to Vercel CLI**
   ```bash
   npx vercel login
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel
   ```
   
   When prompted:
   - Select your existing project "hop-bunny-backend-v2" 
   - Confirm the project settings

3. **Set Environment Variables in Vercel**

   After initial deployment, set these environment variables in the Vercel dashboard:
   
   - Go to your project in the Vercel dashboard
   - Navigate to "Settings" > "Environment Variables"
   - Add the following variables:
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_CLIENT_EMAIL`
     - `FIREBASE_PRIVATE_KEY` (make sure to keep the quotes)
     - `FIREBASE_DATABASE_URL`
     - `CORS_ORIGIN` (your frontend URL)

4. **Deploy to Production**
   ```bash
   npx vercel --prod
   ```

## Testing the Deployment

After deployment, test your API endpoints:

1. **Root endpoint**
   ```
   https://hop-bunny-backend-v2.vercel.app/api
   ```

2. **Leaderboard endpoint**
   ```
   https://hop-bunny-backend-v2.vercel.app/api/leaderboard
   ```

If you encounter 404 errors, check the following:

1. Ensure your Firebase database has a 'users' collection with documents
2. Verify your environment variables are set correctly in Vercel
3. Check Vercel's Function Logs for any errors

## Troubleshooting

If you encounter issues:

1. **Check Vercel Logs**
   - Go to your Vercel project dashboard
   - Click on the latest deployment
   - Navigate to "Functions" and look for errors

2. **Test Locally First**
   ```bash
   npm run dev
   ```

3. **Inspect Firestore Database**
   - Ensure you have created the necessary collections
   - Make sure you have test data 