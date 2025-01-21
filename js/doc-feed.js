class DocumentationSystem {
    constructor() {
        this.docGrid = document.querySelector('.doc-grid');
        this.deptFilter = document.getElementById('deptFilter');
        this.searchInput = document.querySelector('input[type="search"]');
        this.documents = [];
        
        this.initializeEventListeners();
        this.fetchDocuments();
    }

    initializeEventListeners() {
        this.deptFilter.addEventListener('change', () => this.filterDocuments());
        this.searchInput.addEventListener('input', () => this.filterDocuments());
    }

    async fetchDocuments() {
        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/documents');
            this.documents = await response.json();
            this.renderDocuments(this.documents);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }

    renderDocuments(documents) {
        this.docGrid.innerHTML = documents.map(doc => this.createDocumentCard(doc)).join('');
        this.attachReadMoreListeners();
    }

    createDocumentCard(doc) {
        return `
            <div class="doc-card" data-id="${doc.id}">
                <div class="doc-header">
                    <span class="dept-badge ${doc.department.toLowerCase()}">${doc.department}</span>
                    <span class="doc-date">${this.formatDate(doc.date)}</span>
                </div>
                <h3>${doc.title}</h3>
                <p class="doc-preview">${this.truncateText(doc.content, 150)}</p>
                <div class="doc-footer">
                    <button class="btn btn-primary btn-sm read-more">Read More</button>
                    <span class="doc-category">${doc.category}</span>
                </div>
            </div>
        `;
    }

    attachReadMoreListeners() {
        const readMoreButtons = document.querySelectorAll('.read-more');
        readMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const docId = e.target.closest('.doc-card').dataset.id;
                this.openDocument(docId);
            });
        });
    }

    async openDocument(docId) {
        try {
            const doc = await this.fetchDocumentDetails(docId);
            this.showDocumentModal(doc);
        } catch (error) {
            console.error('Error opening document:', error);
        }
    }

    showDocumentModal(doc) {
        const modal = document.createElement('div');
        modal.className = 'doc-modal';
        modal.innerHTML = `
            <div class="doc-modal-content">
                <div class="doc-modal-header">
                    <h2>${doc.title}</h2>
                    <button class="close-modal">×</button>
                </div>
                <div class="doc-modal-body">
                    ${doc.content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.initializeModalEvents(modal);
    }

    initializeModalEvents(modal) {
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    filterDocuments() {
        const department = this.deptFilter.value;
        const searchTerm = this.searchInput.value.toLowerCase();
        
        const filtered = this.documents.filter(doc => {
            const matchesDepartment = department === 'all' || doc.department.toLowerCase() === department;
            const matchesSearch = doc.title.toLowerCase().includes(searchTerm) || 
                                doc.content.toLowerCase().includes(searchTerm);
            return matchesDepartment && matchesSearch;
        });
        
        this.renderDocuments(filtered);
    }

    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    async fetchDocumentDetails(docId) {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/documents/${docId}`);
        return await response.json();
    }
}

// Initialize the documentation system
document.addEventListener('DOMContentLoaded', () => {
    const docSystem = new DocumentationSystem();
});
