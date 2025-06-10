document.addEventListener("DOMContentLoaded", () => {
    const bookmarksContainer = document.getElementById("bookmarksContainer");
    const displayUser = document.getElementById("displayUser");
    const logoutBtn = document.getElementById("logoutBtn");
    let currentUser = localStorage.getItem("loggedInUser");

    function getBookmarks() {
        if (!currentUser) return [];
        const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");
        return allBookmarks[currentUser] || [];
    }

    function displayBookmarks() {
        let listings = JSON.parse(localStorage.getItem("listings")) || [];
        let bookmarks = getBookmarks();

        bookmarksContainer.innerHTML = "";
        if (!currentUser) {
            bookmarksContainer.innerHTML = "<p>Please log in to view your bookmarks.</p>";
            return;
        }
        if (bookmarks.length === 0) {
            bookmarksContainer.innerHTML = "<p>You have no bookmarks.</p>";
            return;
        }

        // Find the full listing object for each bookmark
        let bookmarkedListings = bookmarks
            .map(id => listings[id] || null)
            .filter(l => l);

        if (bookmarkedListings.length === 0) {
            bookmarksContainer.innerHTML = "<p>No bookmarked listings found.</p>";
            return;
        }

        bookmarkedListings.forEach((listing, idx) => {
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
            if (listing.mode === "rent") {
                html += `<div class="listing-price">$${Number(listing.value).toLocaleString()} / week</div>`;
            } else {
                html += `<div class="listing-price">$${Number(listing.value).toLocaleString()}</div>`;
            }
            // Meta
            html += `<div class="listing-meta">Land Size: ${listing.landSize || "-"} sqm | Bedrooms: ${listing.bedrooms || "-"} | Bathrooms: ${listing.bathrooms || "-"}</div>`;
            html += `<div class="listing-meta">Car Park: ${listing.carPark || "-"} | Parking Type: ${listing.parkingType || "-"}</div>`;
            html += `<div class="listing-meta">Inspection Dates: ${listing.inspectionDates || "-"}</div>`;
            // Description (show only first 3 lines)
            html += `<div class="listing-description">${listing.description || ""}</div>`;
            // Timestamp
            html += `<div class="timestamp">${listing.time || ""}</div>`;
            // User
            html += `<div style="font-size:0.9em;color:#888;">Listed by: ${listing.user || "Guest"}</div>`;
            html += `</div>`; // .listing-details
            div.innerHTML = html;
            bookmarksContainer.appendChild(div);
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("loggedInUser");
            window.location.href = "index.html";
        });
    }

    if (displayUser) {
        displayUser.textContent = currentUser ? "Welcome, " + currentUser : "";
        logoutBtn.style.display = currentUser ? "inline-block" : "none";
    }

    displayBookmarks();
});
