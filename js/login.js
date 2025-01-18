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


    class LoginManager {
        constructor() {
            this.initializeEventListeners();
        }

        initializeEventListeners() {
            const loginForm = document.getElementById('loginForm');
            loginForm?.addEventListener('submit', this.handleLogin.bind(this));

            // Social login buttons
            document.querySelector('.btn-discord')?.addEventListener('click', this.handleDiscordLogin.bind(this));
            document.querySelector('.btn-fivem')?.addEventListener('click', this.handleFiveMLogin.bind(this));
        }

        async handleLogin(e) {
            e.preventDefault();
        
            const username = document.getElementById('username')?.value;
            const password = document.getElementById('password')?.value;

            if (this.validateCredentials(username, password)) {
                const userData = await this.authenticateUser(username, password);
                if (userData) {
                    this.handleSuccessfulLogin(userData);
                }
            }
        }

        validateCredentials(username, password) {
            return username && password;
        }

        async authenticateUser(username, password) {
            // For demo purposes
            if ((username === 'admin' && password === 'admin123') || 
                (username === 'dev' && password === 'dev123')) {
            
                return {
                    name: username === 'admin' ? 'Administrator' : 'Developer',
                    role: username === 'admin' ? 'Admin' : 'Developer',
                    loginTime: new Date().toISOString()
                };
            }
            return null;
        }

        handleSuccessfulLogin(userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
            window.location.href = 'index.html';
        }

        handleDiscordLogin() {
            const clientId = 'YOUR_DISCORD_CLIENT_ID';
            const redirectUri = encodeURIComponent('YOUR_REDIRECT_URI');
            window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;
        }

        handleFiveMLogin() {
            window.location.href = 'YOUR_FIVEM_AUTH_ENDPOINT';
        }
    }

    // Initialize login manager when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        new LoginManager();
    });
