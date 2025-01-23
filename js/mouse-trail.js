class ParticleTrail {
    constructor() {
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.initializeTrail();
    }

    initializeTrail() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        setInterval(() => this.createParticle(), 20);
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'mouse-trail-particle';
        
        // Set initial position at current mouse coordinates
        particle.style.left = this.mouseX + 'px';
        particle.style.top = this.mouseY + 'px';
        
        document.body.appendChild(particle);
        this.particles.push(particle);

        // Animate and remove particle
        setTimeout(() => {
            particle.remove();
            this.particles.shift();
        }, 1000);
    }
}

// Initialize the trail
document.addEventListener('DOMContentLoaded', () => {
    new ParticleTrail();
});
