/**
 * Utility for validating and compressing user/admin uploaded images using HTML5 Canvas.
 * Prevents server flooding and keeps stored image sizes minimal (<100KB-200KB WebP/JPEG).
 */

export const processUploadedImage = (file, maxWidth = 800, maxFileSizeBytes = 5 * 1024 * 1024) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve(null);
    }

    // 1. Validate file type
    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid file type. Please select a valid image (JPEG, PNG, WebP).'));
    }

    // 2. Validate maximum file size (Limit e.g. 5MB)
    if (file.size > maxFileSizeBytes) {
      const maxMb = (maxFileSizeBytes / (1024 * 1024)).toFixed(0);
      return reject(new Error(`File size is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum allowed upload size is ${maxMb}MB.`));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        // Calculate canvas dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Fill white background for transparent PNGs if converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with 0.82 compression quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        resolve(compressedBase64);
      };

      img.onerror = () => reject(new Error('Failed to parse image data. The file may be corrupt.'));
    };

    reader.onerror = () => reject(new Error('Failed to read image file.'));
  });
};
