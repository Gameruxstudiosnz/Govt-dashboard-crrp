class SystemStatusChecker {
    constructor() {
        this.statusDot = document.querySelector('.status-dot');
        this.statusText = document.querySelector('.status-text');
        this.lastChecked = document.getElementById('lastChecked');
        this.responseTime = document.getElementById('responseTime');
        
        this.checkStatus();
        this.startPeriodicCheck();
        
        // Add new button handlers
        this.initializeButtons();
    }

    initializeButtons() {
        const restartBtn = document.getElementById('restartApi');
        const refreshBtn = document.getElementById('refreshStatus');

        restartBtn.addEventListener('click', () => this.restartApiService());
        refreshBtn.addEventListener('click', () => this.checkStatus());
    }

    async checkStatus() {
        const startTime = performance.now();
        
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
            const endTime = performance.now();
            
            if (response.ok) {
                this.updateStatus('online', endTime - startTime);
            } else {
                this.updateStatus('error');
            }
        } catch (error) {
            this.updateStatus('offline');
        }
    }

    updateStatus(status, responseTimeMs) {
        const statusMap = {
            online: { class: 'status-online', text: 'Operational' },
            offline: { class: 'status-offline', text: 'Offline' },
            error: { class: 'status-error', text: 'Error' }
        };

        this.statusDot.className = `status-dot ${statusMap[status].class}`;
        this.statusText.textContent = statusMap[status].text;
        this.lastChecked.textContent = new Date().toLocaleString();
        
        if (responseTimeMs) {
            this.responseTime.textContent = `${Math.round(responseTimeMs)}ms`;
        } else {
            this.responseTime.textContent = '-';
        }
    }

    startPeriodicCheck() {
        setInterval(() => this.checkStatus(), 30000); // Check every 30 seconds
    }

    async restartApiService() {
        const restartBtn = document.getElementById('restartApi');
        restartBtn.disabled = true;
        restartBtn.innerHTML = '<span class="icon">🔄</span> Restarting...';

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/admin/restart`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                }
            });

            if (response.ok) {
                this.showNotification('API service restart initiated', 'success');
                // Check status after a delay to allow for restart
                setTimeout(() => this.checkStatus(), 5000);
            } else {
                throw new Error('Restart failed');
            }
        } catch (error) {
            this.showNotification('Failed to restart API service', 'error');
        } finally {
            restartBtn.disabled = false;
            restartBtn.innerHTML = '<span class="icon">🔄</span> Restart API Service';
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}
// Initialize the status checker
document.addEventListener('DOMContentLoaded', () => {
    new SystemStatusChecker();
});
