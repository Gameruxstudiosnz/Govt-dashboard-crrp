class DiscordAnnouncements {
    constructor(channelId, botToken) {
        this.channelId = channelId;
        this.botToken = botToken;
        this.feedElement = document.querySelector('.announcements-feed');
    }

    async fetchAnnouncements() {
        try {
            const response = await fetch(`https://discord.com/api/channels/${this.channelId}/messages`, {
                headers: {
                    'Authorization': `Bot ${this.botToken}`
                }
            });
            const messages = await response.json();
            this.displayAnnouncements(messages);
        } catch (error) {
            console.error('Failed to fetch announcements:', error);
            this.showErrorState();
        }
    }

    displayAnnouncements(messages) {
        this.feedElement.innerHTML = messages
            .map(msg => this.createAnnouncementHTML(msg))
            .join('');
    }

    createAnnouncementHTML(message) {
        return `
            <div class="announcement">
                <div class="announcement-header">
                    <span class="announcement-author">${message.author.username}</span>
                    <span class="announcement-timestamp">${this.formatDate(message.timestamp)}</span>
                </div>
                <div class="announcement-content">${message.content}</div>
            </div>
        `;
    }

    formatDate(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    showErrorState() {
        const status = document.querySelector('.discord-status');
        status.classList.remove('online');
        status.classList.add('offline');
        status.textContent = 'Discord Disconnected';
    }

    init() {
        this.fetchAnnouncements();
        // Refresh announcements every 5 minutes
        setInterval(() => this.fetchAnnouncements(), 300000);
    }
}

// Initialize the announcements
const announcements = new DiscordAnnouncements('YOUR_CHANNEL_ID', 'YOUR_BOT_TOKEN');
announcements.init();
