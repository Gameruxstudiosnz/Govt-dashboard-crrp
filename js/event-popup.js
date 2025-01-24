function toggleEventPopup(eventId) {
    const popup = document.getElementById('eventPopup');
    popup.classList.toggle('show');
    
    if (popup.classList.contains('show')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close popup when clicking outside
document.addEventListener('click', (e) => {
    const popup = document.getElementById('eventPopup');
    if (e.target === popup) {
        toggleEventPopup();
    }
});
