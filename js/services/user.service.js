class UserService {
    static async updateProfile(profileData) {
        return await ApiService.request('users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    static async updateAvatar(formData) {
        return await ApiService.request('users/avatar', {
            method: 'POST',
            body: formData,
            headers: {
                // Remove Content-Type to let browser set it with boundary
                'Content-Type': undefined
            }
        });
    }
}
