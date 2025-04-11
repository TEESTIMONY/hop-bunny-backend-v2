// Direct replacement for auth.js that bypasses CORS issues
// Replace your current auth.js code with this

// Configuration - CORS Proxy
const PROXY_URL = 'https://corsproxy.io/?'; // You can try others if this fails
const API_BASE_URL = 'https://hop-bunny-backend-v2.vercel.app';

// Login function that bypasses CORS
async function login(email, password) {
  try {
    console.log("Attempting login with CORS bypass proxy");
    
    // Use the proxy to make the request
    const url = PROXY_URL + encodeURIComponent(`${API_BASE_URL}/api/login`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    // Parse the response
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Return the successful response
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Function to handle the login button click
function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Display loading state
  const buttonElement = document.querySelector('button');
  const originalText = buttonElement.textContent;
  buttonElement.textContent = 'Logging in...';
  buttonElement.disabled = true;
  
  login(email, password)
    .then(response => {
      console.log('Login successful:', response);
      
      // Store user data in localStorage
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('username', response.username);
      localStorage.setItem('token', response.token);
      
      // Redirect to the game or dashboard
      window.location.href = '/game.html'; // Adjust path as needed
    })
    .catch(error => {
      console.error('Login failed:', error);
      alert('Login failed: ' + error.message);
    })
    .finally(() => {
      // Reset button state
      buttonElement.textContent = originalText;
      buttonElement.disabled = false;
    });
}

// Event listener for the login form
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin();
    });
  }
  
  // Check if user is already logged in
  const token = localStorage.getItem('token');
  if (token) {
    // Redirect to game/dashboard if already logged in
    window.location.href = '/game.html'; // Adjust path as needed
  }
});

// Register function with CORS bypass
async function register(username, email, password) {
  try {
    console.log("Attempting registration with CORS bypass proxy");
    
    // Use the proxy to make the request
    const url = PROXY_URL + encodeURIComponent(`${API_BASE_URL}/api/register`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    
    // Parse the response
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    // Return the successful response
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Function to handle register button click
function handleRegister() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Display loading state
  const buttonElement = document.querySelector('button[type="submit"]');
  const originalText = buttonElement.textContent;
  buttonElement.textContent = 'Registering...';
  buttonElement.disabled = true;
  
  register(username, email, password)
    .then(response => {
      console.log('Registration successful:', response);
      alert('Registration successful! Please log in.');
      
      // Redirect to login page
      window.location.href = '/login.html'; // Adjust path as needed
    })
    .catch(error => {
      console.error('Registration failed:', error);
      alert('Registration failed: ' + error.message);
    })
    .finally(() => {
      // Reset button state
      buttonElement.textContent = originalText;
      buttonElement.disabled = false;
    });
}

// Event listener for the register form
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleRegister();
    });
  }
}); 