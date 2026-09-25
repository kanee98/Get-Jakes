/**
 * Utility for validating and compressing user/admin uploaded images using HTML5 Canvas.
 * Prevents server flooding and keeps stored image sizes minimal (<100KB-200KB WebP/JPEG).
 * Enforces strict security validation against malicious script injection files.
 */

import { validateImageUpload } from './securitySanitizer';

export const processUploadedImage = (file, maxWidth = 800, maxFileSizeBytes = 5 * 1024 * 1024) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve(null);
    }

    // 1. Strict Security & File Type Validation
    try {
      validateImageUpload(file, maxFileSizeBytes);
    } catch (validationError) {
      return reject(validationError);
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
        // Fill white background for transparent PNGs when converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Export as clean JPEG with 0.82 compression quality (strips embedded scripts/EXIF)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        resolve(compressedBase64);
      };

      img.onerror = () => reject(new Error('Security/Parse Error: Failed to parse image data. The file may be invalid or corrupt.'));
    };

    reader.onerror = () => reject(new Error('Failed to read image file.'));
  });
};
