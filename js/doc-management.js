class DocumentManager {
    constructor() {
        this.api = new DocumentAPI();
        this.form = document.querySelector('.doc-form');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Handle publish button
        document.querySelector('.btn-primary').addEventListener('click', (e) => {
            e.preventDefault();
            this.saveDocument('published');
        });

        // Handle draft button
        document.querySelector('.btn-secondary').addEventListener('click', (e) => {
            e.preventDefault();
            this.saveDocument('draft');
        });
    }

    async saveDocument(status) {
        const documentData = {
            department: document.getElementById('department').value,
            title: document.getElementById('docTitle').value,
            category: document.getElementById('docCategory').value,
            content: tinymce.get('docContent').getContent(),
            status: status,
            lastUpdated: new Date().toISOString()
        };

        try {
            const response = await this.api.createDocument(documentData);
            this.showNotification(`Document ${status === 'published' ? 'published' : 'saved as draft'} successfully`);
            this.resetForm();
        } catch (error) {
            this.showNotification('Error saving document', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    resetForm() {
        this.form.reset();
        tinymce.get('docContent').setContent('');
    }
}

// Initialize the document manager
document.addEventListener('DOMContentLoaded', () => {
    new DocumentManager();
});

// Document editing function
function editDocument(docId) {
    window.location.href = `/edit-document.html?id=${docId}`;
}

// Document deletion function
async function deleteDocument(docId) {
    if (confirm('Are you sure you want to delete this document?')) {
        try {
            const response = await fetch(`/api/documents/${docId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                refreshDocumentsTable();
                alert('Document deleted successfully!');
            } else {
                throw new Error('Failed to delete document');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete document. Please try again.');
        }
    }
}