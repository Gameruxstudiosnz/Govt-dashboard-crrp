const isProd = window.location.hostname !== 'localhost';

const API_CONFIG = {
    BASE_URL: isProd 
        ? 'https://your-api-domain.com'
        : 'http://localhost:5000',
    VERSION: 'v1'
};

export default API_CONFIG;