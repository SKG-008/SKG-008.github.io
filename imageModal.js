// Image modal functionality
function openImageModal(imageSrc, currentIndex = 0, allImages = []) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 8px;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        background: none;
        border: none;
        color: white;
        font-size: 40px;
        cursor: pointer;
        z-index: 1001;
    `;
    
    modal.appendChild(img);
    modal.appendChild(closeBtn);
    
    // Navigation for multiple images
    if (Array.isArray(allImages) && allImages.length > 1) {
        let index = currentIndex;
        
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '‹';
        prevBtn.style.cssText = `
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 30px;
            padding: 10px 15px;
            cursor: pointer;
            border-radius: 50%;
        `;
        
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '›';
        nextBtn.style.cssText = `
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 30px;
            padding: 10px 15px;
            cursor: pointer;
            border-radius: 50%;
        `;
        
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            index = index > 0 ? index - 1 : allImages.length - 1;
            img.src = allImages[index];
        };
        
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            index = index < allImages.length - 1 ? index + 1 : 0;
            img.src = allImages[index];
        };
        
        modal.appendChild(prevBtn);
        modal.appendChild(nextBtn);
    }
    
    // Close modal
    const closeModal = () => document.body.removeChild(modal);
    modal.onclick = closeModal;
    closeBtn.onclick = closeModal;
    
    // Prevent image click from closing modal
    img.onclick = (e) => e.stopPropagation();
    
    document.body.appendChild(modal);
}

// Make function globally available
window.openImageModal = openImageModal;