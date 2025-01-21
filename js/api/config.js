const isProd = window.location.hostname !== 'localhost';

const API_CONFIG = {
    BASE_URL: isProd 
        ? 'https://your-api-domain.com'
        : 'http://localhost:5500',
    VERSION: 'v1',
    ENDPOINTS: {
        documents: '/documents',
        users: '/users',
        departments: '/departments'
    },
    AUTH: {
        tokenKey: 'auth_token',
        refreshKey: 'refresh_token'
    },
    TIMEOUTS: {
        default: 5000,
        upload: 30000
    }
};

// Freeze the config to prevent modifications
Object.freeze(API_CONFIG);

// Export for module usage
export default API_CONFIG;