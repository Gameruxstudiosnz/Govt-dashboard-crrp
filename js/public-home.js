window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Dark background implementation
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const darkClass = 'dark-theme';
    
    // Set initial dark theme
    body.classList.add(darkClass);
    
    // Add dark theme CSS variables
    const root = document.documentElement;
    root.style.setProperty('--bg-color', '#121212');
    root.style.setProperty('--text-color', '#ffffff');
    root.style.setProperty('--card-bg', '#1e1e1e');
    root.style.setProperty('--border-color', '#333333');
    
    // Update component backgrounds
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.background = 'var(--bg-color)';
        section.style.color = 'var(--text-color)';
    });
    
    // Update cards and containers
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.background = 'var(--card-bg)';
        card.style.borderColor = 'var(--border-color)';
    });

    const loader = document.getElementById('loadingStates');
    const content = document.getElementById('mainContent');
    
    // Hide loader and show content when ready
    loader.style.display = 'none';
    content.style.display = 'block';

    const carousel = document.querySelector('.department-carousel');
    const slides = document.querySelectorAll('.department-preview');
    const prevBtn = carousel.querySelector('.dept-carousel-btn.prev');
    const nextBtn = carousel.querySelector('.dept-carousel-btn.next');
    const indicators = carousel.querySelector('.carousel-indicators');
    
    let currentSlide = 0;

    // Create indicator dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('indicator-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(dot);
    });

    function updateSlides() {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[currentSlide].classList.add('active');
        
        // Update indicators
        const dots = indicators.querySelectorAll('.indicator-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlide].classList.add('active');
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlides();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto advance slides
    setInterval(nextSlide, 5000);
});

const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    const updateCount = () => {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = parseInt(counter.innerText);
        const increment = target / 200;
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 1);
        }
    };
    updateCount();
});