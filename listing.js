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

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const isView = urlParams.has("view");
    const formContainer = document.getElementById("listingFormContainer");
    const fullListingContainer = document.getElementById("fullListing");

    // Show add form if not in view mode and no selectedListing
    if (formContainer && !isView) {
        localStorage.removeItem("selectedListing");
        let formHtml = `
            <h2>Add Property Listing</h2>
            <form id="listingForm" enctype="multipart/form-data">
                <label for="listingMode">Listing Type</label>
                <select id="listingMode" required>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                </select>

                <label for="listingAddress">Address</label>
                <input type="text" id="listingAddress" required>

                <label for="listingSuburb">Suburb</label>
                <input type="text" id="listingSuburb" required>

                <label for="listingType">Property Type</label>
                <select id="listingType" required>
                    <option value="">Select</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Unit">Unit</option>
                    <option value="Studio">Studio</option>
                </select>

                <label for="listingLandSize">Land Size (sqm)</label>
                <input type="number" id="listingLandSize" min="0">

                <div id="salePriceGroup">
                    <label for="listingSalePrice">Sale Price ($)</label>
                    <input type="number" id="listingSalePrice" min="0">
                </div>
                <div id="rentPriceGroup" style="display:none;">
                    <label for="listingRentPrice">Rent per week ($)</label>
                    <input type="number" id="listingRentPrice" min="0">
                </div>

                <label for="listingBedrooms">Bedrooms</label>
                <input type="number" id="listingBedrooms" required min="0">

                <label for="listingBathrooms">Bathrooms</label>
                <input type="number" id="listingBathrooms" required min="0">

                <label for="listingCarPark">Car Park</label>
                <input type="number" id="listingCarPark" min="0">

                <label for="listingParkingType">Type of Parking</label>
                <select id="listingParkingType">
                    <option value="">Select</option>
                    <option value="Garage">Garage</option>
                    <option value="Carport">Carport</option>
                    <option value="Open">Open</option>
                    <option value="Street">Street</option>
                    <option value="None">None</option>
                </select>

                <label for="listingInspectionDates">Inspection Dates</label>
                <input type="text" id="listingInspectionDates" placeholder="e.g. Sat 10am-11am, Sun 2pm-3pm">

                <label for="listingDescription">Description</label>
                <textarea id="listingDescription" required></textarea>

                <label for="listingImages">Images</label>
                <input type="file" id="listingImages" name="listingImages" accept="image/*" multiple>

                <button type="submit" class="filter-btn">Add Listing</button>
            </form>
        `;
        formContainer.innerHTML = formHtml;

        // Toggle price fields based on listing type
        const listingMode = document.getElementById("listingMode");
        const salePriceGroup = document.getElementById("salePriceGroup");
        const rentPriceGroup = document.getElementById("rentPriceGroup");
        listingMode.addEventListener("change", function () {
            if (listingMode.value === "rent") {
                salePriceGroup.style.display = "none";
                rentPriceGroup.style.display = "";
            } else {
                salePriceGroup.style.display = "";
                rentPriceGroup.style.display = "none";
            }
        });

        const form = document.getElementById("listingForm");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const mode = document.getElementById("listingMode").value;
            const address = document.getElementById("listingAddress").value.trim();
            const suburb = document.getElementById("listingSuburb").value.trim();
            const type = document.getElementById("listingType").value;
            const landSize = document.getElementById("listingLandSize").value;
            const salePrice = document.getElementById("listingSalePrice").value;
            const rentPrice = document.getElementById("listingRentPrice").value;
            const value = mode === "rent" ? rentPrice : salePrice;
            const bedrooms = document.getElementById("listingBedrooms").value;
            const bathrooms = document.getElementById("listingBathrooms").value;
            const carPark = document.getElementById("listingCarPark").value;
            const parkingType = document.getElementById("listingParkingType").value;
            const inspectionDates = document.getElementById("listingInspectionDates").value.trim();
            const description = document.getElementById("listingDescription").value.trim();
            const imagesInput = document.getElementById("listingImages");

            // Profanity check
            if (containsRudeWordAI(address) || containsRudeWordAI(description)) {
                alert("Your listing contains inappropriate language. Please remove any rude words.");
                return;
            }

            // Read images as Data URLs
            const files = Array.from(imagesInput.files);
            let imageDataArray = [];
            if (files.length > 0) {
                let loaded = 0;
                files.forEach((file, idx) => {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        imageDataArray[idx] = event.target.result;
                        loaded++;
                        if (loaded === files.length) {
                            saveListing();
                        }
                    };
                    reader.readAsDataURL(file);
                });
            } else {
                saveListing();
            }

            async function saveListing() {
                const user = localStorage.getItem("loggedInUser") || "Guest";
                const newListing = {
                    mode,
                    address,
                    suburb,
                    type,
                    landSize,
                    value,
                    bedrooms,
                    bathrooms,
                    carPark,
                    parkingType,
                    inspectionDates,
                    description,
                    images: imageDataArray,
                    user,
                    time: new Date().toLocaleString()
                };
                
                try {
                    await ListingsAPI.addListing(newListing);
                    alert("Listing added!");
                    window.location.href = "index.html?" + mode;
                } catch (error) {
                    console.error("Error saving listing:", error);
                    alert("Failed to save listing. Please try again.");
                }
            }
        });
        return;
    }

    // Otherwise, show the full listing if selectedListing exists
    const listing = JSON.parse(localStorage.getItem("selectedListing"));
    if (listing && fullListingContainer) {
        let html = "";

        // Back button at top left
        html += `<button id="backBtn" style="position:absolute;left:24px;top:24px;z-index:10;background:#1877f2;color:#fff;border:none;border-radius:6px;padding:8px 18px;font-weight:600;cursor:pointer;">&#8592; Back</button>`;

        // Multiple images or placeholder
        if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
            html += `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:56px;margin-bottom:16px;">`;
            listing.images.forEach(img =>
                html += `<img src="${img}" alt="Listing Image" style="max-width:220px;max-height:160px;border-radius:8px;border:1px solid #eee;">`
            );
            html += `</div>`;
        } else {
            html += `<div class="no-image-text" style="margin-top:56px;margin-bottom:16px;">No Pictures to Display</div>`;
        }

        html += `<div class="listing-type">${listing.type || "Property"}${listing.suburb ? " - " + listing.suburb : ""}</div>`;
        html += `<div class="listing-title">${listing.address}</div>`;
        html += `<div class="listing-price">${listing.mode === "rent" ? "$" + Number(listing.value).toLocaleString() + " / week" : "$" + Number(listing.value).toLocaleString()}</div>`;
        html += `<div class="listing-meta">Land Size: ${listing.landSize || "-"} sqm | Bedrooms: ${listing.bedrooms || "-"} | Bathrooms: ${listing.bathrooms || "-"}</div>`;
        html += `<div class="listing-meta">Car Park: ${listing.carPark || "-"} | Parking Type: ${listing.parkingType || "-"}</div>`;
        html += `<div class="listing-meta">Inspection Dates: ${listing.inspectionDates || "-"}</div>`;
        html += `<div class="listing-description" style="white-space:pre-line;margin-top:12px;">${listing.description}</div>`;
        html += `<div class="timestamp">${listing.time || ""}</div>`;
        html += `<div style="font-size:0.9em;color:#888;">Listed by: ${listing.user || "Guest"}</div>`;

        fullListingContainer.innerHTML = html;

        // Back button logic
        const backBtn = document.getElementById("backBtn");
        if (backBtn) {
            backBtn.addEventListener("click", function () {
                localStorage.removeItem("selectedListing");
                window.history.length > 1 ? window.history.back() : window.location.href = "index.html?" + (listing.mode || "sale");
            });
        }
    }
});
