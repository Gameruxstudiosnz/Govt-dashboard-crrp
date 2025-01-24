// Import the service module
import { DiscordProfileService } from './discord-profile.service.js';

// Add named function for better error tracking
const initializeDiscordProfiles = async () => {
    try {
        await DiscordProfileService.updateStaffProfiles();
        console.log('Discord profiles loaded successfully');
    } catch (error) {
        console.error('Failed to initialize Discord profiles:', error);
    }
};

// Use named function in event listener
document.addEventListener('DOMContentLoaded', initializeDiscordProfiles);
