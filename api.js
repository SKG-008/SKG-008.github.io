// API service for handling listings - Free GitHub Pages storage
const USE_FREE_STORAGE = true; // Always use free storage

const ListingsAPI = {
  // Get all listings
  async getListings() {
    if (USE_FREE_STORAGE) {
      // Try to load from GitHub first, fallback to localStorage
      try {
        const response = await fetch('data/listings.json');
        if (response.ok) {
          const githubListings = await response.json();
          // Merge with localStorage
          const localListings = JSON.parse(localStorage.getItem('listings') || '[]');
          const merged = [...githubListings, ...localListings.filter(local => 
            !githubListings.find(github => github.id === local.id)
          )];
          return merged;
        }
      } catch (error) {
        console.log('GitHub sync not available, using localStorage');
      }
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem('listings') || '[]');
    }
    
    // Free storage only - no paid backend needed
    return JSON.parse(localStorage.getItem('listings') || '[]');
  },

  // Add a new listing
  async addListing(listing) {
    const newListing = {...listing, id: Date.now().toString(), createdAt: new Date().toISOString()};
    
    if (USE_FREE_STORAGE) {
      // Use localStorage for completely free option
      const listings = JSON.parse(localStorage.getItem('listings') || '[]');
      listings.push(newListing);
      localStorage.setItem('listings', JSON.stringify(listings));
      
      // Auto-sync to GitHub if enabled
      if (localStorage.getItem('autoSyncEnabled') === 'true') {
        ListingsAPI.syncToGitHub(listings);
      }
      
      return newListing;
    }
    
    // Free storage only
    const listings = JSON.parse(localStorage.getItem('listings') || '[]');
    listings.push(newListing);
    localStorage.setItem('listings', JSON.stringify(listings));
    return newListing;
  },

  // Delete a listing
  async deleteListing(id) {
    if (USE_FREE_STORAGE) {
      // Use localStorage for completely free option
      let listings = JSON.parse(localStorage.getItem('listings') || '[]');
      listings = listings.filter(listing => listing.id !== id);
      localStorage.setItem('listings', JSON.stringify(listings));
      return { message: 'Listing deleted' };
    }
    
    // Free storage only
    let listings = JSON.parse(localStorage.getItem('listings') || '[]');
    listings = listings.filter(listing => listing.id !== id);
    localStorage.setItem('listings', JSON.stringify(listings));
    return { message: 'Listing deleted' };
  },
  
  // Sync listings to GitHub format
  syncToGitHub(listings) {
    const dataStr = JSON.stringify(listings, null, 2);
    localStorage.setItem('githubListings', dataStr);
    console.log('Listings synced to GitHub format');
  }
};