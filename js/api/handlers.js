class ApiService {
    static async login(credentials) {
        return await this.apiCall(API_ENDPOINTS.LOGIN, 'POST', credentials);
    }

    static async register(userData) {
        return await this.apiCall(API_ENDPOINTS.REGISTER, 'POST', userData);
    }

    static async updateProfile(profileData) {
        return await this.apiCall(API_ENDPOINTS.UPDATE_PROFILE, 'PUT', profileData);
    }

    static async updateAvatar(formData) {
        return await this.apiCall(API_ENDPOINTS.UPDATE_AVATAR, 'POST', formData);
    }

    static async updateSettings(settings) {
        return await this.apiCall(API_ENDPOINTS.UPDATE_SETTINGS, 'PUT', settings);
    }

    static async changePassword(passwordData) {
        return await this.apiCall(API_ENDPOINTS.UPDATE_PASSWORD, 'PUT', passwordData);
    }

    static async enable2FA() {
        return await this.apiCall(API_ENDPOINTS.ENABLE_2FA, 'POST');
    }

    static async verify2FA(code) {
        return await this.apiCall(API_ENDPOINTS.VERIFY_2FA, 'POST', { code });
    }

    static async apiCall(endpoint, method, data) {
        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: data ? JSON.stringify(data) : undefined
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'API call failed');
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}
