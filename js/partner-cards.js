document.addEventListener('DOMContentLoaded', () => {
    const partnerCards = document.querySelectorAll('.partner-card');
    const imageContainers = document.querySelectorAll('.image-container');
    
    partnerCards.forEach(card => {
        // Add smooth scroll behavior
        card.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const scrollSpeed = 30;
            const delta = Math.sign(e.deltaY) * scrollSpeed;
            
            card.scrollTop += delta;
        });

        // Add touch scroll for mobile
        let touchStart = null;
        let touchY = null;

        card.addEventListener('touchstart', (e) => {
            touchStart = e.touches[0].clientY;
        });

        card.addEventListener('touchmove', (e) => {
            if (!touchStart) return;

            touchY = e.touches[0].clientY;
            const delta = touchStart - touchY;
            
            card.scrollTop += delta;
            touchStart = touchY;
        });

        // Add keyboard navigation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                card.scrollTop -= 30;
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                card.scrollTop += 30;
            }
        });

        // Add hover animation class
        card.addEventListener('mouseenter', () => {
            card.classList.add('card-hover');
            animateStats(card);
        });

        // Add click handler for mobile
        card.addEventListener('click', () => {
            expandCardDetails(card);
        });
    });

    imageContainers.forEach(container => {
        const images = container.querySelectorAll('.partner-image');
        let currentIndex = 0;
        
        // Show first image
        images[0].classList.add('active');
        
        // Add navigation buttons
        const prevBtn = document.createElement('button');
        const nextBtn = document.createElement('button');
        prevBtn.className = 'nav-btn prev-btn';
        nextBtn.className = 'nav-btn next-btn';
        prevBtn.innerHTML = '❮';
        nextBtn.innerHTML = '❯';
        
        // Navigation logic
        function showImage(index) {
            images.forEach(img => img.classList.remove('active'));
            images[index].classList.add('active');
        }
        
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });
        
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });
        
        container.appendChild(prevBtn);
        container.appendChild(nextBtn);
    });

    // Animate statistics with counting effect
    function animateStats(card) {
        const stats = card.querySelectorAll('.partner-stats span');
        stats.forEach(stat => {
            const value = stat.textContent.match(/\d+/);
            if (value) {
                animateNumber(stat, 0, parseInt(value[0]));
            }
        });
    }

    // Number counter animation
    function animateNumber(element, start, end) {
        let current = start;
        const increment = Math.ceil(end / 20);
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            const originalText = element.textContent;
            element.textContent = originalText.replace(/\d+/, current);
        }, 50);
    }

    // Expand card details for mobile view
    function expandCardDetails(card) {
        if (window.innerWidth <= 768) {
            const details = card.querySelector('p');
            details.classList.toggle('expanded');
        }
    }
});