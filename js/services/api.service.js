class ApiService {
    static async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}/api/${endpoint}`;
        const token = localStorage.getItem('token');
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers: { ...defaultHeaders, ...options.headers }
            });

            if (!response.ok) {
                throw await response.json();
            }

            return await response.json();
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    static handleError(error) {
        if (error.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }
}
