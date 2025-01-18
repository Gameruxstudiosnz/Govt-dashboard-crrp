// Authentication API endpoints
const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    DISCORD_AUTH: '/api/auth/discord',
    FIVEM_AUTH: '/api/auth/fivem',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESET_PASSWORD: '/api/auth/reset-password',
    
    // User management
    UPDATE_PROFILE: '/api/users/profile',
    UPDATE_AVATAR: '/api/users/avatar',
    UPDATE_SETTINGS: '/api/users/settings',
    UPDATE_PASSWORD: '/api/users/password',
    ENABLE_2FA: '/api/users/2fa/enable',
    VERIFY_2FA: '/api/users/2fa/verify',
    
    // Session management
    REFRESH_TOKEN: '/api/auth/refresh-token',
    CHECK_SESSION: '/api/auth/check-session'
};
