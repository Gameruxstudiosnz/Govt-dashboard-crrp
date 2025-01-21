class LoadingStateManager {
    constructor() {
        this.loadingContainer = document.getElementById('loadingStates');
    }

    showLoading(message = 'Loading...') {
        this.loadingContainer.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">${message}</span>
                </div>
                <p class="loading-text">${message}</p>
            </div>
        `;
        this.loadingContainer.style.display = 'flex';
    }

    hideLoading() {
        this.loadingContainer.style.display = 'none';
    }
}
