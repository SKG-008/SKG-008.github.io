document.addEventListener("DOMContentLoaded", () => {
    // Login/Register/Logout logic
    const loginForm = document.getElementById("loginForm");
    const logoutBtn = document.getElementById("logoutBtn");
    const displayUser = document.getElementById("displayUser");
    const masterPageBtn = document.getElementById("masterPageBtn");
    const registerBtn = document.getElementById("registerBtn");
    const addListingLink = document.getElementById("addListingLink");
    const myListingsLink = document.getElementById("myListingsLink");

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
        } else {
            displayUser.textContent = "";
            logoutBtn.style.display = "none";
            if (loginForm) loginForm.style.display = "flex";
            if (masterPageBtn) masterPageBtn.style.display = "none";
            if (addListingLink) addListingLink.style.display = "none";
            if (myListingsLink) myListingsLink.style.display = "none";
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

    // Listing display and filter logic
    const listingsContainer = document.getElementById("listingsContainer");
    const searchInput = document.getElementById("searchInput");
    const filterType = document.getElementById("filterType");
    const filterMinPrice = document.getElementById("filterMinPrice");
    const filterMaxPrice = document.getElementById("filterMaxPrice");

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

    function displayListings() {
        let listings = JSON.parse(localStorage.getItem("listings")) || [];
        let filtered = listings.filter((listing, idx) => {
            if (filterType && filterType.value && listing.type !== filterType.value) return false;
            if (filterMinPrice && filterMinPrice.value && Number(listing.value) < Number(filterMinPrice.value)) return false;
            if (filterMaxPrice && filterMaxPrice.value && Number(listing.value) > Number(filterMaxPrice.value)) return false;
            if (searchInput && searchInput.value.trim() !== "") {
                const keyword = searchInput.value.trim().toLowerCase();
                if (
                    !(listing.title && listing.title.toLowerCase().includes(keyword)) &&
                    !(listing.type && listing.type.toLowerCase().includes(keyword)) &&
                    !(listing.description && listing.description.toLowerCase().includes(keyword)) &&
                    !(listing.carMake && listing.carMake.toLowerCase().includes(keyword)) &&
                    !(listing.carModel && listing.carModel.toLowerCase().includes(keyword)) &&
                    !(listing.houseAddress && listing.houseAddress.toLowerCase().includes(keyword))
                ) return false;
            }
            return true;
        });

        listingsContainer.innerHTML = "";
        if (filtered.length === 0) {
            listingsContainer.innerHTML = "<p>No listings found.</p>";
            return;
        }
        filtered.forEach((listing, idx) => {
            const div = document.createElement("div");
            div.className = "listing-card";
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
            // Show delete button for MasterLogin or listing owner
            if (
                (currentUser && (currentUser === "MasterLogin" || currentUser === listing.user))
            ) {
                html += `<div style="margin-top:8px;"><button onclick="deleteListing(${idx})" style="background:#e53935;color:#fff;border:none;border-radius:4px;padding:4px 12px;cursor:pointer;">Delete</button></div>`;
            }
            html += `</div>`;
            div.innerHTML = html;
            listingsContainer.appendChild(div);
        });
    }

    if (searchInput) searchInput.addEventListener("input", displayListings);
    if (filterType) filterType.addEventListener("change", displayListings);
    if (filterMinPrice) filterMinPrice.addEventListener("input", displayListings);
    if (filterMaxPrice) filterMaxPrice.addEventListener("input", displayListings);

    updateUI();
});
