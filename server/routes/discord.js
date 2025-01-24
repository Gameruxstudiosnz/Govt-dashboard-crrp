router.get('/users/:id/discord-profile', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const discordId = req.params.id;
    
    try {
        console.log('Fetching from Discord API...');
        const response = await fetch(`${DISCORD_API}/users/${discordId}`, {
            headers: {
                'Authorization': `Bot MTI1NDg4OTc3OTg3MTYxNzAyNA.GF_iWw.6UYD3m-S4_ndfqOhGq8d8PrDY7NGLmyFeCuYik`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Discord API response status:', response.status);
        const userData = await response.json();
        console.log('Discord API response:', userData);

        res.json({
            id: userData.id,
            username: userData.username,
            tag: `${userData.username}#${userData.discriminator}`,
            avatarUrl: userData.avatar ? 
                `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : 
                'default-avatar-url.png'
        });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ error: error.message });
    }
});