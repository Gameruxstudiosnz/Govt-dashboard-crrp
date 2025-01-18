    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });


    // Global modal controller
    window.openLoginModal = function() {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    };
    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('loginForm');
    
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Validate credentials
            if ((username === 'admin' && password === 'admin123') || 
                (username === 'dev' && password === 'dev123')) {
                
                // Store user session
                const userData = {
                    name: username === 'admin' ? 'Administrator' : 'Developer',
                    role: username === 'admin' ? 'Admin' : 'Developer',
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Update display
                document.querySelector('.login-welcome').style.display = 'none';
                document.querySelector('.dashboard-container').style.display = 'flex';
                
                // Update user profile
                const userProfile = document.querySelector('.user-profile');
                if (userProfile) {
                    userProfile.innerHTML = `
                        <span class="user-name">${userData.name}</span>
                        <span class="badge bg-primary">${userData.role}</span>
                    `;
                }
                
                // Show success message
                const toast = `
                    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1080">
                        <div class="toast show bg-success text-white">
                            <div class="toast-body">
                                Welcome to the dashboard, ${userData.name}!
                            </div>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', toast);
                setTimeout(() => document.querySelector('.toast')?.remove(), 3000);
            } else {
                // Show error message for invalid credentials
                const errorToast = `
                    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1080">
                        <div class="toast show bg-danger text-white">
                            <div class="toast-body">
                                Invalid credentials. Please try again.
                            </div>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', errorToast);
                setTimeout(() => document.querySelector('.toast')?.remove(), 3000);
            }
        });
    });
    // Development bypass configuration
const DEV_MODE = true
const DEV_USERS = [
    {
        username: 'dev',
        password: 'dev123',
        role: 'Developer',
        permissions: ['all']
    },
    {
        username: 'test',
        password: 'test123',
        role: 'Tester',
        permissions: ['read', 'write']
    }
];

// Add this to your login handler
function handleLogin(username, password) {
    // Dev bypass check
    if (DEV_MODE && username === 'dev' && password === 'dev123') {
        console.log('🔧 Developer bypass activated');
        grantAccess({
            name: 'Developer Mode',
            role: 'Super Admin',
            token: 'dev-' + Date.now()
        });
        return true;
    }
}   
