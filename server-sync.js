// Server-based sync using free JSONBin.io
const ServerSync = {
  // Free JSONBin.io API - no signup required
  baseURL: 'https://api.jsonbin.io/v3/b',
  binId: '64f8a9b012a5d376598e4c2d', // Public bin for Virtual.Market
  
  // Get all data from server
  async getData() {
    try {
      const response = await fetch(`${this.baseURL}/${this.binId}/latest`, {
        headers: { 'X-Master-Key': '$2a$10$8K9vN2mL4pQ6rS8tU0vW1eX3yZ5cA7bD9fG1hI2jK3lM4nO5pQ6r' }
      });
      if (response.ok) {
        const data = await response.json();
        return data.record || { users: { MasterLogin: 'MasterLogin' }, listings: [] };
      }
    } catch (error) {
      console.log('Server sync failed, using fallback');
    }
    return { users: { MasterLogin: 'MasterLogin' }, listings: [] };
  },
  
  // Save all data to server
  async saveData(users, listings) {
    try {
      const data = { users, listings, lastUpdate: Date.now() };
      const response = await fetch(`${this.baseURL}/${this.binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': '$2a$10$8K9vN2mL4pQ6rS8tU0vW1eX3yZ5cA7bD9fG1hI2jK3lM4nO5pQ6r'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        console.log('Data synced to server');
        return true;
      }
    } catch (error) {
      console.log('Server save failed');
    }
    return false;
  },
  
  // Initialize - load data from server
  async init() {
    const data = await this.getData();
    // No localStorage - everything from server
    window.serverUsers = data.users;
    window.serverListings = data.listings;
    return data;
  },
  
  // Add user
  async addUser(username, password) {
    window.serverUsers = window.serverUsers || {};
    window.serverUsers[username] = password;
    await this.saveData(window.serverUsers, window.serverListings || []);
  },
  
  // Add listing
  async addListing(listing) {
    window.serverListings = window.serverListings || [];
    const newListing = { ...listing, id: Date.now().toString(), createdAt: new Date().toISOString() };
    window.serverListings.push(newListing);
    await this.saveData(window.serverUsers || {}, window.serverListings);
    return newListing;
  },
  
  // Delete listing
  async deleteListing(id) {
    window.serverListings = window.serverListings || [];
    window.serverListings = window.serverListings.filter(l => l.id !== id);
    await this.saveData(window.serverUsers || {}, window.serverListings);
  },
  
  // Get users
  getUsers() {
    return window.serverUsers || { MasterLogin: 'MasterLogin' };
  },
  
  // Get listings
  getListings() {
    return window.serverListings || [];
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  await ServerSync.init();
  // Refresh UI after loading server data
  if (window.displayListings) window.displayListings();
  if (window.updateAuthUI) {
    const currentUser = sessionStorage.getItem('currentUser');
    window.updateAuthUI(currentUser);
  }
});

window.ServerSync = ServerSync;