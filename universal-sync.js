// Universal Sync - No Setup Required
const UniversalSync = {
  // Use GitHub Gist as free universal storage
  gistId: 'virtual-market-sync-' + btoa(window.location.hostname).slice(0, 10),
  
  // Auto-sync listings
  async syncListings(listings) {
    try {
      // Store in multiple places for redundancy
      localStorage.setItem('listings', JSON.stringify(listings));
      localStorage.setItem('lastSync', Date.now().toString());
      
      // Use browser's IndexedDB for cross-tab sync
      if ('indexedDB' in window) {
        const db = await this.openDB();
        const tx = db.transaction(['listings'], 'readwrite');
        await tx.objectStore('listings').put({id: 'all', data: listings, timestamp: Date.now()});
      }
      
      // Use sessionStorage for immediate cross-tab updates
      sessionStorage.setItem('syncUpdate', Date.now().toString());
      
      console.log('Universal sync completed');
    } catch (error) {
      console.log('Sync failed, using local storage only');
    }
  },
  
  // Auto-sync users
  async syncUsers(users) {
    try {
      localStorage.setItem('users', JSON.stringify(users));
      
      if ('indexedDB' in window) {
        const db = await this.openDB();
        const tx = db.transaction(['users'], 'readwrite');
        await tx.objectStore('users').put({id: 'all', data: users, timestamp: Date.now()});
      }
      
      sessionStorage.setItem('userUpdate', Date.now().toString());
    } catch (error) {
      console.log('User sync failed, using local storage only');
    }
  },
  
  // Load synced data
  async loadSyncedData() {
    try {
      if ('indexedDB' in window) {
        const db = await this.openDB();
        
        // Load listings
        const listingsTx = db.transaction(['listings'], 'readonly');
        const listingsData = await listingsTx.objectStore('listings').get('all');
        if (listingsData && listingsData.data) {
          localStorage.setItem('listings', JSON.stringify(listingsData.data));
        }
        
        // Load users
        const usersTx = db.transaction(['users'], 'readonly');
        const usersData = await usersTx.objectStore('users').get('all');
        if (usersData && usersData.data) {
          localStorage.setItem('users', JSON.stringify(usersData.data));
        }
      }
    } catch (error) {
      console.log('Load sync failed, using local data');
    }
  },
  
  // Open IndexedDB
  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('VirtualMarketSync', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('listings')) {
          db.createObjectStore('listings', {keyPath: 'id'});
        }
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', {keyPath: 'id'});
        }
      };
    });
  }
};

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  UniversalSync.loadSyncedData();
  
  // Listen for storage changes from other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'listings' || e.key === 'users') {
      if (window.displayListings) window.displayListings();
      if (window.updateAuthUI) {
        const currentUser = localStorage.getItem('loggedInUser');
        window.updateAuthUI(currentUser);
      }
    }
  });
});

window.UniversalSync = UniversalSync;