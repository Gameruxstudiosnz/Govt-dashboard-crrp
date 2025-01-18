class AuthManager {
    constructor() {
        this.init();
        this.setupAuthListeners();
        this.testUsers = [
            {
                username: 'admin',
                password: 'admin123',
                role: 'Administrator',
                name: 'John Admin',
                permissions: ['read', 'write', 'delete', 'admin']
            },
            {
                username: 'user',
                password: 'user123',
                role: 'User',
                name: 'Jane User',
                permissions: ['read']
            }
        ];
    }

    init() {
        this.checkAuthState();
    }

    checkAuthState() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
            this.showDashboard();
            this.updateUIWithUserData(JSON.parse(userData));
        } else {
            this.logout();
        }
    }

    setupAuthListeners() {
        // Login form submission
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            this.handleLogin(
                formData.get('username'),
                formData.get('password')
            );
        });

        // Logout button
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.addEventListener('click', () => this.logout());
        });
    }

    handleLogin(username, password) {
        const user = this.authenticateUser(username, password);
        
        if (user) {
            this.setUserSession(user);
            this.showDashboard();
            this.updateUIWithUserData(user);
            this.showLoginSuccess(user.name);
        } else {
            this.showLoginError();
        }
    }

    authenticateUser(username, password) {
        return this.testUsers.find(user => 
            user.username === username && 
            user.password === password
        );
    }

    setUserSession(user) {
        const sessionData = {
            name: user.name,
            role: user.role,
            permissions: user.permissions,
            sessionStart: new Date().toISOString()
        };

        localStorage.setItem('authToken', this.generateToken());
        localStorage.setItem('userData', JSON.stringify(sessionData));
    }

    generateToken() {
        return 'token-' + Math.random().toString(36).substr(2) + Date.now();
    }

    updateUIWithUserData(userData) {
        // Update user info in header
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.innerHTML = `
                <span class="user-name">${userData.name}</span>
                <span class="user-role badge bg-primary">${userData.role}</span>
            `;
        }

        // Update permissions-based UI elements
        this.updatePermissionsUI(userData.permissions);
    }

    updatePermissionsUI(permissions) {
        // Show/hide elements based on permissions
        document.querySelectorAll('[data-requires-permission]').forEach(element => {
            const requiredPermission = element.dataset.requiresPermission;
            element.style.display = permissions.includes(requiredPermission) ? 'block' : 'none';
        });
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.showLoginScreen();
        this.showLogoutSuccess();
    }

    showLoginScreen() {
        document.querySelector('.dashboard-container').style.display = 'none';
        document.querySelector('.login-welcome').style.display = 'flex';
    }

    showDashboard() {
        document.querySelector('.dashboard-container').style.display = 'flex';
        document.querySelector('.login-welcome').style.display = 'none';
        bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();
    }

    showLoginSuccess(name) {
        const toast = `
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                <div class="toast show bg-success text-white">
                    <div class="toast-header bg-success text-white">
                        <i class="fas fa-check-circle me-2"></i>
                        <strong class="me-auto">Welcome ${name}</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body">
                        Successfully logged in to the dashboard
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', toast);
        setTimeout(() => document.querySelector('.toast')?.remove(), 3000);
    }

    showLoginError() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.textContent = 'Invalid credentials. Please try again.';
        document.getElementById('loginForm').appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    showLogoutSuccess() {
        const toast = `
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                <div class="toast show bg-info text-white">
                    <div class="toast-body">
                        Successfully logged out. See you soon!
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', toast);
        setTimeout(() => document.querySelector('.toast')?.remove(), 3000);
    }
}

// Initialize authentication
const auth = new AuthManager();