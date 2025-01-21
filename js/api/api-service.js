class DocumentAPI {
    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
    }

    async fetchDocuments() {
        const response = await fetch(`${this.baseUrl}/documents`);
        if (!response.ok) throw new Error('Failed to fetch documents');
        return await response.json();
    }

    async getDocumentById(id) {
        const response = await fetch(`${this.baseUrl}/documents/${id}`);
        if (!response.ok) throw new Error('Failed to fetch document details');
        return await response.json();
    }

    async createDocument(documentData) {
        const response = await fetch(`${this.baseUrl}/documents/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(documentData)
        });
        if (!response.ok) throw new Error('Failed to create document');
        return await response.json();
    }

    async updateDocument(id, documentData) {
        const response = await fetch(`${this.baseUrl}/documents/${id}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(documentData)
        });
        if (!response.ok) throw new Error('Failed to update document');
        return await response.json();
    }

    async deleteDocument(id) {
        const response = await fetch(`${this.baseUrl}/documents/${id}/delete`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete document');
        return await response.json();
    }
}

// Update the DocumentationSystem class to use the API service
class DocumentationSystem {
    constructor() {
        this.api = new DocumentAPI();
        this.docGrid = document.querySelector('.doc-grid');
        this.deptFilter = document.getElementById('deptFilter');
        this.searchInput = document.querySelector('input[type="search"]');
        this.documents = [];
        
        this.initializeEventListeners();
        this.loadDocuments();
    }

    async loadDocuments() {
        try {
            this.documents = await this.api.fetchDocuments();
            this.renderDocuments(this.documents);
        } catch (error) {
            this.handleError('Failed to load documents', error);
        }
    }

    async openDocument(docId) {
        try {
            const doc = await this.api.getDocumentById(docId);
            this.showDocumentModal(doc);
        } catch (error) {
            this.handleError('Failed to load document details', error);
        }
    }

    handleError(message, error) {
        console.error(message, error);
        // Implement user-friendly error notification
        this.showErrorNotification(message);
    }

    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
}
