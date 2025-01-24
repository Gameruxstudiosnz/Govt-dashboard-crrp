export class DiscordProfileService {
    static logApiCalls = true;

    static async getProfile(discordId) {
        if(this.logApiCalls) {
            console.log('Fetching profile for ID:', discordId);
        }
        const response = await fetch(`/api/users/${discordId}/discord-profile`);
        
        // Add response type checking
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError('Received non-JSON response from server');
        }
        
        return await response.json();
    }

    static async updateStaffProfiles() {
        const staffCards = document.querySelectorAll('.staff-card');
        
        for(const card of staffCards) {
            try {
                card.classList.add('loading');
                const discordId = card.dataset.discordId;
                const profile = await this.getProfile(discordId);
                
                if(profile) {
                    card.querySelector('.staff-image img').src = profile.avatarUrl;
                    card.querySelector('.discord-tag').textContent = profile.tag;
                }
            } catch(error) {
                console.error('Failed to load profile:', error);
                card.classList.add('error');
            } finally {
                card.classList.remove('loading');
            }
        }
    }
}
// Call the test function if neededDiscordProfileService.testProfileFetch();