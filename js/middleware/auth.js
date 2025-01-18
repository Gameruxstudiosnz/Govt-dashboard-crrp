class AuthMiddleware {
    static async checkAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }

        try {
            const response = await fetch(API_ENDPOINTS.CHECK_SESSION, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                this.handleUnauthorized();
                return false;
            }

            return true;
        } catch (error) {
            this.handleUnauthorized();
            return false;
        }
    }

    static async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await fetch(API_ENDPOINTS.REFRESH_TOKEN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    static handleUnauthorized() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }
}
