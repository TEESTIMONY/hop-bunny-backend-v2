// Configuration
const API_URL = '/api'; // Change to use relative path instead of absolute URL

// DOM Elements
const registerForm = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorMessage = document.getElementById('error-message');

// Add event listener to form submit
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous error messages
    errorMessage.textContent = '';
    
    // Validate form
    if (!usernameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
        showMessage('Please fill in all fields', true);
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        showMessage('Please enter a valid email address', true);
        return;
    }
    
    // Validate password length
    if (passwordInput.value.length < 6) {
        showMessage('Password must be at least 6 characters long', true);
        return;
    }
    
    // Validate password match
    if (passwordInput.value !== confirmPasswordInput.value) {
        showMessage('Passwords do not match', true);
        return;
    }
    
    // Disable form while processing
    setFormDisabled(true);
    
    try {
        // Prepare registration data
        const registrationData = {
            username: usernameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        };
        
        console.log('Sending registration request to:', `${API_URL}/register`);
        console.log('Registration data:', JSON.stringify(registrationData));
        
        // Send registration request
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);
        
        // Check if response is OK before trying to parse JSON
        if (response.ok) {
            // Parse response
            const data = await response.json();
            
            // Show success message
            showMessage('Registration successful! Redirecting to login...', false);
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            // Try to parse error response as JSON
            let errorData;
            try {
                errorData = await response.json();
                showMessage(errorData.error || errorData.message || `Registration failed (${response.status})`, true);
            } catch (parseError) {
                // If parsing fails, use status text
                const responseText = await response.text();
                console.error('Response parsing error:', parseError);
                console.error('Raw response:', responseText.substring(0, 500) + '...');
                showMessage(`Registration failed: Server returned ${response.status} ${response.statusText}`, true);
            }
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage(`Could not connect to the server. Error: ${error.message}`, true);
    } finally {
        // Re-enable form
        setFormDisabled(false);
    }
});

// Helper functions
function setFormDisabled(disabled) {
    const formElements = registerForm.elements;
    for (let i = 0; i < formElements.length; i++) {
        formElements[i].disabled = disabled;
    }
}

function showMessage(message, isError) {
    errorMessage.textContent = message;
    errorMessage.style.color = isError ? 'var(--error-color)' : 'var(--success-color)';
} 