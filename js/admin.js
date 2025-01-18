class AnalyticsDashboard {
    constructor() {
        this.charts = new Map();
        this.metrics = new Map();
        this.init();
    }

    init() {
        this.checkAdminAccess();
        this.bindEvents();
        this.loadDashboardData();
        this.initializeCharts();
        this.startRealTimeUpdates();
    }

    checkAdminAccess() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!userData.permissions?.includes('admin')) {
            window.location.href = 'index.html';
        }
        this.updateUserInfo(userData);
    }

    updateUserInfo(userData) {
        document.querySelector('.admin-name').textContent = userData.name || 'Admin User';
        document.querySelector('.admin-role').textContent = userData.role || 'Administrator';
    }

    initializeCharts() {
        this.createUserActivityChart();
        this.createResourceUsageChart();
        this.createErrorRateChart();
    }
}    }

    bindEvents() {
        // Navigation handling
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('href').substring(1);
                this.loadSection(section);
            });
        });

        // Button handlers
        document.getElementById('refreshData')?.addEventListener('click', () => {
            this.loadSection(this.currentSection);
        });

        document.getElementById('exportData')?.addEventListener('click', () => {
            this.exportCurrentData();
        });

        document.querySelector('.logout-btn')?.addEventListener('click', () => {
            this.handleLogout();
        });
    }

    async loadDashboardData() {
        const stats = await this.fetchDashboardStats();
        this.updateDashboardStats(stats);
        this.updateActivityLog();
    }

    async fetchDashboardStats() {
        // In production, replace with actual API calls
        return {
            totalUsers: 1250,
            activeProjects: 45,
            systemAlerts: 3,
            uptime: '99.9%',
            recentActivity: [
                { time: '2024-01-20 14:30', user: 'John Doe', action: 'User Login', status: 'Success' },
                { time: '2024-01-20 14:25', user: 'Jane Smith', action: 'File Upload', status: 'Success' },
                { time: '2024-01-20 14:20', user: 'Admin', action: 'System Update', status: 'In Progress' }
            ]
        };
    }

    updateDashboardStats(stats) {
        document.getElementById('totalUsers').textContent = stats.totalUsers;
        document.getElementById('activeProjects').textContent = stats.activeProjects;
        document.getElementById('systemAlerts').textContent = stats.systemAlerts;
        document.getElementById('systemUptime').textContent = stats.uptime;
    }

    initializeCharts() {
        this.charts.userActivity = new Chart(
            document.getElementById('userActivityChart'),
            this.getUserActivityChartConfig()
        );

        this.charts.resourceUsage = new Chart(
            document.getElementById('resourceUsageChart'),
            this.getResourceUsageChartConfig()
        );
    }

    getUserActivityChartConfig() {
        return {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'User Activity',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            }
        };
    }

    getResourceUsageChartConfig() {
        return {
            type: 'doughnut',
            data: {
                labels: ['CPU', 'Memory', 'Storage'],
                datasets: [{
                    data: [30, 50, 20],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ]
                }]
            }
        };
    }

    updateActivityLog() {
        const activityLog = document.getElementById('activityLog');
        // Sample activity data - replace with actual API data
        const activities = [
            { time: '14:30', user: 'John Doe', action: 'Login', status: 'Success' },
            { time: '14:25', user: 'Jane Smith', action: 'File Upload', status: 'Success' },
            { time: '14:20', user: 'Admin', action: 'System Update', status: 'In Progress' }
        ];

        activityLog.innerHTML = activities.map(activity => `
            <tr>
                <td>${activity.time}</td>
                <td>${activity.user}</td>
                <td>${activity.action}</td>
                <td><span class="status-badge ${activity.status.toLowerCase()}">${activity.status}</span></td>
            </tr>
        `).join('');
    }

    startRealTimeUpdates() {
        setInterval(() => {
            this.updateDashboardStats();
            this.updateCharts();
        }, 30000); // Update every 30 seconds
    }

    async loadSection(section) {
        this.currentSection = section;
        document.getElementById('section-title').textContent = 
            section.charAt(0).toUpperCase() + section.slice(1);

        const contentBody = document.querySelector('.content-body');
        contentBody.innerHTML = '<div class="loading">Loading...</div>';

        try {
            const data = await this.fetchSectionData(section);
            contentBody.innerHTML = this.renderSection(section, data);
        } catch (error) {
            contentBody.innerHTML = `<div class="alert alert-danger">Error loading data: ${error.message}</div>`;
        }
    }

    async fetchSectionData(section) {
        // This would be replaced with actual API calls
        const mockData = {
            users: [
                { id: 1, name: 'John Admin', role: 'Administrator', lastLogin: '2023-01-01' },
                { id: 2, name: 'Jane User', role: 'User', lastLogin: '2023-01-02' }
            ],
            permissions: [
                { id: 1, name: 'admin', description: 'Full system access' },
                { id: 2, name: 'read', description: 'Read-only access' }
            ],
            logs: [
                { timestamp: '2023-01-01 12:00:00', action: 'User login', user: 'John Admin' },
                { timestamp: '2023-01-01 12:30:00', action: 'Settings updated', user: 'John Admin' }
            ],
            settings: {
                systemName: 'CRRP Dashboard',
                maintenanceMode: false,
                allowRegistration: true
            }
        };

        return mockData[section] || {};
    }

    renderSection(section, data) {
        switch (section) {
            case 'users':
                return this.renderUsersSection(data);
            case 'permissions':
                return this.renderPermissionsSection(data);
            case 'logs':
                return this.renderLogsSection(data);
            case 'settings':
                return this.renderSettingsSection(data);
            default:
                return this.renderDashboardOverview();
        }
    }

    async exportCurrentData() {
        const data = await this.fetchSectionData(this.currentSection);
        const blob = new Blob([JSON.stringify(data, null, 2)]);
        // ... export handling
    }

    handleLogout() {
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
    }
}
// Add this to your AdminPanel class

async handleAnnouncements() {
    const form = document.getElementById('announcementForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Add null checks for form elements
        const title = document.getElementById('announcementTitle')?.value || '';
        const message = document.getElementById('announcementMessage')?.value || '';
        const priority = document.getElementById('announcementPriority')?.value || '';
        const schedule = document.getElementById('announcementSchedule')?.value || '';
        
        const announcementData = {
            title,
            message,
            priority,
            schedule,
            platforms: {
                discord: document.getElementById('discordTarget')?.checked || false,
                server: document.getElementById('serverTarget')?.checked || false,
                website: document.getElementById('websiteTarget')?.checked || false
            },
            timestamp: new Date().toISOString(),
            author: this.getCurrentAdmin()
        };

        await this.postAnnouncement(announcementData);
        this.updateAnnouncementsLog();
        form.reset();
    };
            async postAnnouncement(data) {
                if (!data || typeof data !== 'object') {
                    throw new Error('Invalid announcement data');
                }
    
                try {
                    const results = await Promise.all([
                        data.platforms.discord && this.sendToDiscord(data),
                        data.platforms.server && this.storeAnnouncement(data),
                        data.platforms.website && this.updateWebsiteAnnouncements(data)
                    ].filter(Boolean));

                    return results.every(result => result === true);
                } catch (error) {
                    console.error('Error posting announcement:', error);
                    throw error;
                }
            }
        }
        async sendToDiscord(data) {
    // Replace with your Discord webhook URL
    const webhookUrl = 'https://discord.com/api/webhooks/1330276010511564841/6WTweXHvq97Y8LVqIAj5Fzr4yVld0HCMJdAioJbmf1P3XwHzCzZAgysD8cZ766XvinPm';
    
    const discordPayload = {
        embeds: [{
            title: data.title,
            description: data.message,
            color: this.getPriorityColor(data.priority),
            footer: {
                text: `Posted by ${data.author}`
            },
            timestamp: data.timestamp
        }]
    };

    await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload)
    });
}

getPriorityColor(priority) {
    const colors = {
        low: 0x00ff00,      // Green
        medium: 0xffff00,    // Yellow
        high: 0xff9900,      // Orange
        urgent: 0xff0000     // Red
    };
    return colors[priority] || colors.medium;
}

async updateAnnouncementsLog() {
    const logContainer = document.getElementById('announcementsLog');
    const announcements = await this.fetchAnnouncements();
    
    logContainer.innerHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Priority</th>
                    <th>Platforms</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${announcements.map(announcement => `
                    <tr>
                        <td>${new Date(announcement.timestamp).toLocaleString()}</td>
                        <td>${announcement.title}</td>
                        <td><span class="badge bg-${announcement.priority}">${announcement.priority}</span></td>
                        <td>${this.getPlatformBadges(announcement.platforms)}</td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="viewAnnouncement(${announcement.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteAnnouncement(${announcement.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

getPlatformBadges(platforms) {
    const badges = [];
    if (platforms.discord) badges.push('<span class="badge bg-primary">Discord</span>');
    if (platforms.server) badges.push('<span class="badge bg-success">Server</span>');
    if (platforms.website) badges.push('<span class="badge bg-info">Website</span>');
    return badges.join(' ');
}

async renderUserManagement() {
    return `
        <div class="user-management-panel">
            <div class="user-list">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="userList"></tbody>
                </table>
            </div>
            <div class="user-actions">
                <button class="btn btn-primary">Add User</button>
                <button class="btn btn-info">Export Users</button>
            </div>
        </div>
    `;
}

class ServerMonitor {
    constructor() {
        this.metrics = {
            cpu: 0,
            memory: 0,
            disk: 0,
            network: 0
        };
    }

    async updateMetrics() {
        // Fetch server metrics
        const metrics = await this.fetchServerMetrics();
        this.updateDashboard(metrics);
    }
}

class AdminRouter {
    constructor() {
        this.routes = {
            users: '/admin/pages/users.html',
            analytics: '/admin/pages/analytics.html',
            reports: '/admin/pages/reports.html',
            settings: '/admin/pages/settings.html'
        };
    }

    navigateTo(page) {
        const route = this.routes[page];
        if (route) {
            this.loadPage(route);
        }
    }

    async loadPage(route) {
        const mainContent = document.querySelector('.admin-content');
        try {
            const response = await fetch(route);
            const content = await response.text();
            mainContent.innerHTML = content;
        } catch (error) {
            console.error('Error loading page:', error);
        }
    }
}
