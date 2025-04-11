# Hop Bunny Registration and Login Forms

This folder contains simple HTML forms for registering and logging into the Hop Bunny application.

## Files

- `index.html` - Landing page with links to registration and login
- `register.html` - Registration form for new users
- `login.html` - Login form for existing users

## How to Use

1. The backend API is already hosted at:
   ```
   https://hop-bunny-backend-v2.vercel.app/
   ```

2. Open the `index.html` file in your browser:
   - You can use any web server to serve these files
   - For simple testing, you can just double-click the `index.html` file to open it directly

3. From the landing page, you can:
   - Click "Register a new account" to create a new user
   - Click "Login to your account" to log in with existing credentials

## API Endpoints Used

These HTML forms connect to the following API endpoints:

- `https://hop-bunny-backend-v2.vercel.app/api/register` - POST request to create a new user
- `https://hop-bunny-backend-v2.vercel.app/api/login` - POST request to authenticate a user

## Notes

- These are simple HTML forms with no CSS styling
- Data is stored on the hosted backend server
- Password is sent in plain text - this is not secure for production use
- The backend is already using HTTPS for secure communication 