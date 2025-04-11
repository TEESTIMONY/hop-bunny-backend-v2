# Security Fix: Authentication Vulnerability

## Issue Description

A critical security vulnerability was identified in the authentication system of the Hop Bunny backend. The login endpoint was only verifying that an email address existed in the Firebase Authentication system but was **not validating the password**. This meant that any user could log in to any account as long as they knew the email address, regardless of whether they provided the correct password.

## Fix Details

The authentication flow has been updated to properly validate both email and password using the Firebase Authentication REST API:

1. The login endpoint now uses the Firebase Auth REST API endpoint `identitytoolkit.googleapis.com/v1/accounts:signInWithPassword` to verify credentials
2. If the credentials are invalid, the login attempt is rejected with an appropriate error message
3. Only when both email and password are correct will the user be authenticated and receive their profile information

## Required Changes

### 1. New Environment Variable

The fix requires a new environment variable to be added:

- `FIREBASE_API_KEY`: The Web API Key from your Firebase project

You can find this key in your Firebase console under:
Project Settings > General > Web API Key

### 2. Installation Steps

1. Update your `.env` file to include the `FIREBASE_API_KEY` variable:
   ```
   FIREBASE_API_KEY=your-web-api-key
   ```

2. If deployed to Vercel, add this environment variable in your Vercel project settings

### 3. Code Changes

- Modified `api/login.js` to properly authenticate using the Firebase Auth REST API
- Added `node-fetch` dependency to make the API call

## Security Best Practices

1. Never store sensitive credentials in your code
2. Always validate user credentials properly before granting access
3. Use HTTPS for all authentication requests
4. Implement rate limiting to prevent brute force attacks
5. Consider adding additional security measures like two-factor authentication for sensitive applications

## Testing The Fix

Run the following command to test the login functionality:

```
npm run test:login test@example.com correctpassword
```

This should succeed only if the correct password is provided. 