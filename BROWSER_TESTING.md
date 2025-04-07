# Testing Hop Bunny API in a Browser

This guide shows you how to test your Hop Bunny API endpoints directly in a web browser.

## Available Endpoints

All endpoints are available at: `https://hop-bunny-backend-v2.vercel.app/api`

### GET Endpoints (Browser-friendly)

These endpoints can be tested directly by entering the URL in your browser:

1. **Root endpoint** - Get API information
   ```
   https://hop-bunny-backend-v2.vercel.app/api
   ```

2. **Leaderboard** - Get top players
   ```
   https://hop-bunny-backend-v2.vercel.app/api/leaderboard
   ```
   
   You can also limit the results:
   ```
   https://hop-bunny-backend-v2.vercel.app/api/leaderboard?limit=5
   ```

3. **User Profile** - Get user details (requires userId parameter)
   ```
   https://hop-bunny-backend-v2.vercel.app/api/user-profile?userId=USER_ID_HERE
   ```

### POST Endpoints (Requires API testing tool)

These endpoints require a tool like Postman, Insomnia, or curl:

1. **Register User**
   ```
   POST https://hop-bunny-backend-v2.vercel.app/api/register
   ```
   Body:
   ```json
   {
     "email": "user@example.com",
     "password": "securepassword123",
     "username": "PlayerOne"
   }
   ```

2. **Login**
   ```
   POST https://hop-bunny-backend-v2.vercel.app/api/login
   ```
   Body:
   ```json
   {
     "email": "user@example.com",
     "password": "securepassword123"
   }
   ```

3. **Update Score**
   ```
   POST https://hop-bunny-backend-v2.vercel.app/api/update-score
   ```
   Body:
   ```json
   {
     "userId": "USER_ID_HERE",
     "score": 1500
   }
   ```

## Troubleshooting

### 404 Not Found
- Ensure you're using the correct URL
- Check if the endpoint exists in the API
- Verify Vercel deployment is complete and successful

### 500 Internal Server Error
- Check Firebase configuration
- Ensure environment variables are correctly set
- Look at Vercel Function Logs for detailed error information

### Empty Responses
- Verify your Firestore database has data
- For user-profile, ensure you're providing a valid userId
- For leaderboard, the database might not have any user records yet 