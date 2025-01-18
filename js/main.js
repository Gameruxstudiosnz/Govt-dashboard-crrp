// Global modal handler
window.openLoginModal = function() {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
};

// Initialize all functionality when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupLoginForm();
    checkAuthState();
    setupDashboard();
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Test credentials
        if ((username === 'admin' && password === 'admin123') || 
            (username === 'dev' && password === 'dev123')) {
            handleLogin({
                name: username === 'admin' ? 'Administrator' : 'Developer',
                role: 'Admin',
                token: `${username}-${Date.now()}`
            });
        } else {
            showMessage('Invalid credentials', 'danger');
        }
    });
}

function handleLogin(userData) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    loginModal.hide();
    
    showDashboard();
    showMessage(`Welcome back, ${userData.name}!`, 'success');
}

function showDashboard() {
    document.querySelector('.dashboard-container').style.display = 'flex';
    document.querySelector('.login-welcome').style.display = 'none';
}

function showMessage(text, type) {
    const toast = `
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
            <div class="toast show bg-${type} text-white">
                <div class="toast-body">${text}</div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', toast);
    setTimeout(() => document.querySelector('.toast')?.remove(), 3000);
}

function checkAuthState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        showDashboard();
    }
}

function setupDashboard() {
    // Initialize dashboard components
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.name) {
        document.querySelector('.user-profile span').textContent = userData.name;
    }
}
