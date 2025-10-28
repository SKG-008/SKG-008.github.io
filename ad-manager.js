// Ad Management System
const AdManager = {
    ads: JSON.parse(localStorage.getItem('siteAds') || '[]'),
    
    // Add new ad
    addAd(position, imageUrl, link, title) {
        const ad = {
            id: Date.now().toString(),
            position,
            imageUrl,
            link,
            title,
            clicks: 0,
            views: 0,
            active: true
        };
        this.ads.push(ad);
        this.saveAds();
        this.renderAds();
    },
    
    // Save ads to localStorage
    saveAds() {
        localStorage.setItem('siteAds', JSON.stringify(this.ads));
    },
    
    // Track ad click
    trackClick(adId) {
        const ad = this.ads.find(a => a.id === adId);
        if (ad) {
            ad.clicks++;
            this.saveAds();
        }
    },
    
    // Track ad view
    trackView(adId) {
        const ad = this.ads.find(a => a.id === adId);
        if (ad) {
            ad.views++;
            this.saveAds();
        }
    },
    
    // Render ads in their positions
    renderAds() {
        const positions = ['header-banner', 'sidebar-top', 'sidebar-bottom', 'content-top', 'content-middle', 'content-bottom'];
        
        positions.forEach(position => {
            const container = document.getElementById(`ad-${position}`);
            if (!container) return;
            
            const ad = this.ads.find(a => a.position === position && a.active);
            if (ad) {
                container.innerHTML = `
                    <div class="ad-container" data-position="${position}">
                        <span class="ad-label">Advertisement</span>
                        <a href="${ad.link}" target="_blank" onclick="AdManager.trackClick('${ad.id}')" class="ad-link">
                            <img src="${ad.imageUrl}" alt="${ad.title}" class="ad-image">
                        </a>
                    </div>
                `;
                this.trackView(ad.id);
            } else {
                container.innerHTML = `
                    <div class="ad-placeholder" data-position="${position}">
                        <span>Ad Space Available</span>
                        <small>${position.replace('-', ' ').toUpperCase()}</small>
                    </div>
                `;
            }
        });
    }
};

// Initialize ads when page loads
document.addEventListener('DOMContentLoaded', () => {
    AdManager.renderAds();
});