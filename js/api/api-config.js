const API_CONFIG = {
    baseUrl: 'http://localhost:3000/api/v1',
    endpoints: {
        documents: {
            list: '/documents',
            details: '/documents/:id',
            create: '/documents/create',
            update: '/documents/:id/update',
            delete: '/documents/:id/delete'
        },
        departments: '/departments',
        categories: '/categories'
    }
}
