# Hop Bunny Frontend

This is the frontend for the Hop Bunny Game application, providing login, registration, and user dashboard functionality.

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- npm (comes with Node.js)
- Hop Bunny Backend API running

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
   (Note: Use the package-frontend.json file by renaming it to package.json first)

3. Configure the backend API URL in `server.js`:
   ```javascript
   const API_URL = 'http://localhost:3001'; // Change to your backend URL
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Pages

- **Home (index.html)**: Welcome page with links to login, register, and view users
- **Login (login.html)**: User login form
- **Register (register.html)**: New user registration form
- **Dashboard (dashboard.html)**: User profile page showing user stats
- **Users (users.html)**: List of all registered users with search and pagination

## Troubleshooting

### API Connectivity Issues

If you see errors like "Failed to load resource" or "SyntaxError: Unexpected token '<'":

1. Make sure your backend API is running
2. Check that the API_URL in server.js is correct
3. Look at the browser console for specific error messages
4. Check the server console for proxy errors

### Authentication Issues

If you can't log in or register:

1. Make sure your backend Firebase configuration is correct
2. Try registering a new account first
3. Check browser console and server logs for errors

## Development Notes

- API requests are proxied through the Express server to avoid CORS issues
- Frontend uses vanilla JavaScript with no frameworks
- All API URLs use a relative path ('/api/...') which is proxied to the backend 