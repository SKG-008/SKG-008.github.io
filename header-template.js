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
                    <button id="mobileLogoutBtn" class="mobile-logout-btn">Logout</button>
                </div>
            </div>
        </div>
    </header>`;
}

// Initialize standard header
document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.getElementById('standardHeader');
    if (headerContainer) {
        const pageTitle = headerContainer.getAttribute('data-title') || '';
        headerContainer.innerHTML = createStandardHeader(pageTitle);
    }
});