// Configuration
const API_URL = '/api'; // Change to use relative path instead of absolute URL

// DOM Elements
const loadingElement = document.getElementById('loading');
const usersContainer = document.getElementById('users-container');
const usersList = document.getElementById('users-list');
const errorMessage = document.getElementById('error-message');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const paginationInfo = document.getElementById('pagination-info');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// State
let currentPage = 1;
let totalPages = 1;
let pageLimit = 10;
let currentSearch = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load first page of users
    loadUsers(currentPage, pageLimit, currentSearch);
    
    // Add event listeners
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadUsers(currentPage, pageLimit, currentSearch);
        }
    });
    
    nextPageButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadUsers(currentPage, pageLimit, currentSearch);
        }
    });
    
    searchButton.addEventListener('click', () => {
        currentSearch = searchInput.value.trim();
        currentPage = 1; // Reset to first page on new search
        loadUsers(currentPage, pageLimit, currentSearch);
    });
    
    // Enable search on Enter key
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
});

async function loadUsers(page, limit, username = '') {
    // Show loading, hide content
    loadingElement.style.display = 'block';
    usersContainer.style.display = 'none';
    errorMessage.textContent = '';
    
    try {
        // Build URL with pagination parameters
        let url = `${API_URL}/users?page=${page}&limit=${limit}`;
        
        // Add username filter if provided
        if (username) {
            url += `&username=${encodeURIComponent(username)}`;
        }
        
        // Fetch users data
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Parse response
        const data = await response.json();
        
        if (response.ok) {
            // Update UI with users data
            renderUsers(data.users);
            
            // Update pagination state
            updatePagination(data.pagination);
            
            // Hide loading, show content
            loadingElement.style.display = 'none';
            usersContainer.style.display = 'block';
        } else {
            // Show error message
            showMessage(data.error || 'Failed to load users data', true);
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showMessage('Could not connect to the server. Please try again later.', true);
    }
}

function renderUsers(users) {
    // Clear existing users
    usersList.innerHTML = '';
    
    if (users.length === 0) {
        // Show no users message
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" style="text-align: center;">No users found</td>
        `;
        usersList.appendChild(row);
        return;
    }
    
    // Add each user to the table
    users.forEach(user => {
        const row = document.createElement('tr');
        
        // Format date
        const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
        
        row.innerHTML = `
            <td>${user.username || 'Anonymous'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.highScore || 0}</td>
            <td>${user.gamesPlayed || 0}</td>
            <td>${joinedDate}</td>
        `;
        
        usersList.appendChild(row);
    });
}

function updatePagination(pagination) {
    // Update pagination state
    currentPage = pagination.page;
    totalPages = pagination.pages;
    
    // Update pagination info text
    paginationInfo.textContent = `Showing page ${currentPage} of ${totalPages} (${pagination.total} total users)`;
    
    // Update button states
    prevPageButton.disabled = currentPage <= 1;
    nextPageButton.disabled = currentPage >= totalPages;
}

function showMessage(message, isError) {
    errorMessage.textContent = message;
    errorMessage.style.color = isError ? 'var(--error-color)' : 'var(--success-color)';
    
    if (isError) {
        loadingElement.style.display = 'none';
    }
} 