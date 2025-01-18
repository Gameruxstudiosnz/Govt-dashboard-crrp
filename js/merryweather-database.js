class MerryweatherDatabase {
    constructor() {
        this.initializeDatabase();
        this.setupEventListeners();
    }

    initializeDatabase() {
        // Database connection setup
        this.accessLevel = 'SECURITY_CONTRACTOR';
        this.permissions = ['PLATE_CHECK', 'CIV_CHECK', 'CRIMINAL_HISTORY'];
    }

    setupDatabasePanel() {
        const databaseHTML = `
            <div class="panel database-panel">
                <h2>Database Access</h2>
                
                <!-- Plate Check Section -->
                <div class="search-section">
                    <h3>Plate Lookup</h3>
                    <div class="search-box">
                        <input type="text" id="plateSearch" placeholder="Enter Plate Number">
                        <button class="btn btn-primary" id="runPlate">
                            <i class="fas fa-search"></i> Run Plate
                        </button>
                    </div>
                </div>

                <!-- Civilian Check Section -->
                <div class="search-section">
                    <h3>Civilian Lookup</h3>
                    <div class="search-box">
                        <input type="text" id="firstNameSearch" placeholder="First Name">
                        <input type="text" id="lastNameSearch" placeholder="Last Name">
                        <input type="text" id="dobSearch" placeholder="DOB (MM/DD/YYYY)">
                        <button class="btn btn-primary" id="runCivilian">
                            <i class="fas fa-user-check"></i> Run Check
                        </button>
                    </div>
                </div>

                <!-- Results Display -->
                <div class="results-section">
                    <div id="searchResults" class="results-container"></div>
                </div>
            </div>
        `;

        // Insert into Merryweather interface
        document.querySelector('.mw-interface').insertAdjacentHTML('beforeend', databaseHTML);
    }

    async runPlateCheck(plate) {
        try {
            const response = await fetch('/api/security/plate-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getSecurityToken()}`
                },
                body: JSON.stringify({ plate })
            });

            const data = await response.json();
            this.displayResults(data, 'plate');
        } catch (error) {
            this.handleError(error);
        }
    }

    async runCivilianCheck(firstName, lastName, dob) {
        try {
            const response = await fetch('/api/security/civilian-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getSecurityToken()}`
                },
                body: JSON.stringify({ firstName, lastName, dob })
            });

            const data = await response.json();
            this.displayResults(data, 'civilian');
        } catch (error) {
            this.handleError(error);
        }
    }

    displayResults(data, type) {
        const resultsContainer = document.getElementById('searchResults');
        let resultsHTML = '';

        if (type === 'plate') {
            resultsHTML = `
                <div class="result-card">
                    <h4>Vehicle Information</h4>
                    <p>Plate: ${data.plate}</p>
                    <p>Make: ${data.make}</p>
                    <p>Model: ${data.model}</p>
                    <p>Year: ${data.year}</p>
                    <p>Owner: ${data.owner}</p>
                    <p>Status: ${data.status}</p>
                    ${data.flags ? `<p class="alert alert-warning">Flags: ${data.flags}</p>` : ''}
                </div>
            `;
        } else if (type === 'civilian') {
            resultsHTML = `
                <div class="result-card">
                    <h4>Civilian Information</h4>
                    <p>Name: ${data.firstName} ${data.lastName}</p>
                    <p>DOB: ${data.dob}</p>
                    <p>Address: ${data.address}</p>
                    <p>License Status: ${data.licenseStatus}</p>
                    ${data.warrants ? `<p class="alert alert-danger">Active Warrants: ${data.warrants}</p>` : ''}
                    ${data.notes ? `<p class="alert alert-info">Notes: ${data.notes}</p>` : ''}
                </div>
            `;
        }

        resultsContainer.innerHTML = resultsHTML;
    }

    setupEventListeners() {
        document.getElementById('runPlate')?.addEventListener('click', () => {
            const plate = document.getElementById('plateSearch').value;
            if (plate) this.runPlateCheck(plate);
        });

        document.getElementById('runCivilian')?.addEventListener('click', () => {
            const firstName = document.getElementById('firstNameSearch').value;
            const lastName = document.getElementById('lastNameSearch').value;
            const dob = document.getElementById('dobSearch').value;
            if (firstName && lastName) this.runCivilianCheck(firstName, lastName, dob);
        });
    }
}

// Initialize the database system
const mwDatabase = new MerryweatherDatabase();
