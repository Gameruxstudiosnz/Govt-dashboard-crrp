function createFirework(x, y) {
    const colors = ['#ff0000', '#ffd700', '#ff4500', '#00ff00', '#ffffff', '#ff1493'];
    
    for(let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        
        // Random color from our palette
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Random angle and velocity
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 8 + 2;
        
        // Set particle position and color
        particle.style.backgroundColor = color;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // Animate the particle
        const animation = particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { 
                transform: `translate(${Math.cos(angle) * velocity * 50}px, 
                            ${Math.sin(angle) * velocity * 50}px) scale(0)`,
                opacity: 0 
            }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0,0,0.2,1)'
        });
        
        document.body.appendChild(particle);
        
        // Clean up particle after animation
        animation.onfinish = () => particle.remove();
    }
}

document.addEventListener('click', (e) => {
    createFirework(e.clientX, e.clientY);
});
