// API service for handling listings
const API_URL = 'http://localhost:3000/api';

const ListingsAPI = {
  // Get all listings
  async getListings() {
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
    try {
      const response = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing)
      });
      if (!response.ok) throw new Error('Failed to add listing');
      return await response.json();
    } catch (error) {
      console.error('Error adding listing:', error);
      // Fallback to localStorage
      const listings = JSON.parse(localStorage.getItem('listings') || '[]');
      listings.push({...listing, id: Date.now().toString()});
      localStorage.setItem('listings', JSON.stringify(listings));
      return listing;
    }
  },

  // Delete a listing
  async deleteListing(id) {
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
      listings = listings.filter((_, index) => index.toString() !== id);
      localStorage.setItem('listings', JSON.stringify(listings));
      return { message: 'Listing deleted locally' };
    }
  },

  // Update a listing
  async updateListing(id, listing) {
    try {
      const response = await fetch(`${API_URL}/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing)
      });
      if (!response.ok) throw new Error('Failed to update listing');
      return await response.json();
    } catch (error) {
      console.error('Error updating listing:', error);
      // Fallback to localStorage
      let listings = JSON.parse(localStorage.getItem('listings') || '[]');
      const index = listings.findIndex((_, idx) => idx.toString() === id);
      if (index !== -1) {
        listings[index] = {...listings[index], ...listing};
        localStorage.setItem('listings', JSON.stringify(listings));
      }
      return listing;
    }
  }
};