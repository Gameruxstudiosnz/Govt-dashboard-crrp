class AuthService {
    static async login(credentials) {
        const response = await ApiService.request('auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.token) {
            localStorage.setItem('token', response.token);
            return response;
        }
    }

    static async register(userData) {
        return await ApiService.request('auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async discordAuth(code) {
        return await ApiService.request('auth/discord', {
            method: 'POST',
            body: JSON.stringify({ code })
        });
    }

    static async fivemAuth(ticket) {
        return await ApiService.request('auth/fivem', {
            method: 'POST',
            body: JSON.stringify({ ticket })
        });
    }
}
