class ProfileManager {
    constructor() {
        this.setupProfileForm();
        this.setupAvatarUpload();
    }

    setupProfileForm() {
        const saveButton = document.getElementById('saveProfileChanges');
        saveButton.addEventListener('click', () => this.saveProfile());
    }

    setupAvatarUpload() {
        const avatarInput = document.getElementById('avatarUpload');
        avatarInput.addEventListener('change', (e) => this.handleAvatarUpload(e));
    }

    async saveProfile() {
        const formData = this.gatherProfileData();
        
        try {
            await this.updateProfileAPI(formData);
            this.showSuccess('Profile updated successfully');
            bootstrap.Modal.getInstance(document.getElementById('userProfileModal')).hide();
        } catch (error) {
            this.showError('Update failed');
        }
    }

    gatherProfileData() {
        // Gather all form data
        return {
            personalInfo: this.getFormData('personalInfoForm'),
            security: this.getFormData('securityForm'),
            preferences: this.getFormData('preferencesForm')
        };
    }

    getFormData(formId) {
        return Object.fromEntries(new FormData(document.getElementById(formId)));
    }

    updateProfileAPI(data) {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true }), 1000);
        });
    }
}

// Initialize profile management
const profile = new ProfileManager();
