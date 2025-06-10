// --- Profanity Filter ---
const RUDE_PATTERNS = [
    /\bfuck\w*\b/i, /\bshit\w*\b/i, /\bbitch\w*\b/i, /\basshole\b/i, /\bbastard\b/i,
    /\bdick\w*\b/i, /\bpiss\w*\b/i, /\bcrap\w*\b/i, /\bdamn\w*\b/i, /\bcock\w*\b/i,
    /\bpussy\w*\b/i, /\bfag\w*\b/i, /\bslut\w*\b/i, /\bdouche\w*\b/i, /\bbollocks\b/i,
    /\bbugger\b/i, /\barse\w*\b/i, /\bwank\w*\b/i, /\btwat\w*\b/i, /\bprick\w*\b/i
];

function containsRudeWordAI(text) {
    if (!text) return false;
    return RUDE_PATTERNS.some(pattern => pattern.test(text));
}

function getFirstNLines(text, n) {
    if (!text) return "";
    const lines = text.split('\n');
    if (lines.length <= n) return text;
    return lines.slice(0, n).join('\n') + '...';
}

// Detect mode from URL
function getMode() {
    const params = new URLSearchParams(window.location.search);
    return params.has('rent') ? 'rent' : 'sale';
}

document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const loginForm = document.getElementById("loginForm");
    const logoutBtn = document.getElementById("logoutBtn");
    const displayUser = document.getElementById("displayUser");
    const masterPageBtn = document.getElementById("masterPageBtn");
    const registerBtn = document.getElementById("registerBtn");
    const addListingLink = document.getElementById("addListingLink");
    const myListingsLink = document.getElementById("myListingsLink");
    const bookmarksLink = document.getElementById("bookmarksLink");
    const forSaleLink = document.getElementById("forSaleLink");
    const forRentLink = document.getElementById("forRentLink");
    const listingsTitle = document.getElementById("listingsTitle");

    // Dropdown filter menu elements
    const toggleFilterBtn = document.getElementById("toggleFilterBtn");
    const filterForm = document.getElementById("filterForm");
    const saleFilters = document.getElementById("saleFilters");
    const rentFilters = document.getElementById("rentFilters");

    // Determine mode
    let mode = getMode();

    // Show correct filters
    if (saleFilters && rentFilters) {
        if (mode === "rent") {
            saleFilters.style.display = "none";
            rentFilters.style.display = "";
            if (listingsTitle) listingsTitle.textContent = "Rental Listings";
        } else {
            saleFilters.style.display = "";
            rentFilters.style.display = "none";
            if (listingsTitle) listingsTitle.textContent = "Properties For Sale";
        }
    }

    // Set Add Listing link to pass mode and always open add form
    if (addListingLink) {
        addListingLink.href = "listing.html?mode=" + mode;
        addListingLink.style.display = "inline-block";
        addListingLink.onclick = function (e) {
            localStorage.removeItem("selectedListing");
        };
    }

    // Highlight active nav link
    if (forSaleLink && forRentLink) {
        if (mode === "rent") {
            forRentLink.classList.add("active");
            forSaleLink.classList.remove("active");
        } else {
            forSaleLink.classList.add("active");
            forRentLink.classList.remove("active");
        }
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};
    let currentUser = localStorage.getItem("loggedInUser");

    // Ensure MasterLogin always exists
    if (!users["MasterLogin"]) {
        users["MasterLogin"] = "MasterLogin";
        localStorage.setItem("users", JSON.stringify(users));
    }

    function updateUI() {
        currentUser = localStorage.getItem("loggedInUser");
        if (currentUser) {
            displayUser.textContent = "@Welcome, " + currentUser;
            logoutBtn.style.display = "inline-block";
            if (loginForm) loginForm.style.display = "none";
            if (masterPageBtn) masterPageBtn.style.display = (currentUser === "MasterLogin") ? "inline-block" : "none";
            if (addListingLink) addListingLink.style.display = "inline-block";
            if (myListingsLink) myListingsLink.style.display = "inline-block";
            if (bookmarksLink) bookmarksLink.style.display = "inline-block";
        } else {
            displayUser.textContent = "";
            logoutBtn.style.display = "none";
            if (loginForm) loginForm.style.display = "flex";
            if (masterPageBtn) masterPageBtn.style.display = "none";
            if (addListingLink) addListingLink.style.display = "none";
            if (myListingsLink) myListingsLink.style.display = "none";
            if (bookmarksLink) bookmarksLink.style.display = "none";
        }
        displayListings();
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value;
            if (users[username] && users[username] === password) {
                localStorage.setItem("loggedInUser", username);
                updateUI();
            } else {
                alert("Invalid credentials");
            }
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener("click", function () {
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value;
            if (!username || !password) return alert("Fill in both fields");
            if (users[username]) return alert("Username already taken");
            users[username] = password;
            localStorage.setItem("users", JSON.stringify(users));
            alert("Registered! Now log in.");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("loggedInUser");
            updateUI();
        });
    }

    // --- Dropdown Filter Menu Logic ---
    if (toggleFilterBtn && filterForm) {
        toggleFilterBtn.addEventListener("click", function () {
            if (filterForm.style.display === "none" || filterForm.style.display === "") {
                filterForm.style.display = "block";
                toggleFilterBtn.innerHTML = 'Filter Listings &#9652;';
            } else {
                filterForm.style.display = "none";
                toggleFilterBtn.innerHTML = 'Filter Listings &#9662;';
            }
        });
    }

    // --- Bookmark Logic ---
    function getBookmarks() {
        const user = localStorage.getItem("loggedInUser");
        if (!user) return [];
        const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");
        return allBookmarks[user] || [];
    }

    function setBookmarks(bookmarks) {
        const user = localStorage.getItem("loggedInUser");
        if (!user) return;
        const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");
        allBookmarks[user] = bookmarks;
        localStorage.setItem("bookmarks", JSON.stringify(allBookmarks));
    }

    function isBookmarked(listingId) {
        return getBookmarks().includes(listingId);
    }

    window.toggleBookmark = function (listingId, btn) {
        const user = localStorage.getItem("loggedInUser");
        if (!user) {
            alert("Please log in to bookmark listings.");
            const usernameInput = document.getElementById('username');
            if (usernameInput) usernameInput.focus();
            return;
        }
        let bookmarks = getBookmarks();
        if (bookmarks.includes(listingId)) {
            bookmarks = bookmarks.filter(id => id !== listingId);
            if (btn) btn.textContent = "Bookmark";
        } else {
            bookmarks.push(listingId);
            if (btn) btn.textContent = "Bookmarked";
        }
        setBookmarks(bookmarks);
        if (btn) btn.classList.toggle("in-bookmarks");
    };

    // --- Delete Listing Logic ---
    function saveListings(listings) {
        localStorage.setItem("listings", JSON.stringify(listings));
    }

    window.deleteListing = function (index) {
        let listings = JSON.parse(localStorage.getItem("listings")) || [];
        if (confirm("Delete this listing?")) {
            listings.splice(index, 1);
            saveListings(listings);
            displayListings();
        }
    };

    // --- Filter Logic ---
    // Sale
    const filterSaleSuburb = document.getElementById("filterSaleSuburb");
    const filterSaleType = document.getElementById("filterSaleType");
    const filterSaleMinPrice = document.getElementById("filterSaleMinPrice");
    const filterSaleMaxPrice = document.getElementById("filterSaleMaxPrice");
    const filterSaleBedrooms = document.getElementById("filterSaleBedrooms");
    const filterSaleBathrooms = document.getElementById("filterSaleBathrooms");
    // Rent
    const filterRentSuburb = document.getElementById("filterRentSuburb");
    const filterRentType = document.getElementById("filterRentType");
    const filterRentMinPrice = document.getElementById("filterRentMinPrice");
    const filterRentMaxPrice = document.getElementById("filterRentMaxPrice");
    const filterRentBedrooms = document.getElementById("filterRentBedrooms");
    const filterRentBathrooms = document.getElementById("filterRentBathrooms");
    // Common
    const searchInput = document.getElementById("searchInput");

    if (filterForm) {
        filterForm.addEventListener("submit", function (e) {
            e.preventDefault();
            displayListings();
        });
    }

    // --- Listing Display ---
    function displayListings() {
        let listings = JSON.parse(localStorage.getItem("listings")) || [];
        // Only show listings of the current mode
        listings = listings.filter(l => l.mode === mode);

        let filtered = listings.filter((listing, idx) => {
            if (mode === "sale") {
                if (filterSaleSuburb && filterSaleSuburb.value && (!listing.suburb || !listing.suburb.toLowerCase().includes(filterSaleSuburb.value.toLowerCase()))) return false;
                if (filterSaleType && filterSaleType.value && listing.type !== filterSaleType.value) return false;
                if (filterSaleMinPrice && filterSaleMinPrice.value && Number(listing.value) < Number(filterSaleMinPrice.value)) return false;
                if (filterSaleMaxPrice && filterSaleMaxPrice.value && Number(listing.value) > Number(filterSaleMaxPrice.value)) return false;
                if (filterSaleBedrooms && filterSaleBedrooms.value && Number(listing.bedrooms || 0) < Number(filterSaleBedrooms.value)) return false;
                if (filterSaleBathrooms && filterSaleBathrooms.value && Number(listing.bathrooms || 0) < Number(filterSaleBathrooms.value)) return false;
            } else {
                if (filterRentSuburb && filterRentSuburb.value && (!listing.suburb || !listing.suburb.toLowerCase().includes(filterRentSuburb.value.toLowerCase()))) return false;
                if (filterRentType && filterRentType.value && listing.type !== filterRentType.value) return false;
                if (filterRentMinPrice && filterRentMinPrice.value && Number(listing.value) < Number(filterRentMinPrice.value)) return false;
                if (filterRentMaxPrice && filterRentMaxPrice.value && Number(listing.value) > Number(filterRentMaxPrice.value)) return false;
                if (filterRentBedrooms && filterRentBedrooms.value && Number(listing.bedrooms || 0) < Number(filterRentBedrooms.value)) return false;
                if (filterRentBathrooms && filterRentBathrooms.value && Number(listing.bathrooms || 0) < Number(filterRentBathrooms.value)) return false;
            }
            if (searchInput && searchInput.value.trim() !== "") {
                const keyword = searchInput.value.trim().toLowerCase();
                if (
                    !(listing.address && listing.address.toLowerCase().includes(keyword)) &&
                    !(listing.description && listing.description.toLowerCase().includes(keyword)) &&
                    !(listing.suburb && listing.suburb.toLowerCase().includes(keyword))
                ) return false;
            }
            return true;
        });

        const listingsContainer = document.getElementById("listingsContainer");
        listingsContainer.innerHTML = "";
        if (filtered.length === 0) {
            listingsContainer.innerHTML = "<p>No listings found.</p>";
            return;
        }
        filtered.forEach((listing, idx) => {
            const div = document.createElement("div");
            div.className = "post";
            div.style.cursor = "pointer";
            div.onclick = function (e) {
                if (e.target.tagName === "BUTTON") return;
                localStorage.setItem("selectedListing", JSON.stringify(listing));
                window.open("listing.html?view=1", "_blank");
            };
            let html = "";

            // Images (show first image, or placeholder)
            if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
                html += `<img src="${listing.images[0]}" alt="Listing Image">`;
            } else {
                html += `<div class="no-image-text">No Pictures to Display</div>`;
            }

            html += `<div class="listing-details">`;
            // Suburb and Type
            html += `<div class="listing-type">${listing.type || "Property"}${listing.suburb ? " - " + listing.suburb : ""}</div>`;
            // Address
            html += `<div class="listing-title">${listing.address || ""}</div>`;
            // Price
            if (mode === "rent") {
                html += `<div class="listing-price">$${Number(listing.value).toLocaleString()} / week</div>`;
            } else {
                html += `<div class="listing-price">$${Number(listing.value).toLocaleString()}</div>`;
            }
            // Meta
            html += `<div class="listing-meta">Bedrooms: ${listing.bedrooms || "-"} | Bathrooms: ${listing.bathrooms || "-"}</div>`;
            // Description (show only first 3 lines)
            const previewDescription = getFirstNLines(listing.description, 3);
            html += `<div class="listing-description">${previewDescription}</div>`;
            // Timestamp
            html += `<div class="timestamp">${listing.time || ""}</div>`;
            // User
            html += `<div style="font-size:0.9em;color:#888;">Listed by: ${listing.user || "Guest"}</div>`;
            // Actions
            html += `<div class="actions">`;
            if (
                (currentUser && (currentUser === "MasterLogin" || currentUser === listing.user))
            ) {
                html += `<button onclick="deleteListing(${idx});event.stopPropagation();" style="background:#e53935;color:#fff;border:none;border-radius:4px;padding:4px 12px;cursor:pointer;">Delete</button>`;
            }
            const listingId = listing.id || idx.toString();
            const isMarked = isBookmarked(listingId);
            html += `<button class="bookmark-btn${isMarked ? ' in-bookmarks' : ''}" onclick="toggleBookmark('${listingId}', this);event.stopPropagation();">
                ${isMarked ? 'Bookmarked' : 'Bookmark'}
            </button>`;
            html += `</div>`; // .actions
            html += `</div>`; // .listing-details
            div.innerHTML = html;
            document.getElementById("listingsContainer").appendChild(div);
        });
    }

    // Initial UI update
    updateUI();
});
