// Image modal functionality
function openImageModal(imageSrc, currentIndex, allImages) {
    const images = JSON.parse(allImages.replace(/&quot;/g, '"'));
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.9); z-index: 2000; display: flex; 
        align-items: center; justify-content: center; flex-direction: column;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 90%; max-height: 80%; object-fit: contain; 
        border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;
    
    const controls = document.createElement('div');
    controls.style.cssText = `
        display: flex; gap: 20px; margin-top: 20px; align-items: center;
    `;
    
    if (images.length > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Previous';
        prevBtn.style.cssText = `
            background: #1877f2; color: white; border: none; padding: 10px 20px; 
            border-radius: 5px; cursor: pointer; font-size: 16px;
        `;
        prevBtn.onclick = () => {
            const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
            img.src = images[newIndex];
            currentIndex = newIndex;
            counter.textContent = `${currentIndex + 1} / ${images.length}`;
        };
        
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.style.cssText = `
            background: #1877f2; color: white; border: none; padding: 10px 20px; 
            border-radius: 5px; cursor: pointer; font-size: 16px;
        `;
        nextBtn.onclick = () => {
            const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
            img.src = images[newIndex];
            currentIndex = newIndex;
            counter.textContent = `${currentIndex + 1} / ${images.length}`;
        };
        
        const counter = document.createElement('span');
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
        counter.style.cssText = 'color: white; font-size: 16px; font-weight: bold;';
        
        controls.appendChild(prevBtn);
        controls.appendChild(counter);
        controls.appendChild(nextBtn);
    }
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = `
        background: #666; color: white; border: none; padding: 10px 20px; 
        border-radius: 5px; cursor: pointer; font-size: 16px;
    `;
    closeBtn.onclick = () => document.body.removeChild(modal);
    
    controls.appendChild(closeBtn);
    
    modal.appendChild(img);
    modal.appendChild(controls);
    
    modal.onclick = (e) => {
        if (e.target === modal) document.body.removeChild(modal);
    };
    
    // Keyboard navigation
    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleKeyPress);
        } else if (e.key === 'ArrowLeft' && images.length > 1) {
            const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
            img.src = images[newIndex];
            currentIndex = newIndex;
            if (controls.querySelector('span')) {
                controls.querySelector('span').textContent = `${currentIndex + 1} / ${images.length}`;
            }
        } else if (e.key === 'ArrowRight' && images.length > 1) {
            const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
            img.src = images[newIndex];
            currentIndex = newIndex;
            if (controls.querySelector('span')) {
                controls.querySelector('span').textContent = `${currentIndex + 1} / ${images.length}`;
            }
        }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    document.body.appendChild(modal);
}