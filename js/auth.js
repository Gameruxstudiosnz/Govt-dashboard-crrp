class AuthManager {
    constructor() {
        this.initNavigation();
        this.checkAuthStatus();
    }

    initNavigation() {
        const loginTrigger = document.getElementById('login-trigger');
        if (loginTrigger) {
            loginTrigger.addEventListener('click', () => {
                window.location.href = '/login.html';
            });
        }
    }

    checkAuthStatus() {
        const token = localStorage.getItem('auth_token');
        if (!token && window.location.pathname !== '/login.html') {
            window.location.href = '/login.html';
        } else if (token && window.location.pathname === '/login.html') {
            window.location.href = '/index.html';
        }
    }
}

checkCSSIntegrity() {
    const cssResults = verifyCSSLinks();
    if (cssResults.some(result => !result.valid)) {
        console.warn('Some CSS files failed to load correctly');
    }
}
