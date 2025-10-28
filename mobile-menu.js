// Mobile Menu Handler
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
});

// Initialize mobile menu - can be called after header loads
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDropdown = document.getElementById('mobileDropdown');
    
    // Remove existing listeners to prevent duplicates
    if (mobileMenuBtn && !mobileMenuBtn.hasAttribute('data-initialized')) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (mobileDropdown) {
                const isShowing = mobileDropdown.classList.contains('show');
                if (isShowing) {
                    mobileDropdown.classList.remove('show');
                    this.innerHTML = '☰';
                } else {
                    mobileDropdown.classList.add('show');
                    this.innerHTML = '✕';
                }
            }
        });
        mobileMenuBtn.setAttribute('data-initialized', 'true');
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileDropdown = document.getElementById('mobileDropdown');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileDropdown && mobileMenuBtn && !e.target.closest('.fb-header') && mobileDropdown.classList.contains('show')) {
            mobileDropdown.classList.remove('show');
            mobileMenuBtn.innerHTML = '☰';
        }
    });
    
    // Sync mobile auth with desktop auth
    function syncMobileAuth() {
        const currentUser = localStorage.getItem('loggedInUser');
        const mobileDisplayUser = document.getElementById('mobileDisplayUser');
        const mobileLoginForm = document.getElementById('mobileLoginForm');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
        
        if (currentUser) {
            if (mobileDisplayUser) mobileDisplayUser.textContent = currentUser;
            if (mobileLoginForm) mobileLoginForm.style.display = 'none';
            if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
            
            // Show/hide admin links
            const isMaster = currentUser === 'MasterLogin';
            const mobileMasterBtn = document.getElementById('mobileMasterPageBtn');
            const mobileAdminBtn = document.getElementById('mobileAdminPageBtn');
            const mobileAdAdminBtn = document.getElementById('mobileAdAdminBtn');
            
            if (mobileMasterBtn) mobileMasterBtn.style.display = isMaster ? 'block' : 'none';
            if (mobileAdminBtn) mobileAdminBtn.style.display = isMaster ? 'block' : 'none';
            if (mobileAdAdminBtn) mobileAdAdminBtn.style.display = isMaster ? 'block' : 'none';
            
            // Show user links
            const mobileAddListingLink = document.getElementById('mobileAddListingLink');
            const mobileMyListingsLink = document.getElementById('mobileMyListingsLink');
            const mobileBookmarksLink = document.getElementById('mobileBookmarksLink');
            
            if (mobileAddListingLink) mobileAddListingLink.style.display = 'block';
            if (mobileMyListingsLink) mobileMyListingsLink.style.display = 'block';
            if (mobileBookmarksLink) mobileBookmarksLink.style.display = 'block';
        } else {
            if (mobileDisplayUser) mobileDisplayUser.textContent = '';
            if (mobileLoginForm) mobileLoginForm.style.display = 'flex';
            if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
            
            // Hide all user-specific links
            mobileNavLinks.forEach(link => {
                if (!link.id.includes('Login') && !link.id.includes('Register')) {
                    link.style.display = 'none';
                }
            });
        }
    }
    
    // Mobile login - initialize after delay
    setTimeout(() => {
        const mobileLoginForm = document.getElementById('mobileLoginForm');
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        
        if (mobileLoginForm) {
            mobileLoginForm.addEventListener('submit', handleMobileLogin);
        }
        if (mobileLoginBtn) {
            mobileLoginBtn.addEventListener('click', handleMobileLogin);
        }
    }, 500);
    
    function handleMobileLogin(e) {
        e.preventDefault();
        const username = document.getElementById('mobileUsername')?.value?.trim();
        const password = document.getElementById('mobilePassword')?.value;
        
        if (!username || !password) {
            alert('Please enter username and password');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[username] && users[username] === password) {
            localStorage.setItem('loggedInUser', username);
            sessionStorage.setItem('manualLogin', 'true');
            
            // Clear form
            const usernameField = document.getElementById('mobileUsername');
            const passwordField = document.getElementById('mobilePassword');
            if (usernameField) usernameField.value = '';
            if (passwordField) passwordField.value = '';
            
            // Update UI
            syncMobileAuth();
            if (window.updateAuthUI) window.updateAuthUI(username);
            if (window.displayListings) window.displayListings();
            
            // Close menu
            const dropdown = document.getElementById('mobileDropdown');
            const menuBtn = document.getElementById('mobileMenuBtn');
            if (dropdown) dropdown.classList.remove('show');
            if (menuBtn) menuBtn.innerHTML = '☰';
            
            alert('Login successful!');
        } else {
            alert('Invalid username or password');
        }
    }
    
    // Mobile register handler
    const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
    if (mobileRegisterBtn) {
        mobileRegisterBtn.addEventListener('click', function() {
            const username = document.getElementById('mobileUsername').value.trim();
            const password = document.getElementById('mobilePassword').value;
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            
            if (!username || !password) {
                alert('Fill in both fields');
                return;
            }
            if (users[username]) {
                alert('Username already taken');
                return;
            }
            
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registered! Now log in.');
        });
    }
    
    // Mobile logout handler
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', function() {
            localStorage.removeItem('loggedInUser');
            syncMobileAuth();
            // Also update desktop UI
            if (window.updateAuthUI) window.updateAuthUI(null);
            if (window.displayListings) window.displayListings();
            mobileDropdown.classList.remove('show');
            mobileMenuBtn.textContent = '☰';
        });
    }
    
    // Initial sync
    syncMobileAuth();
    
    // Listen for auth changes
    window.addEventListener('storage', syncMobileAuth);
}

// Make function globally available
window.initializeMobileMenu = initializeMobileMenu;
});