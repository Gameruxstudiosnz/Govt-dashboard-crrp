class SettingsManager {
    constructor() {
        this.currentTab = 'general';
        this.settingsData = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSettings();
        this.initializeTooltips();
        this.setupValidation();
    }

    bindEvents() {
        // Tab Navigation
        document.querySelectorAll('.nav-link').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(e.target.getAttribute('href').substring(1));
            });
        });

        // Save Settings
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        // Reset Settings
        document.getElementById('resetSettings').addEventListener('click', () => {
            this.resetSettings();
        });

        // Form Change Detection
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('change', () => {
                this.markUnsavedChanges();
            });
        });
    }

    async loadSettings() {
        try {
            const response = await fetch('/api/settings');
            this.settingsData = await response.json();
            this.populateFields();
        } catch (error) {
            this.showNotification('Error loading settings', 'error');
        }
    }

    populateFields() {
        Object.entries(this.settingsData).forEach(([key, value]) => {
            const element = document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        });
    }

    async saveSettings() {
        const formData = this.gatherFormData();
        
        if (this.validateSettings(formData)) {
            try {
                const response = await fetch('/api/settings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    this.showNotification('Settings saved successfully', 'success');
                    this.clearUnsavedChanges();
                }
            } catch (error) {
                this.showNotification('Error saving settings', 'error');
            }
        }
    }

    gatherFormData() {
        const formData = {};
        document.querySelectorAll('form').forEach(form => {
            const formElements = new FormData(form);
            formElements.forEach((value, key) => {
                formData[key] = value;
            });
        });
        return formData;
    }

    validateSettings(data) {
        let isValid = true;
        
        // System Name Validation
        if (!data.systemName || data.systemName.length < 3) {
            this.showFieldError('systemName', 'System name must be at least 3 characters');
            isValid = false;
        }

        // Session Timeout Validation
        if (data.sessionTimeout && (data.sessionTimeout < 5 || data.sessionTimeout > 120)) {
            this.showFieldError('sessionTimeout', 'Session timeout must be between 5 and 120 minutes');
            isValid = false;
        }

        // Discord Webhook Validation
        if (data.discordWebhook && !this.isValidUrl(data.discordWebhook)) {
            this.showFieldError('discordWebhook', 'Please enter a valid webhook URL');
            isValid = false;
        }

        return isValid;
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        field.classList.add('is-invalid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            this.loadDefaultSettings();
        }
    }

    async loadDefaultSettings() {
        try {
            const response = await fetch('/api/settings/default');
            const defaultSettings = await response.json();
            this.settingsData = defaultSettings;
            this.populateFields();
            this.showNotification('Settings reset to default', 'success');
        } catch (error) {
            this.showNotification('Error resetting settings', 'error');
        }
    }

    switchTab(tabId) {
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(tab => {
            tab.classList.remove('active');
        });

        document.getElementById(tabId).classList.add('active');
        document.querySelector(`[href="#${tabId}"]`).classList.add('active');
        this.currentTab = tabId;
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    markUnsavedChanges() {
        document.getElementById('saveSettings').classList.add('btn-warning');
        window.onbeforeunload = () => '';
    }

    clearUnsavedChanges() {
        document.getElementById('saveSettings').classList.remove('btn-warning');
        window.onbeforeunload = null;
    }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
});

class FiveMServerSettings extends SettingsManager {
    constructor() {
        super();
        this.serverConfig = {
            maxPlayers: 32,
            serverName: "CRRP Development",
            gameType: "Roleplay",
            mapName: "Los Santos",
            oneSync: true
        };
        this.initFiveMSettings();
    }

    initFiveMSettings() {
        this.loadServerConfig();
        this.bindFiveMEvents();
        this.setupResourceManager();
    }

    async loadServerConfig() {
        // Load FiveM specific configurations
        const config = await this.fetchServerConfig();
        this.updateServerSettings(config);
    }

    setupResourceManager() {
        // Handle server resources
        this.monitorResourceStatus();
        this.handleResourceRestarts();
    }

    async updateServerSettings(config) {
        // Update server.cfg dynamically
        // Handle resource management
        // Configure OneSync settings
    }
}
