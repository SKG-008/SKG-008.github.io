document.addEventListener("DOMContentLoaded", () => {
    const bookmarksContainer = document.getElementById("bookmarksContainer");
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
        bookmarksContainer.innerHTML = "<p>Please log in to view your bookmarks.</p>";
        return;
    }
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");
    const bookmarks = allBookmarks[user] || [];
    const listings = JSON.parse(localStorage.getItem("listings") || "[]");
    const bookmarkedListings = listings.filter((listing, idx) =>
        bookmarks.includes(listing.id || idx.toString())
    );
    if (bookmarkedListings.length === 0) {
        bookmarksContainer.innerHTML = "<p>No bookmarks yet.</p>";
        return;
    }
    bookmarkedListings.forEach((listing, idx) => {
        const div = document.createElement("div");
        div.className = "post";
        let html = "";
        if (listing.image) {
            html += `<img src="${listing.image}" alt="Listing Image">`;
        } else {
            html += `<img src="https://via.placeholder.com/180x120?text=No+Image" alt="No Image">`;
        }
        html += `<div class="listing-details">`;
        html += `<div class="listing-type">${listing.type}</div>`;
        html += `<div class="listing-title">${listing.title}</div>`;
        html += `<div class="listing-price">$${listing.value}</div>`;
        if (listing.type === "Car") {
            html += `<div class="listing-meta">Make: ${listing.carMake || "-"} | Model: ${listing.carModel || "-"} | Year: ${listing.carYear || "-"} | Mileage: ${listing.carMileage || "-"} km</div>`;
        }
        if (listing.type === "House") {
            html += `<div class="listing-meta">Bedrooms: ${listing.houseBedrooms || "-"} | Bathrooms: ${listing.houseBathrooms || "-"} | Land Size: ${listing.houseLandSize || "-"} sqm | Address: ${listing.houseAddress || "-"}</div>`;
        }
        html += `<div class="listing-description">${listing.description}</div>`;
        html += `<div class="timestamp">${listing.time}</div>`;
        html += `<div style="font-size:0.9em;color:#888;">Listed by: ${listing.user || "Guest"}</div>`;
        html += `</div>`;
        div.innerHTML = html;
        bookmarksContainer.appendChild(div);
    });
});
