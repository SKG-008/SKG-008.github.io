// API service for handling listings - Free GitHub Pages storage
const USE_FREE_STORAGE = true; // Always use free storage

const ListingsAPI = {
  // Get all listings from server
  async getListings() {
    if (window.ServerSync) {
      return ServerSync.getListings();
    }
    return [];
  },

  // Add a new listing to server
  async addListing(listing) {
    if (window.ServerSync) {
      return await ServerSync.addListing(listing);
    }
    return null;
  },

  // Delete a listing from server
  async deleteListing(id) {
    if (window.ServerSync) {
      await ServerSync.deleteListing(id);
      return { message: 'Listing deleted' };
    }
    return { message: 'Delete failed' };
  },
  
  // Sync listings to GitHub format
  syncToGitHub(listings) {
    const dataStr = JSON.stringify(listings, null, 2);
    localStorage.setItem('githubListings', dataStr);
    
    // Auto-download for GitHub upload
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'listings.json';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Listings auto-exported for GitHub upload');
  },
  
  // Sync users to GitHub format
  syncUsersToGitHub() {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const dataStr = JSON.stringify(users, null, 2);
    
    // Auto-download for GitHub upload
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.json';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Users auto-exported for GitHub upload');
  }
};

// Make ListingsAPI globally available
window.ListingsAPI = ListingsAPI;