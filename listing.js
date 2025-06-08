document.addEventListener("DOMContentLoaded", () => {
    // Login/Register/Logout logic
    const loginForm = document.getElementById("loginForm");
    const logoutBtn = document.getElementById("logoutBtn");
    const displayUser = document.getElementById("displayUser");
    const masterPageBtn = document.getElementById("masterPageBtn");
    const registerBtn = document.getElementById("registerBtn");
    const listingFormSection = document.getElementById("listingFormSection");

    let users = JSON.parse(localStorage.getItem("users")) || {};
    let currentUser = localStorage.getItem("loggedInUser");

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
            if (listingFormSection) listingFormSection.style.display = "block";
        } else {
            displayUser.textContent = "";
            logoutBtn.style.display = "none";
            if (loginForm) loginForm.style.display = "flex";
            if (masterPageBtn) masterPageBtn.style.display = "none";
            if (listingFormSection) listingFormSection.style.display = "none";
        }
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

    updateUI();

    // Listing form logic
    const listingForm = document.getElementById("listingForm");
    const listingType = document.getElementById("listingType");
    const carFields = document.getElementById("carFields");
    const houseFields = document.getElementById("houseFields");
    const imageLoadingBar = document.getElementById("imageLoadingBar");
    const imageLoadingProgress = document.getElementById("imageLoadingProgress");
    const imageLoadingText = document.getElementById("imageLoadingText");

    if (listingType) {
        listingType.addEventListener("change", function () {
            if (listingType.value === "Car") {
                carFields.style.display = "block";
                houseFields.style.display = "none";
            } else if (listingType.value === "House") {
                carFields.style.display = "none";
                houseFields.style.display = "block";
            } else {
                carFields.style.display = "none";
                houseFields.style.display = "none";
            }
        });
    }

    if (listingForm) {
        listingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const type = listingType.value;
            const title = document.getElementById("listingTitle").value.trim();
            const value = document.getElementById("listingValue").value.trim();
            const description = document.getElementById("listingDescription").value.trim();
            const file = document.getElementById("listingImage").files[0];

            // Car fields
            const carMake = document.getElementById("carMake").value.trim();
            const carModel = document.getElementById("carModel").value.trim();
            const carYear = document.getElementById("carYear").value.trim();
            const carMileage = document.getElementById("carMileage").value.trim();

            // House fields
            const houseBedrooms = document.getElementById("houseBedrooms").value.trim();
            const houseBathrooms = document.getElementById("houseBathrooms").value.trim();
            const houseLandSize = document.getElementById("houseLandSize").value.trim();
            const houseAddress = document.getElementById("houseAddress").value.trim();

            function addListing(imageData) {
                const newListing = {
                    type,
                    title,
                    value,
                    description,
                    image: imageData,
                    time: new Date().toLocaleString(),
                    user: localStorage.getItem("loggedInUser") || "Guest",
                    carMake, carModel, carYear, carMileage,
                    houseBedrooms, houseBathrooms, houseLandSize, houseAddress
                };
                let listings = JSON.parse(localStorage.getItem("listings")) || [];
                listings.unshift(newListing);
                localStorage.setItem("listings", JSON.stringify(listings));
                alert("Listing added!");
                listingForm.reset();
                carFields.style.display = "none";
                houseFields.style.display = "none";
                if (imageLoadingBar) {
                    imageLoadingBar.style.display = "none";
                    imageLoadingProgress.style.width = "0%";
                }
            }

            if (file) {
                if (imageLoadingBar) {
                    imageLoadingBar.style.display = "block";
                    imageLoadingProgress.style.width = "0%";
                    imageLoadingText.textContent = "Uploading image...";
                }
                const reader = new FileReader();
                reader.onprogress = function (event) {
                    if (event.lengthComputable && imageLoadingProgress) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        imageLoadingProgress.style.width = percent + "%";
                    }
                };
                reader.onloadstart = function () {
                    if (imageLoadingProgress) imageLoadingProgress.style.width = "0%";
                };
                reader.onload = function () {
                    addListing(reader.result);
                };
                reader.onloadend = function () {
                    if (imageLoadingProgress) imageLoadingProgress.style.width = "100%";
                    if (imageLoadingText) imageLoadingText.textContent = "Image uploaded!";
                    setTimeout(() => {
                        if (imageLoadingBar) imageLoadingBar.style.display = "none";
                        imageLoadingProgress.style.width = "0%";
                    }, 800);
                };
                reader.readAsDataURL(file);
            } else {
                addListing(null);
            }
        });
    }
});


