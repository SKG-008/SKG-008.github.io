// Standard Header Template
function createStandardHeader(pageTitle = '') {
    return `
    <header class="fb-header">
        <div class="fb-header-content">
            <div class="header-main">
                <span class="fb-logo">Virtual.Market${pageTitle ? ' - ' + pageTitle : ''}</span>
                <button id="mobileMenuBtn" class="mobile-menu-btn">☰</button>
            </div>
            
            <div class="desktop-nav">
                <div class="nav-links">
                    <a href="index.html" class="nav-link">Home</a>
                    <a href="listing.html" id="addListingLink" class="nav-link">Add Listing</a>
                    <a href="mylistings.html" id="myListingsLink" class="nav-link">My Listings</a>
                    <a href="bookmarks.html" id="bookmarksLink" class="nav-link">Bookmarks</a>
                    <a href="master.html" id="masterPageBtn" class="admin-link">Master</a>
                    <a href="admin.html" id="adminPageBtn" class="admin-link">Admin</a>
                    <a href="ad-admin.html" id="adAdminBtn" class="admin-link">Ads</a>
                </div>
                <div class="auth-section">
                    <form id="loginForm" class="fb-auth">
                        <input type="text" id="username" placeholder="Username" required />
                        <input type="password" id="password" placeholder="Password" required />
                        <button type="submit" id="loginBtn">Login</button>
                        <button type="button" id="registerBtn">Register</button>
                    </form>
                    <span id="displayUser" class="fb-user"></span>
                    <button id="logoutBtn" class="logout-btn">Logout</button>
                </div>
            </div>
            
            <div id="mobileDropdown" class="mobile-dropdown">
                <div class="mobile-user-info">
                    <span id="mobileDisplayUser"></span>
                </div>
                <div id="mobileLoginForm" class="mobile-auth">
                    <input type="text" id="mobileUsername" placeholder="Username" required />
                    <input type="password" id="mobilePassword" placeholder="Password" required />
                    <button type="button" id="mobileLoginBtn">Login</button>
                    <button type="button" id="mobileRegisterBtn">Register</button>
                </div>
                <div class="mobile-nav-links">
                    <a href="index.html" class="mobile-nav-link">Home</a>
                    <a href="listing.html" id="mobileAddListingLink" class="mobile-nav-link">Add Listing</a>
                    <a href="mylistings.html" id="mobileMyListingsLink" class="mobile-nav-link">My Listings</a>
                    <a href="bookmarks.html" id="mobileBookmarksLink" class="mobile-nav-link">Bookmarks</a>
                    <a href="master.html" id="mobileMasterPageBtn" class="mobile-nav-link">Master</a>
                    <a href="admin.html" id="mobileAdminPageBtn" class="mobile-nav-link">Admin</a>
                    <a href="ad-admin.html" id="mobileAdAdminBtn" class="mobile-nav-link">Ads</a>
                    <button id="mobileLogoutBtn" class="mobile-logout-btn">Logout</button>
                </div>
            </div>
        </div>
    </header>`;
}

// Initialize standard header immediately
function initializeHeader() {
    const headerContainer = document.getElementById('standardHeader');
    if (headerContainer && !headerContainer.hasAttribute('data-header-loaded')) {
        const pageTitle = headerContainer.getAttribute('data-title') || '';
        headerContainer.innerHTML = createStandardHeader(pageTitle);
        headerContainer.setAttribute('data-header-loaded', 'true');
        
        // Initialize authentication and mobile menu after header is created
        setTimeout(() => {
            initializeAuth();
            initializeMobileMenuDirect();
            // Ensure mobile auth is synced
            const currentUser = localStorage.getItem('loggedInUser');
            updateMobileAuthUI(currentUser);
        }, 100);
    }
}

// Initialize authentication
function initializeAuth() {
    // Load users from GitHub first
    loadUsersFromGitHub();
    
    // Ensure MasterLogin user exists
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users['MasterLogin']) {
        users['MasterLogin'] = 'MasterLogin';
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Don't clear login - keep user logged in
    
    const currentUser = localStorage.getItem('loggedInUser');
    updateAuthUI(currentUser);
    setupAuthListeners();
    
    // Also update mobile UI
    if (window.syncMobileAuth) {
        window.syncMobileAuth();
    }
}

// Update authentication UI
function updateAuthUI(currentUser) {
    const displayUser = document.getElementById('displayUser');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const masterPageBtn = document.getElementById('masterPageBtn');
    const adminPageBtn = document.getElementById('adminPageBtn');
    const adAdminBtn = document.getElementById('adAdminBtn');
    const addListingLink = document.getElementById('addListingLink');
    const myListingsLink = document.getElementById('myListingsLink');
    const bookmarksLink = document.getElementById('bookmarksLink');
    
    if (currentUser) {
        if (displayUser) displayUser.textContent = currentUser;
        if (loginForm) loginForm.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        
        const isMaster = currentUser === 'MasterLogin';
        if (masterPageBtn) masterPageBtn.style.display = isMaster ? 'inline-block' : 'none';
        if (adminPageBtn) adminPageBtn.style.display = isMaster ? 'inline-block' : 'none';
        if (adAdminBtn) adAdminBtn.style.display = isMaster ? 'inline-block' : 'none';
        
        if (addListingLink) addListingLink.style.display = 'inline-block';
        if (myListingsLink) myListingsLink.style.display = 'inline-block';
        if (bookmarksLink) bookmarksLink.style.display = 'inline-block';
    } else {
        if (displayUser) displayUser.textContent = '';
        if (loginForm) loginForm.style.display = 'flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (masterPageBtn) masterPageBtn.style.display = 'none';
        if (adminPageBtn) adminPageBtn.style.display = 'none';
        if (adAdminBtn) adAdminBtn.style.display = 'none';
        if (addListingLink) addListingLink.style.display = 'none';
        if (myListingsLink) myListingsLink.style.display = 'none';
        if (bookmarksLink) bookmarksLink.style.display = 'none';
    }
}

// Setup authentication event listeners
function setupAuthListeners() {
    const loginForm = document.getElementById('loginForm');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            
            if (users[username] && users[username] === password) {
                localStorage.setItem('loggedInUser', username);
                sessionStorage.setItem('manualLogin', 'true');
                updateAuthUI(username);
                if (window.updateMobileAuthUI) window.updateMobileAuthUI(username);
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                if (window.displayListings) window.displayListings();
            } else {
                alert('Invalid credentials');
            }
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
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
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            alert('Registered! Now log in.');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('loggedInUser');
            sessionStorage.removeItem('manualLogin');
            updateAuthUI(null);
            if (window.updateMobileAuthUI) window.updateMobileAuthUI(null);
            // Clear form fields
            const usernameField = document.getElementById('username');
            const passwordField = document.getElementById('password');
            if (usernameField) usernameField.value = '';
            if (passwordField) passwordField.value = '';
            if (window.displayListings) window.displayListings();
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeader);
} else {
    initializeHeader();
}

// Prevent header glitches during page transitions
let headerInitialized = false;

function ensureHeaderStability() {
    if (!headerInitialized && document.getElementById('standardHeader')) {
        initializeHeader();
        headerInitialized = true;
    }
}

// Check for header on page visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        setTimeout(ensureHeaderStability, 50);
    }
});

// Reinitialize on focus
window.addEventListener('focus', ensureHeaderStability);

// Initialize mobile menu directly
function initializeMobileMenuDirect() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDropdown = document.getElementById('mobileDropdown');
    
    if (mobileMenuBtn && mobileDropdown) {
        mobileMenuBtn.onclick = function(e) {
            e.preventDefault();
            const isShowing = mobileDropdown.classList.contains('show');
            if (isShowing) {
                mobileDropdown.classList.remove('show');
                this.innerHTML = '☰';
            } else {
                mobileDropdown.classList.add('show');
                this.innerHTML = '✕';
            }
        };
    }
    
    // Mobile login handler
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    if (mobileLoginBtn) {
        mobileLoginBtn.onclick = function(e) {
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
                
                // Update mobile UI immediately
                const mobileDisplayUser = document.getElementById('mobileDisplayUser');
                const mobileLoginForm = document.getElementById('mobileLoginForm');
                const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
                
                if (mobileDisplayUser) mobileDisplayUser.textContent = username;
                if (mobileLoginForm) mobileLoginForm.style.display = 'none';
                if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
                
                // Show user links
                const userLinks = ['mobileAddListingLink', 'mobileMyListingsLink', 'mobileBookmarksLink'];
                userLinks.forEach(id => {
                    const link = document.getElementById(id);
                    if (link) link.style.display = 'block';
                });
                
                // Show admin links if master
                if (username === 'MasterLogin') {
                    const adminLinks = ['mobileMasterPageBtn', 'mobileAdminPageBtn', 'mobileAdAdminBtn'];
                    adminLinks.forEach(id => {
                        const link = document.getElementById(id);
                        if (link) link.style.display = 'block';
                    });
                }
                
                // Update both desktop and mobile UI
                if (window.updateAuthUI) window.updateAuthUI(username);
                if (window.updateMobileAuthUI) window.updateMobileAuthUI(username);
                if (window.displayListings) window.displayListings();
                
                alert('Login successful!');
            } else {
                alert('Invalid username or password');
            }
        };
    }
    
    // Mobile register handler
    const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
    if (mobileRegisterBtn) {
        mobileRegisterBtn.onclick = function(e) {
            e.preventDefault();
            const username = document.getElementById('mobileUsername')?.value?.trim();
            const password = document.getElementById('mobilePassword')?.value;
            
            if (!username || !password) {
                alert('Please enter username and password');
                return;
            }
            
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            
            if (users[username]) {
                alert('Username already taken');
                return;
            }
            
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            
            // Clear form
            document.getElementById('mobileUsername').value = '';
            document.getElementById('mobilePassword').value = '';
            
            alert('Account created! You can now log in.');
        };
    }
    
    // Mobile logout handler
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) {
        mobileLogoutBtn.onclick = function(e) {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            sessionStorage.removeItem('manualLogin');
            
            // Update mobile UI immediately
            const mobileDisplayUser = document.getElementById('mobileDisplayUser');
            const mobileLoginForm = document.getElementById('mobileLoginForm');
            const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
            
            if (mobileDisplayUser) mobileDisplayUser.textContent = '';
            if (mobileLoginForm) mobileLoginForm.style.display = 'flex';
            if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
            
            // Hide user links
            const userLinks = ['mobileAddListingLink', 'mobileMyListingsLink', 'mobileBookmarksLink', 'mobileMasterPageBtn', 'mobileAdminPageBtn', 'mobileAdAdminBtn'];
            userLinks.forEach(id => {
                const link = document.getElementById(id);
                if (link) link.style.display = 'none';
            });
            
            // Update both desktop and mobile UI
            if (window.updateAuthUI) window.updateAuthUI(null);
            if (window.updateMobileAuthUI) window.updateMobileAuthUI(null);
            if (window.displayListings) window.displayListings();
            
            alert('Logged out successfully');
        };
    }
}

// Update mobile auth UI
function updateMobileAuthUI(currentUser) {
    const mobileDisplayUser = document.getElementById('mobileDisplayUser');
    const mobileLoginForm = document.getElementById('mobileLoginForm');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    if (currentUser) {
        if (mobileDisplayUser) mobileDisplayUser.textContent = currentUser;
        if (mobileLoginForm) mobileLoginForm.style.display = 'none';
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
        
        // Show user links
        const userLinks = ['mobileAddListingLink', 'mobileMyListingsLink', 'mobileBookmarksLink'];
        userLinks.forEach(id => {
            const link = document.getElementById(id);
            if (link) link.style.display = 'block';
        });
        
        // Show admin links if master
        if (currentUser === 'MasterLogin') {
            const adminLinks = ['mobileMasterPageBtn', 'mobileAdminPageBtn', 'mobileAdAdminBtn'];
            adminLinks.forEach(id => {
                const link = document.getElementById(id);
                if (link) link.style.display = 'block';
            });
        }
    } else {
        if (mobileDisplayUser) mobileDisplayUser.textContent = '';
        if (mobileLoginForm) mobileLoginForm.style.display = 'flex';
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
        
        // Hide all user links
        const allLinks = ['mobileAddListingLink', 'mobileMyListingsLink', 'mobileBookmarksLink', 'mobileMasterPageBtn', 'mobileAdminPageBtn', 'mobileAdAdminBtn'];
        allLinks.forEach(id => {
            const link = document.getElementById(id);
            if (link) link.style.display = 'none';
        });
    }
}

// Load users from GitHub
async function loadUsersFromGitHub() {
    try {
        const response = await fetch('data/users.json');
        if (response.ok) {
            const githubUsers = await response.json();
            // Merge with local users
            const localUsers = JSON.parse(localStorage.getItem('users') || '{}');
            const mergedUsers = {...githubUsers, ...localUsers};
            localStorage.setItem('users', JSON.stringify(mergedUsers));
            localStorage.setItem('githubUsers', JSON.stringify(githubUsers));
        }
    } catch (error) {
        console.log('GitHub users sync not available');
        // Use cached GitHub users if available
        const cachedUsers = JSON.parse(localStorage.getItem('githubUsers') || '{}');
        const localUsers = JSON.parse(localStorage.getItem('users') || '{}');
        const mergedUsers = {...cachedUsers, ...localUsers};
        localStorage.setItem('users', JSON.stringify(mergedUsers));
    }
}

// Make functions globally available
window.updateAuthUI = updateAuthUI;
window.updateMobileAuthUI = updateMobileAuthUI;
window.initializeHeader = initializeHeader;
window.loadUsersFromGitHub = loadUsersFromGitHub;