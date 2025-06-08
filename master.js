document.addEventListener("DOMContentLoaded", () => {
    const masterLoginSection = document.getElementById("masterLoginSection");
    const masterLoginForm = document.getElementById("masterLoginForm");
    const masterUsername = document.getElementById("masterUsername");
    const masterPassword = document.getElementById("masterPassword");
    const masterContent = document.getElementById("masterContent");
    const allPostsContainer = document.getElementById("allPostsContainer");
    const allUsersContainer = document.getElementById("allUsersContainer");
    const masterWelcome = document.getElementById("masterWelcome");
    const logoutBtn = document.getElementById("logoutBtn");

    function renderListings() {
        const listings = JSON.parse(localStorage.getItem("listings")) || [];
        allPostsContainer.innerHTML = "";
        if (listings.length === 0) {
            allPostsContainer.innerHTML = "<p>No listings yet.</p>";
            return;
        }
        listings.forEach((listing, index) => {
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
            html += `<div style="margin-top:8px;"><button onclick="deleteListing(${index})" style="background:#e53935;color:#fff;border:none;border-radius:4px;padding:4px 12px;cursor:pointer;">Delete</button></div>`;
            html += `</div>`;
            div.innerHTML = html;
            allPostsContainer.appendChild(div);
        });
    }

    window.deleteListing = function (index) {
        let listings = JSON.parse(localStorage.getItem("listings")) || [];
        if (confirm("Delete this listing?")) {
            listings.splice(index, 1);
            localStorage.setItem("listings", JSON.stringify(listings));
            renderListings();
        }
    };

    function renderUsers() {
        const users = JSON.parse(localStorage.getItem("users")) || {};
        let html = `<table style="width:100%;border-collapse:collapse;">
            <tr><th style="text-align:left;padding:8px;border-bottom:1px solid #ccc;">Username</th>
                <th style="text-align:left;padding:8px;border-bottom:1px solid #ccc;">Password</th></tr>`;
        for (const [user, pass] of Object.entries(users)) {
            html += `<tr>
                <td style="padding:8px;border-bottom:1px solid #eee;">${user}</td>
                <td style="padding:8px;border-bottom:1px solid #eee;">${pass}</td>
            </tr>`;
        }
        html += "</table>";
        allUsersContainer.innerHTML = html;
    }

    function showMasterContent() {
        masterLoginSection.style.display = "none";
        masterContent.style.display = "block";
        masterWelcome.textContent = "Welcome, MasterLogin";
        logoutBtn.style.display = "inline-block";
        renderListings();
        renderUsers();
    }

    function logout() {
        masterLoginSection.style.display = "block";
        masterContent.style.display = "none";
        masterWelcome.textContent = "";
        logoutBtn.style.display = "none";
        masterLoginForm.reset();
    }

    if (masterLoginForm) {
        masterLoginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            if (
                masterUsername.value === "MasterLogin" &&
                masterPassword.value === "MasterLogin"
            ) {
                showMasterContent();
            } else {
                alert("Invalid master credentials.");
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            logout();
        });
    }
});

