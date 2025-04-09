// Configuration
const API_URL = '/api'; // Change to use relative path instead of absolute URL

// DOM Elements
const dashboardContent = document.getElementById('dashboard-content');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const usernameElement = document.getElementById('username');
const emailElement = document.getElementById('email');
const userAvatarElement = document.getElementById('user-avatar');
const highScoreElement = document.getElementById('highScore');
const gamesPlayedElement = document.getElementById('gamesPlayed');
const rankElement = document.getElementById('rank');
const logoutBtn = document.getElementById('logoutBtn');
const playGameBtn = document.getElementById('playGameBtn');

// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!userId || !token) {
        // Redirect to login if not logged in
        showMessage('Please log in to view your dashboard', true);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Load user profile data
    loadUserProfile(userId, token);
    
    // Add logout event listener
    logoutBtn.addEventListener('click', handleLogout);
    
    // Add play game event listener
    playGameBtn.addEventListener('click', () => {
        // Redirect to the game page - adjust this URL as needed
        window.location.href = 'game.html';
    });
});

async function loadUserProfile(userId, token) {
    try {
        // Fetch user profile data
        const response = await fetch(`${API_URL}/user-profile?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        // Parse response
        const data = await response.json();
        
        if (response.ok) {
            // Update UI with user data
            updateUserProfile(data.profile);
            
            // Hide loading, show content
            loadingElement.style.display = 'none';
            dashboardContent.style.display = 'block';
        } else {
            // Show error message
            showMessage(data.error || 'Failed to load profile data', true);
            
            // If unauthorized, redirect to login
            if (response.status === 401) {
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showMessage('Could not connect to the server. Please try again later.', true);
    }
}

function updateUserProfile(profile) {
    // Update user info
    usernameElement.textContent = profile.username || 'User';
    emailElement.textContent = profile.email || '';
    
    // Update user avatar with first letter of username
    const firstLetter = (profile.username || 'U')[0].toUpperCase();
    userAvatarElement.textContent = firstLetter;
    
    // Update stats
    highScoreElement.textContent = profile.highScore || 0;
    gamesPlayedElement.textContent = profile.gamesPlayed || 0;
    rankElement.textContent = `#${profile.rank || 0}`;
}

function handleLogout(e) {
    e.preventDefault();
    
    // Clear local storage
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // Show message and redirect
    showMessage('You have been logged out successfully', false);
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function showMessage(message, isError) {
    errorMessage.textContent = message;
    errorMessage.style.color = isError ? 'var(--error-color)' : 'var(--success-color)';
    
    if (isError) {
        loadingElement.style.display = 'none';
    }
} 