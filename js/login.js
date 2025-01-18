document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Simple login handler
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Test credentials
        if (username === 'admin' && password === 'admin123') {
            // Success
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify({
                name: 'Admin User',
                role: 'Administrator'
            }));
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();
            
            // Show dashboard
            document.querySelector('.dashboard-container').style.display = 'block';
            document.querySelector('.login-welcome').style.display = 'none';
            
            // Show success message
            showMessage('Login successful!', 'success');
        } else {
            // Error
            showMessage('Invalid credentials!', 'danger');
        }
    });
});

function showMessage(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} mt-3`;
    alertDiv.textContent = message;
    
    const form = document.getElementById('loginForm');
    form.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 3000);
}

// Check login state on page load
function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        document.querySelector('.dashboard-container').style.display = 'block';
        document.querySelector('.login-welcome').style.display = 'none';
    } else {
        document.querySelector('.dashboard-container').style.display = 'none';
        document.querySelector('.login-welcome').style.display = 'flex';
    }
}

// Run on page load
checkLoginState();
