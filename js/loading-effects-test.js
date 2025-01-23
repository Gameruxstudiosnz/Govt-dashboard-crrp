class EmergencyLoaderTestMenu {
    constructor() {
        this.loader = new EmergencyLoader();
        this.createTestMenu();
    }

    createTestMenu() {
        const menu = document.createElement('div');
        menu.className = 'test-menu';
        menu.innerHTML = `
            <div class="test-panel">
                <h3>Emergency Loader Test Panel</h3>
                
                <div class="test-section">
                    <h4>Loading States</h4>
                    <button onclick="testMenu.toggleLoader()">Toggle Loading Bar</button>
                </div>

                <div class="test-section">
                    <h4>Easter Egg Effects</h4>
                    <button onclick="testMenu.triggerEffect('sirenMode')">Test Siren Mode</button>
                    <button onclick="testMenu.triggerEffect('dispatchMode')">Test Dispatch Mode</button>
                    <button onclick="testMenu.triggerEffect('pursuitMode')">Test Pursuit Mode</button>
                    <button onclick="testMenu.triggerEffect('fireMode')">Test Fire Mode</button>
                </div>

                <div class="test-section">
                    <h4>Sound Tests</h4>
                    <button onclick="testMenu.testSound('siren')">Test Siren Sound</button>
                    <button onclick="testMenu.testSound('radio-static')">Test Radio Static</button>
                    <button onclick="testMenu.testSound('engine-rev')">Test Engine Rev</button>
                </div>
            </div>
        `;

        // Add styles for the test menu
        const styles = document.createElement('style');
        styles.textContent = `
            .test-menu {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            }
            
            .test-panel {
                background: #2c3e50;
                color: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                width: 300px;
            }
            
            .test-section {
                margin: 15px 0;
                padding: 10px;
                border-top: 1px solid #34495e;
            }
            
            .test-panel button {
                display: block;
                width: 100%;
                margin: 5px 0;
                padding: 8px;
                background: #3498db;
                border: none;
                border-radius: 4px;
                color: white;
                cursor: pointer;
                transition: background 0.3s;
            }
            
            .test-panel button:hover {
                background: #2980b9;
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(menu);
        
        // Make testMenu globally accessible
        window.testMenu = this;
    }

    toggleLoader() {
        if (this.loader.isLoading) {
            this.loader.hideLoader();
        } else {
            this.loader.showLoader();
        }
    }

    triggerEffect(effectName) {
        this.loader.triggerEffect(effectName);
    }

    testSound(soundName) {
        this.loader.playSound(soundName);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new EmergencyLoaderTestMenu();
});
