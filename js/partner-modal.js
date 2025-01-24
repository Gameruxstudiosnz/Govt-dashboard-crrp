function showPartnerDetails(card) {
    const modal = document.getElementById('partnerModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDescription');
    const modalDetails = document.getElementById('modalPartnershipDetails');

    modalImg.src = card.querySelector('img').src;
    modalTitle.textContent = card.querySelector('h3').textContent;
    modalDesc.textContent = card.querySelector('p').textContent;
    modalDetails.innerHTML = card.querySelector('.partnership-details').innerHTML;

    modal.style.display = 'block';
}

// Close modal when clicking the close button or outside
document.querySelector('.close-btn').onclick = () => {
    document.getElementById('partnerModal').style.display = 'none';
}

window.onclick = (event) => {
    const modal = document.getElementById('partnerModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
