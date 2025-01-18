class CADManager {
    constructor() {
        this.activeUnits = new Map();
        this.activeCalls = new Map();
        this.dispatchQueue = [];
        this.init();
    }

    init() {
        this.setupWebSocket();
        this.bindEvents();
        this.loadInitialState();
    }

    setupWebSocket() {
        this.socket = new WebSocket('ws://your-cad-server/dispatch');
        this.socket.onmessage = (event) => this.handleDispatchMessage(event);
    }

    handleDispatchMessage(event) {
        const data = JSON.parse(event.data);
        switch(data.type) {
            case 'UNIT_STATUS_UPDATE':
                this.updateUnitStatus(data.unit);
                break;
            case 'NEW_CALL':
                this.addNewCall(data.call);
                break;
            case 'CALL_COMPLETED':
                this.resolveCall(data.callId);
                break;
        }
    }

    updateUnitStatus(unit) {
        this.activeUnits.set(unit.id, unit);
        this.renderUnitStatus(unit);
    }

    addNewCall(call) {
        this.activeCalls.set(call.id, call);
        this.renderCallCard(call);
    }

    renderUnitStatus(unit) {
        const unitElement = document.createElement('div');
        unitElement.className = `unit-card status-${unit.status}`;
        unitElement.innerHTML = `
            <h4>${unit.callSign}</h4>
            <p>Status: ${unit.status}</p>
            <p>Location: ${unit.location}</p>
            <div class="unit-actions">
                <button onclick="cadManager.assignCall(${unit.id})">Assign Call</button>
                <button onclick="cadManager.setUnitStatus(${unit.id}, 'OFF_DUTY')">End Shift</button>
            </div>
        `;
        document.querySelector('.active-units').appendChild(unitElement);
    }
}

// Initialize CAD manager
const cadManager = new CADManager();
