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

document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    loadBotSettings();

    // Save settings handler
    document.getElementById('saveSettings').addEventListener('click', saveBotSettings);
});

function loadBotSettings() {
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
    document.getElementById('botPrefix').value = settings.prefix;
    document.getElementById('defaultLang').value = settings.defaultLang;
    document.getElementById('autoMod').checked = settings.autoMod;
    document.getElementById('spamThreshold').value = settings.spamThreshold;
    document.getElementById('welcomeMsg').value = settings.welcomeMsg;
    document.getElementById('welcomeChannel').value = settings.welcomeChannel;
    document.getElementById('enableLogs').checked = settings.enableLogs;
    document.getElementById('logChannel').value = settings.logChannel;
}

function saveBotSettings() {
    const settings = {
        prefix: document.getElementById('botPrefix').value,
        defaultLang: document.getElementById('defaultLang').value,
        autoMod: document.getElementById('autoMod').checked,
        spamThreshold: document.getElementById('spamThreshold').value,
        welcomeMsg: document.getElementById('welcomeMsg').value,
        welcomeChannel: document.getElementById('welcomeChannel').value,
        enableLogs: document.getElementById('enableLogs').checked,
        logChannel: document.getElementById('logChannel').value
    };

    // Send settings to API
    console.log('Saving settings:', settings);
    
    // Show success message
    showNotification('Settings saved successfully!');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add these functions to handle button clicks
function openLoginModal() {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

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

// Add event listeners when document loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize modals
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const profileModal = new bootstrap.Modal(document.getElementById('userProfileModal'));

    // Handle login form submission
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your login logic here
        loginModal.hide();
    });

    // Handle profile form submission
    document.getElementById('profileForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your profile update logic here
        profileModal.hide();
    });
});
