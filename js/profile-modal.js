document.addEventListener('DOMContentLoaded', function() {
    // Initialize profile modal functionality
    const profileModal = new bootstrap.Modal(document.getElementById('userProfileModal'));
    
    // Handle avatar upload
    const avatarUpload = document.getElementById('avatarUpload');
    avatarUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.querySelector('.profile-avatar').src = e.target.result;
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Handle form submissions
    document.getElementById('saveProfileChanges').addEventListener('click', function() {
        // Show loading state
        this.disabled = true;
        this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';

        // Simulate API call
        setTimeout(() => {
            // Reset button state
            this.disabled = false;
            this.innerHTML = '<i class="fas fa-save me-2"></i>Save Changes';
            
            // Show success message
            showToast('Profile updated successfully!', 'success');
            
            // Close modal
            profileModal.hide();
        }, 1500);
    });
});

// Add this trigger where needed (e.g., edit profile button)
function openProfileModal() {
    const profileModal = new bootstrap.Modal(document.getElementById('userProfileModal'));
    profileModal.show();
}
