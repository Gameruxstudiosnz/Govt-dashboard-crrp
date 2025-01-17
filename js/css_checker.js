function verifyCSSLinks() {
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    const results = [];
    
    cssLinks.forEach(link => {
        const href = link.getAttribute('href');
        fetch(href)
            .then(response => {
                results.push({
                    path: href,
                    status: response.status,
                    valid: response.ok
                });
                console.log(`CSS ${href}: ${response.ok ? 'Valid' : 'Invalid'}`);
            })
            .catch(error => {
                results.push({
                    path: href,
                    status: 'failed',
                    valid: false,
                    error: error.message
                });
                console.error(`Failed to load CSS ${href}`);
            });
    });
    
    return results;
}
