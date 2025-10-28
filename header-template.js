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
                <a href="index.html" class="nav-link">Home</a>
                <a href="listing.html" id="addListingLink" class="nav-link">Add Listing</a>
                <a href="mylistings.html" id="myListingsLink" class="nav-link">My Listings</a>
                <a href="bookmarks.html" id="bookmarksLink" class="nav-link">Bookmarks</a>
                <form id="loginForm" class="fb-auth">
                    <input type="text" id="username" placeholder="Username" required />
                    <input type="password" id="password" placeholder="Password" required />
                    <button type="submit" id="loginBtn">Login</button>
                    <button type="button" id="registerBtn">Register</button>
                </form>
                <span id="displayUser" class="fb-user"></span>
                <a href="master.html" id="masterPageBtn" class="admin-link">Master</a>
                <a href="admin.html" id="adminPageBtn" class="admin-link">Admin</a>
                <a href="ad-admin.html" id="adAdminBtn" class="admin-link">Ads</a>
                <a href="ad-banner-manager.html" id="bannerAdminBtn" class="admin-link">Banner</a>
                <button id="logoutBtn" class="logout-btn">Logout</button>
            </div>
            
            <div id="mobileDropdown" class="mobile-dropdown">
                <div class="mobile-user-info">
                    <span id="mobileDisplayUser"></span>
                </div>
                <form id="mobileLoginForm" class="mobile-auth">
                    <input type="text" id="mobileUsername" placeholder="Username" required />
                    <input type="password" id="mobilePassword" placeholder="Password" required />
                    <button type="submit" id="mobileLoginBtn">Login</button>
                    <button type="button" id="mobileRegisterBtn">Register</button>
                </form>
                <div class="mobile-nav-links">
                    <a href="index.html" class="mobile-nav-link">Home</a>
                    <a href="listing.html" id="mobileAddListingLink" class="mobile-nav-link">Add Listing</a>
                    <a href="mylistings.html" id="mobileMyListingsLink" class="mobile-nav-link">My Listings</a>
                    <a href="bookmarks.html" id="mobileBookmarksLink" class="mobile-nav-link">Bookmarks</a>
                    <a href="master.html" id="mobileMasterPageBtn" class="mobile-nav-link">Master</a>
                    <a href="admin.html" id="mobileAdminPageBtn" class="mobile-nav-link">Admin</a>
                    <a href="ad-admin.html" id="mobileAdAdminBtn" class="mobile-nav-link">Ads</a>
                    <a href="ad-banner-manager.html" id="mobileBannerAdminBtn" class="mobile-nav-link">Banner</a>
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
            if (window.initializeMobileMenu) {
                window.initializeMobileMenu();
            }
        }, 100);
    }
}

// Initialize authentication
function initializeAuth() {
    // Ensure MasterLogin user exists
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users['MasterLogin']) {
        users['MasterLogin'] = 'MasterLogin';
        localStorage.setItem('users', JSON.stringify(users));
    }
    
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
    const bannerAdminBtn = document.getElementById('bannerAdminBtn');
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
        if (bannerAdminBtn) bannerAdminBtn.style.display = isMaster ? 'inline-block' : 'none';
        
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
        if (bannerAdminBtn) bannerAdminBtn.style.display = 'none';
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
                updateAuthUI(username);
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
            updateAuthUI(null);
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

// Make functions globally available
window.updateAuthUI = updateAuthUI;
window.initializeHeader = initializeHeader;