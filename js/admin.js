class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.checkAdminAccess();
        this.bindEvents();
        this.loadDashboardData();
    }

    checkAdminAccess() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!userData.permissions?.includes('admin')) {
            window.location.href = 'index.html';
        }
    }

    bindEvents() {
        // Navigation handling
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('href').substring(1);
                this.loadSection(section);
            });
        });

        // Refresh button
        document.getElementById('refreshData')?.addEventListener('click', () => {
            this.loadSection(this.currentSection);
        });
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

    // Add specific render methods for each section...
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});
