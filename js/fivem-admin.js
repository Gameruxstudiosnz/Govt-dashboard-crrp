class FiveMAdmin {
    constructor() {
        this.resourceStates = new Map();
        this.playerData = new Map();
        this.init();
    }

    async init() {
        this.initPerformanceMonitoring();
        this.initResourceManager();
        this.initPlayerManager();
        this.initWhitelistSystem();
        this.startRealTimeUpdates();
    }

    initPerformanceMonitoring() {
        // Initialize performance charts
        this.cpuChart = new Chart(
            document.getElementById('cpuChart'),
            this.getPerformanceChartConfig('CPU Usage')
        );
        
        this.memoryChart = new Chart(
            document.getElementById('memoryChart'),
            this.getPerformanceChartConfig('Memory Usage')
        );
        
        this.networkChart = new Chart(
            document.getElementById('networkChart'),
            this.getPerformanceChartConfig('Network Traffic')
        );
    }

    async initResourceManager() {
        const resources = await this.fetchResources();
        this.renderResourceGrid(resources);
        this.bindResourceControls();
    }

    renderResourceGrid(resources) {
        const grid = document.querySelector('.resource-grid');
        grid.innerHTML = resources.map(resource => `
            <div class="resource-card ${resource.status}">
                <h4>${resource.name}</h4>
                <div class="resource-stats">
                    <span>Version: ${resource.version}</span>
                    <span>Author: ${resource.author}</span>
                </div>
                <div class="resource-controls">
                    <button class="btn btn-sm btn-success" onclick="startResource('${resource.name}')">Start</button>
                    <button class="btn btn-sm btn-danger" onclick="stopResource('${resource.name}')">Stop</button>
                    <button class="btn btn-sm btn-warning" onclick="restartResource('${resource.name}')">Restart</button>
                </div>
            </div>
        `).join('');
    }

    async initPlayerManager() {
        this.setupPlayerFilters();
        this.startPlayerMonitoring();
    }

    async initWhitelistSystem() {
        this.loadWhitelistConfig();
        this.setupWhitelistControls();
    }

    startRealTimeUpdates() {
        setInterval(() => {
            this.updatePerformanceMetrics();
            this.updatePlayerList();
            this.updateResourceStates();
        }, 5000); // Update every 5 seconds
    }

    async updatePerformanceMetrics() {
        const metrics = await this.fetchServerMetrics();
        this.updateCharts(metrics);
    }

    updateCharts(metrics) {
        this.cpuChart.data.datasets[0].data = metrics.cpu;
        this.memoryChart.data.datasets[0].data = metrics.memory;
        this.networkChart.data.datasets[0].data = metrics.network;
        
        this.cpuChart.update();
        this.memoryChart.update();
        this.networkChart.update();
    }

    async handleResourceAction(resourceName, action) {
        try {
            await fetch(`/api/fivem/resources/${resourceName}/${action}`, {
                method: 'POST'
            });
            this.showNotification(`Resource ${action} successful`, 'success');
        } catch (error) {
            this.showNotification(`Failed to ${action} resource`, 'error');
        }
    }

    async handlePlayerAction(playerId, action) {
        try {
            await fetch(`/api/fivem/players/${playerId}/${action}`, {
                method: 'POST'
            });
            this.showNotification(`Player ${action} successful`, 'success');
        } catch (error) {
            this.showNotification(`Failed to ${action} player`, 'error');
        }
    }
}
