// First, add these imports to your file where you're using this function
// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Initialize Firebase (place this outside the login function, with your app initialization)
/*
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
*/

// Updated login function
async function login(email, password) {
    loginButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Logging in...';
    loginButton.disabled = true;
    
    try {
        if (isDevelopment && false) { // Set to false to always use the real API
            // For development, simulate a successful login
            simulateLogin();
            return;
        }

        // Step 1: Authenticate with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Step 2: Get the ID token
        const idToken = await user.getIdToken();
        
        // Step 3: Send the token to your backend API
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email, 
                password,
                idToken 
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Login failed');
        }

        // Get refresh token from Firebase user
        const refreshToken = user.refreshToken;

        // Store user data in localStorage or sessionStorage based on "remember me"
        if (rememberMe.checked) {
            localStorage.setItem('token', idToken); // Using the idToken from Firebase
            localStorage.setItem('refreshToken', refreshToken); // Using refresh token from Firebase
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);
            localStorage.setItem('highScore', data.highScore || 0);
        } else {
            sessionStorage.setItem('token', idToken); // Using the idToken from Firebase
            sessionStorage.setItem('refreshToken', refreshToken); // Using refresh token from Firebase
            sessionStorage.setItem('userId', data.userId);
            sessionStorage.setItem('username', data.username);
            sessionStorage.setItem('highScore', data.highScore || 0);
        }

        // Show success message
        showSuccess(`Login successful! Welcome, ${data.username}!`);

        // Redirect to game page with a flag to prevent flashing
        localStorage.setItem('loginRedirect', 'true');
        
        // Use direct redirect without setTimeout to avoid flashing
        window.location.href = 'index.html';
        
    } catch (error) {
        let errorMessage = 'Login failed';
        
        // Handle Firebase specific errors
        if (error.code) {
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many login attempts. Please try again later.';
                    break;
                default:
                    errorMessage = error.message || 'Authentication failed';
            }
        } else {
            errorMessage = error.message || 'Login failed';
        }
        
        showError(errorMessage);
        console.error('Login error:', error);
    } finally {
        loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> LOGIN';
        loginButton.disabled = false;
    }
} 