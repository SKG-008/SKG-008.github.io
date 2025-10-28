// Free image utility functions
const ImageUtils = {
  // Compress and resize image
  compressImage(file, maxWidth = 600, quality = 0.7) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  },

  // Convert file to base64 (free storage in database)
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Process image for free storage
  async processImage(file) {
    try {
      // Compress image to reduce size
      const compressedFile = await this.compressImage(file);
      
      // Convert to base64 for database storage
      const base64Data = await this.fileToBase64(compressedFile);
      
      return base64Data;
    } catch (error) {
      console.error('Image processing failed:', error);
      throw error;
    }
  }
};