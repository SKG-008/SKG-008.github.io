// Share functionality for listings
function shareListing(listing) {
    const shareUrl = `${window.location.origin}/listing.html?view=1&id=${listing.id}`;
    const shareText = `Check out this ${listing.type} in ${listing.suburb || 'Unknown'} - $${Number(listing.value).toLocaleString()}${listing.mode === 'rent' ? '/week' : ''}`;
    
    // Check if Web Share API is supported (mobile devices)
    if (navigator.share) {
        navigator.share({
            title: `${listing.type} - ${listing.address}`,
            text: shareText,
            url: shareUrl
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Show share options
        showShareModal(shareText, shareUrl);
    }
}

function showShareModal(text, url) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.5); z-index: 1000; display: flex; 
        align-items: center; justify-content: center;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white; padding: 20px; border-radius: 8px; 
        max-width: 400px; width: 90%;
    `;
    
    content.innerHTML = `
        <h3>Share Listing</h3>
        <div style="margin: 15px 0;">
            <button onclick="shareToWhatsApp('${encodeURIComponent(text)}', '${url}')" 
                    style="background: #25D366; color: white; border: none; padding: 10px 15px; margin: 5px; border-radius: 5px; cursor: pointer;">
                WhatsApp
            </button>
            <button onclick="shareToFacebook('${url}')" 
                    style="background: #1877F2; color: white; border: none; padding: 10px 15px; margin: 5px; border-radius: 5px; cursor: pointer;">
                Facebook
            </button>
            <button onclick="shareToTwitter('${encodeURIComponent(text)}', '${url}')" 
                    style="background: #1DA1F2; color: white; border: none; padding: 10px 15px; margin: 5px; border-radius: 5px; cursor: pointer;">
                Twitter
            </button>
            <button onclick="copyToClipboard('${url}')" 
                    style="background: #666; color: white; border: none; padding: 10px 15px; margin: 5px; border-radius: 5px; cursor: pointer;">
                Copy Link
            </button>
        </div>
        <button onclick="closeShareModal()" 
                style="background: #ccc; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
            Close
        </button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    modal.onclick = (e) => {
        if (e.target === modal) closeShareModal();
    };
    
    window.currentShareModal = modal;
}

function shareToWhatsApp(text, url) {
    window.open(`https://wa.me/?text=${text}%20${encodeURIComponent(url)}`, '_blank');
    closeShareModal();
}

function shareToFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    closeShareModal();
}

function shareToTwitter(text, url) {
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
    closeShareModal();
}

function copyToClipboard(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
        closeShareModal();
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
        closeShareModal();
    });
}

function closeShareModal() {
    if (window.currentShareModal) {
        document.body.removeChild(window.currentShareModal);
        window.currentShareModal = null;
    }
}