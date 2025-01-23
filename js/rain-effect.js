function createRain() {
    const rainContainer = document.querySelector('.rain-container');
    
    if (rainContainer) {
        const dropCount = 200; // Increased number of raindrops
        
        for(let i = 0; i < dropCount; i++) {
            const drop = document.createElement('div');
            drop.classList.add('raindrop');
            
            // Enhanced randomization for more dynamic effect
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 1 + 0.5) + 's'; // Slower drops
            drop.style.opacity = Math.random() * 0.6 + 0.4; // Higher opacity
            drop.style.height = Math.random() * 30 + 10 + 'px'; // Varied drop sizes
            
            rainContainer.appendChild(drop);
        }
    }
}

document.addEventListener('DOMContentLoaded', createRain);
