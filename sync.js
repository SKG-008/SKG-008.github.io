// Simple utility to sync listings between localStorage and the data file
document.addEventListener('DOMContentLoaded', () => {
  const syncBtn = document.getElementById('syncBtn');
  if (syncBtn) {
    syncBtn.addEventListener('click', syncListings);
  }
});

async function syncListings() {
  try {
    // Get current listings from localStorage
    const localListings = JSON.parse(localStorage.getItem('listings') || '[]');
    
    // Create a downloadable file
    const dataStr = JSON.stringify(localListings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'listings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert('Listings exported! Replace the listings.json file in your GitHub repository with this file.');
  } catch (error) {
    console.error('Error syncing listings:', error);
    alert('Error exporting listings. See console for details.');
  }
}