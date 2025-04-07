# Hop Bunny Backend API

Backend API for the Hop Bunny game, handling user authentication, high scores, and leaderboards.

## Features

- User registration and authentication via Firebase
- High score tracking
- Leaderboard functionality
- User profile management

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - User login

### Game Data

- `POST /api/update-score` - Update a user's high score
- `GET /api/leaderboard` - Get the global leaderboard
- `GET /api/user-profile` - Get a user's profile data

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Firebase project with Firestore database
- Vercel CLI (for deployment)

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Set up Firestore Database and Authentication
3. Generate service account keys:
   - Go to Project Settings > Service accounts
   - Click "Generate new private key"
   - Save the downloaded JSON file securely

For more detailed Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/hop-bunny-backend.git
cd hop-bunny-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Edit the `.env` file with your Firebase credentials:

- Get your Firebase Admin SDK service account credentials from Firebase Console > Project Settings > Service Accounts > Generate new private key

5. Start the local development server:

```bash
npm run dev
```

## Deployment to Vercel

1. Install the Vercel CLI globally if you haven't already:

```bash
npm install -g vercel
```

2. Log in to Vercel:

```bash
vercel login
```

3. Deploy to Vercel:

```bash
npm run deploy
```

4. During deployment, Vercel will prompt you to set up environment variables. Add all variables from your `.env` file.

### Environment Variables

Make sure to set these environment variables in Vercel:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (make sure to keep the quotes around the key)
- `FIREBASE_DATABASE_URL`
- `CORS_ORIGIN` (your frontend domain for CORS)

## Testing the API

You can test the API endpoints using tools like Postman or curl:

```bash
# Example: Get leaderboard
curl https://your-vercel-deployment-url.vercel.app/api/leaderboard

# Example: Register user
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","username":"Player1"}' \
  https://your-vercel-deployment-url.vercel.app/api/register
```

## License

MIT 