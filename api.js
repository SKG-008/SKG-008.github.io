// API service for handling listings
// Replace with your Railway app URL or use GitHub Pages fallback
const API_URL = 'https://your-app-name.up.railway.app/api';
const USE_FREE_STORAGE = true; // Set to false when using Railway backend

const ListingsAPI = {
  // Get all listings
  async getListings() {
    if (USE_FREE_STORAGE) {
      // Use localStorage for completely free option
      return JSON.parse(localStorage.getItem('listings') || '[]');
    }
    
    try {
      const response = await fetch(`${API_URL}/listings`);
      if (!response.ok) throw new Error('Failed to fetch listings');
      return await response.json();
    } catch (error) {
      console.error('Error fetching listings:', error);
      // Fallback to localStorage if server is unavailable
      return JSON.parse(localStorage.getItem('listings') || '[]');
    }
  },

  // Add a new listing
  async addListing(listing) {
    const newListing = {...listing, id: Date.now().toString(), createdAt: new Date().toISOString()};
    
    if (USE_FREE_STORAGE) {
      // Use localStorage for completely free option
      const listings = JSON.parse(localStorage.getItem('listings') || '[]');
      listings.push(newListing);
      localStorage.setItem('listings', JSON.stringify(listings));
      return newListing;
    }
    
    try {
      const response = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListing)
      });
      if (!response.ok) throw new Error('Failed to add listing');
      return await response.json();
    } catch (error) {
      console.error('Error adding listing:', error);
      // Fallback to localStorage
      const listings = JSON.parse(localStorage.getItem('listings') || '[]');
      listings.push(newListing);
      localStorage.setItem('listings', JSON.stringify(listings));
      return newListing;
    }
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
    
    try {
      const response = await fetch(`${API_URL}/listings/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete listing');
      return await response.json();
    } catch (error) {
      console.error('Error deleting listing:', error);
      // Fallback to localStorage
      let listings = JSON.parse(localStorage.getItem('listings') || '[]');
      listings = listings.filter(listing => listing.id !== id);
      localStorage.setItem('listings', JSON.stringify(listings));
      return { message: 'Listing deleted locally' };
    }
  }
};