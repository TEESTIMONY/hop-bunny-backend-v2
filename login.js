async function login(email, password) {
    loginButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Logging in...';
    loginButton.disabled = true;
    
    try {
        if (isDevelopment && false) { // Set to false to always use the real API
            // For development, simulate a successful login
            simulateLogin();
            return;
        }

        // Validate inputs before making the request
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        
        // Trim inputs to remove any accidental whitespace
        email = email.trim();
        password = password.trim();

        console.log('Attempting login with:', { email }); // Don't log password for security

        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        // Debug the server response
        console.log('Server response:', {
            status: response.status,
            ok: response.ok,
            data: data
        });

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store user data in localStorage or sessionStorage based on "remember me"
        // The server should validate credentials and only return token if they're correct
        if (data.token) {
            if (rememberMe.checked) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId || '');
                localStorage.setItem('username', data.username || '');
                localStorage.setItem('highScore', data.highScore || 0);
            } else {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('userId', data.userId || '');
                sessionStorage.setItem('username', data.username || '');
                sessionStorage.setItem('highScore', data.highScore || 0);
            }

            // Show success message
            showSuccess(`Login successful! Welcome, ${data.username}!`);

            // Redirect to game page with a flag to prevent flashing
            localStorage.setItem('loginRedirect', 'true');
            
            // Use direct redirect without setTimeout to avoid flashing
            window.location.href = 'index.html';
        } else {
            // If the server doesn't return a token, authentication failed
            throw new Error('Authentication failed. Invalid credentials.');
        }
        
    } catch (error) {
        showError(error.message || 'Login failed');
        console.error('Login error:', error);
    } finally {
        loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> LOGIN';
        loginButton.disabled = false;
    }
} 