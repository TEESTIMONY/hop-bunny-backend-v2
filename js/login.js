// Configuration
const API_URL = '/api'; // Change to use relative path instead of absolute URL

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

// Add event listener to form submit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous error messages
    errorMessage.textContent = '';
    
    // Validate form
    if (!emailInput.value || !passwordInput.value) {
        errorMessage.textContent = 'Please enter both email and password';
        return;
    }
    
    // Disable form while processing
    setFormDisabled(true);
    
    try {
        // Prepare login data
        const loginData = {
            email: emailInput.value,
            password: passwordInput.value
        };
        
        console.log('Sending login request to:', `${API_URL}/login`);
        
        // Send login request
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        console.log('Response status:', response.status);
        
        // Check if response is OK before trying to parse JSON
        if (response.ok) {
            // Parse response
            const data = await response.json();
            
            // Save user data to local storage
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            
            // Show success message
            showMessage('Login successful! Redirecting...', false);
            
            // Redirect to game or dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Try to parse error response as JSON
            let errorData;
            try {
                errorData = await response.json();
                showMessage(errorData.error || errorData.message || `Login failed (${response.status})`, true);
            } catch (parseError) {
                // If parsing fails, use status text
                const responseText = await response.text();
                console.error('Response parsing error:', parseError);
                console.error('Raw response:', responseText.substring(0, 500) + '...');
                showMessage(`Login failed: Server returned ${response.status} ${response.statusText}`, true);
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage(`Could not connect to the server. Error: ${error.message}`, true);
    } finally {
        // Re-enable form
        setFormDisabled(false);
    }
});

// Helper functions
function setFormDisabled(disabled) {
    const formElements = loginForm.elements;
    for (let i = 0; i < formElements.length; i++) {
        formElements[i].disabled = disabled;
    }
}

function showMessage(message, isError) {
    errorMessage.textContent = message;
    errorMessage.style.color = isError ? 'var(--error-color)' : 'var(--success-color)';
} 