class Dashboard {
    constructor() {
        this.stats = {};
        this.charts = {};
        this.init();
    }

    async init() {
        await this.fetchStats();
        this.initCharts();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.initJobManagement();
    }

    async fetchStats() {
        const response = await fetch('/api/stats');
        this.stats = await response.json();
        this.updateDashboard();
    }

    initCharts() {
        // Initialize charts with Chart.js
        this.charts.services = new Chart(
            document.getElementById('services-chart'),
            this.getServiceChartConfig()
        );
        
        this.charts.budget = new Chart(
            document.getElementById('budget-chart'),
            this.getBudgetChartConfig()
        );
    }

    startRealTimeUpdates() {
        const ws = new WebSocket('ws://localhost:3000/updates');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.updateLiveStats(data);
        };
    }

    initJobManagement() {
        this.jobPanel = new JobManagementPanel({
            container: document.getElementById('job-management'),
            onJobUpdate: this.handleJobUpdate.bind(this)
        });
    }

    async handleJobUpdate(playerData) {
        const response = await fetch('/api/jobs/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerData)
        });
        
        if (response.ok) {
            this.showNotification('Job updated successfully');
            this.refreshJobsList();
        }
    }
}

class JobManagementPanel {
    constructor(options) {
        this.container = options.container;
        this.onJobUpdate = options.onJobUpdate;
        this.render();
    }

    async render() {
        const jobs = await this.fetchAvailableJobs();
        const players = await this.fetchOnlinePlayers();
        
        this.container.innerHTML = `
            <div class="job-management-panel">
                <h2>Job Management</h2>
                <div class="player-select">
                    <select id="player-list">
                        ${players.map(p => `
                            <option value="${p.id}">${p.name} (${p.id})</option>
                        `).join('')}
                    </select>
                </div>
                <div class="job-select">
                    <select id="job-list">
                        ${jobs.map(job => `
                            <option value="${job.name}">${job.label}</option>
                        `).join('')}
                    </select>
                    <select id="grade-list"></select>
                </div>
                <button id="update-job" class="btn-primary">Update Job</button>
            </div>
        `;
        
        this.attachEventListeners();
    }
}

// Central event handler for all dashboard functionality
class DashboardManager {
    constructor() {
        this.initializeComponents();
        this.setupEventListeners();
    }

    initializeComponents() {
        // Initialize all modals
        this.loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        this.profileModal = new bootstrap.Modal(document.getElementById('userProfileModal'));
        
        // Initialize user state
        this.checkAuthState();
    }

    setupEventListeners() {
        // Global event listeners
        document.addEventListener('userLoggedIn', () => this.handleUserLogin());
        document.addEventListener('userLoggedOut', () => this.handleUserLogout());
    }

    checkAuthState() {
        const token = localStorage.getItem('authToken');
        if (token) {
            this.handleUserLogin();
        }
    }

    handleUserLogin() {
        // Update UI for logged-in state
        document.querySelectorAll('.auth-dependent').forEach(el => {
            el.style.display = 'block';
        });
    }

    handleUserLogout() {
        // Update UI for logged-out state
        document.querySelectorAll('.auth-dependent').forEach(el => {
            el.style.display = 'none';
        });
    }
}

// Initialize dashboard
const dashboard = new DashboardManager();

// Security measures for frontend
class SecurityManager {
    constructor() {
        this.validateHost();
        this.initCSRFProtection();
        this.setupSecureHeaders();
    }

    validateHost() {
        if (!window.location.origin.includes(Config.Dashboard.domain)) {
            window.location = Config.Dashboard.domain;
        }
    }

    initCSRFProtection() {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }

    setupSecureHeaders() {
        // Content Security Policy
        const meta = document.createElement('meta');
        meta.httpEquiv = "Content-Security-Policy";
        meta.content = "default-src 'self'; script-src 'self'";
        document.head.appendChild(meta);
    }
}

// Main dashboard initialization
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

document.addEventListener('DOMContentLoaded', () => {
    // Handle main login form
    const mainLoginForm = document.getElementById('mainLoginForm');
    const modalLoginForm = document.getElementById('modalLoginForm');

    const handleLogin = (e) => {
        e.preventDefault();
        const form = e.target;
        const username = form.querySelector('#username').value;
        const password = form.querySelector('#password').value;
        
        // Validate credentials
        if ((username === 'admin' && password === 'admin123') || 
            (username === 'dev' && password === 'dev123')) {
            
            handleSuccessfulLogin(username);
        }
    };

    mainLoginForm?.addEventListener('submit', handleLogin);
    modalLoginForm?.addEventListener('submit', handleLogin);
});
function handleSuccessfulLogin(username) {
    const userData = {
        name: username === 'admin' ? 'Administrator' : 'Developer',
        role: username === 'admin' ? 'Admin' : 'Developer',
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    updateUIAfterLogin(userData);
}

function updateUIAfterLogin(userData) {
    document.querySelector('.login-welcome')?.style.display = 'none';
    document.querySelector('.dashboard-container')?.style.display = 'flex';
    
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.innerHTML = `
            <span class="user-name">${userData.name}</span>
            <span class="badge bg-primary">${userData.role}</span>
        `;
    }
    
    showLoginSuccessToast(userData.name);
}
function loadBotSettings() {
    // Safe element access with null checking
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.value = 'default settings';
        // Additional settings logic
    }

    // Fetch settings from API/localStorage
    const settings = {
        prefix: '!',
        defaultLang: 'en',
        autoMod: true,
        spamThreshold: 5,
        welcomeMsg: 'Welcome {user} to {server}!',
        welcomeChannel: 'welcome',
        enableLogs: true,
        logChannel: 'mod-logs'
    };

    // Populate form fields
    // Best practice - using optional chaining
    document.getElementById('botPrefix')?.value = settings.prefix;

    // Alternative approaches:
    // Using nullish coalescing
    const prefixElement = document.getElementById('botPrefix');
    if (prefixElement) {
        prefixElement.value = settings.prefix;
    }

    // Using type-safe querySelector
    const prefixInput = document.querySelector('input#botPrefix');
    if (prefixInput instanceof HTMLInputElement) {
        prefixInput.value = settings.prefix;
    }    document.getElementById('defaultLang')?.value = settings.defaultLang;
    document.getElementById('autoMod')?.checked = settings.autoMod;
    document.getElementById('spamThreshold')?.value = settings.spamThreshold;
    document.getElementById('welcomeMsg')?.value = settings.welcomeMsg;
    document.getElementById('welcomeChannel')?.value = settings.welcomeChannel;
    document.getElementById('enableLogs')?.checked = settings.enableLogs;
    document.getElementById('logChannel')?.value = settings.logChannel;

    // Save settings handler
    document.getElementById('saveSettings')?.addEventListener('click', saveBotSettings);
}

function showFallbackContent() {
    const container = document.querySelector('.dashboard-container');
    if (container) {
        container.innerHTML = `
            <div class="fallback-content">
                <h2>Loading Dashboard...</h2>
            </div>
        `;
    }
}

function saveBotSettings() {
    const settings = {
        prefix: document.getElementById('botPrefix')?.value,
        defaultLang: document.getElementById('defaultLang')?.value,
        autoMod: document.getElementById('autoMod')?.checked,
        spamThreshold: document.getElementById('spamThreshold')?.value,
        welcomeMsg: document.getElementById('welcomeMsg')?.value,
        welcomeChannel: document.getElementById('welcomeChannel')?.value,
        enableLogs: document.getElementById('enableLogs')?.checked,
        logChannel: document.getElementById('logChannel')?.value
    };

    // Send settings to API
    console.log('Saving settings:', settings);
    
    // Show success message
    showNotification('Settings saved successfully!');
}

// Make function globally available on window object
window.openLoginModal = function() {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
};

function openProfileModal() {
    const profileModal = new bootstrap.Modal(document.getElementById('userProfileModal'));
    profileModal.show();
}

// Add this to your header section where the buttons are
document.querySelector('.user-profile').innerHTML = `
    <button onclick="openLoginModal()" class="btn btn-primary">
        <i class="fas fa-sign-in-alt"></i> Login
    </button>
    <button onclick="openProfileModal()" class="btn btn-secondary">
        <i class="fas fa-user-edit"></i> Profile
    </button>
    <button class="btn btn-info">
        <i class="fas fa-user-shield"></i> Admin
    </button>
`;

// Add these functions to your existing dashboard.js

// Discord Login Handler
document.querySelector('.btn-discord').addEventListener('click', function() {
    const clientId = 'YOUR_DISCORD_CLIENT_ID';
    const redirectUri = encodeURIComponent('YOUR_REDIRECT_URI');
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;
    
    window.location.href = discordAuthUrl;
});

// FiveM Login Handler
document.querySelector('.btn-fivem').addEventListener('click', function() {
    // Replace with your FiveM authentication endpoint
    const fivemAuthUrl = 'YOUR_FIVEM_AUTH_ENDPOINT';
    
    // You can either redirect or handle via popup
    window.location.href = fivemAuthUrl;
});

// Add these functions to your dashboard.js

function showRegistrationModal() {
    const registrationModal = new bootstrap.Modal(document.getElementById('registrationModal'));
    registrationModal.show();
}

document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const fullName = document.getElementById('regFullName').value;
    const email = document.getElementById('regEmail').value;
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Basic validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Here you would typically send this data to your backend
    const userData = {
        fullName,
        email,
        username,
        password
    };
    
    // Example API call (replace with your actual endpoint)
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Account created successfully! Please login.');
            const registrationModal = bootstrap.Modal.getInstance(document.getElementById('registrationModal'));
            registrationModal.hide();
        } else {
            alert(data.message || 'Registration failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    });
});
