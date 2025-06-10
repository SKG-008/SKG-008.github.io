function getCurrentUser() {
    return localStorage.getItem('currentUser');
}
function getListings() {
    return JSON.parse(localStorage.getItem('listings') || '[]');
}
function setListings(listings) {
    localStorage.setItem('listings', JSON.stringify(listings));
}
function cleanupExpiredListings() {
    let listings = getListings();
    const now = Date.now();
    listings = listings.filter(l => !l.expiry || l.expiry > now);
    setListings(listings);
}
function renderMyListings() {
    cleanupExpiredListings();
    const user = getCurrentUser();
    const listings = getListings().filter(l => l.owner === user);
    const container = document.getElementById('myListingsContainer');
    container.innerHTML = '';
    if (listings.length === 0) {
        container.innerHTML = '<p>You have no listings.</p>';
        return;
    }
    listings.forEach(listing => {
        const card = document.createElement('div');
        card.className = 'listing-card';
        card.innerHTML = `
            <img src="${listing.image || 'placeholder.jpg'}" alt="Listing Image">
            <div class="listing-details">
                <div class="listing-title">${listing.address}</div>
                <div class="listing-meta">${listing.type || ''} &middot; ${listing.location || ''}</div>
                <div class="listing-price">$${listing.price}</div>
                <div class="listing-description">${listing.description || ''}</div>
                <div class="listing-timer">${listing.expiry ? 'Expires in: <span class="timer" data-expiry="' + listing.expiry + '"></span>' : ''}</div>
            </div>
        `;
        container.appendChild(card);
    });
    updateTimers();
}
function updateTimers() {
    const timers = document.querySelectorAll('.timer');
    timers.forEach(span => {
        const expiry = parseInt(span.getAttribute('data-expiry'), 10);
        const now = Date.now();
        let diff = Math.max(0, expiry - now);
        if (diff <= 0) {
            span.textContent = 'Expired';
            cleanupExpiredListings();
            renderMyListings();
        } else {
            const min = Math.floor(diff / 60000);
            const sec = Math.floor((diff % 60000) / 1000);
            span.textContent = `${min}m ${sec}s`;
        }
    });
    if (timers.length > 0) setTimeout(updateTimers, 1000);
}
renderMyListings();
