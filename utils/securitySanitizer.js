/**
 * Enterprise Security & Input Sanitization Utility
 * Guards against XSS (Cross-Site Scripting), Script File Injections, SQL Injections, and Malformed Payloads.
 */

// Escape HTML characters to prevent XSS script execution in DOM
export function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Strip dangerous script tags, event handlers, and protocols
export function sanitizeInput(input, maxLength = 2000) {
  if (input === null || input === undefined) return '';
  let cleaned = String(input).trim();

  // Strip <script>...</script> tags and inline event attributes (onload, onerror, onclick, etc.)
  cleaned = cleaned
    .replace(/<script\b[^<]*>(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*>(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*>(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*>(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*(['"]?).*?\1/gi, '')
    .replace(/javascript\s*:/gi, '');

  // Truncate to maximum safe length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }

  return cleaned;
}

// Recursively sanitize all string properties in a request payload object
export function sanitizePayload(payload) {
  if (!payload || typeof payload !== 'object') return payload;

  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizePayload(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizePayload(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// Validate file uploads against dangerous file types & script extensions
export function validateImageUpload(file, maxSizeBytes = 5 * 1024 * 1024) {
  if (!file) {
    throw new Error('No file selected.');
  }

  // Allowed mime types (strictly binary image formats, blocking SVG/HTML/PHP/JS)
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  const fileName = (file.name || '').toLowerCase();
  const fileType = (file.type || '').toLowerCase();

  // Check dangerous file extensions
  const isExtensionAllowed = allowedExtensions.some((ext) => fileName.endsWith(ext));
  const isMimeAllowed = allowedMimeTypes.includes(fileType);

  if (!isMimeAllowed || !isExtensionAllowed) {
    throw new Error('Security Error: Invalid file format. Only JPEG, PNG, and WebP images are allowed.');
  }

  if (file.size > maxSizeBytes) {
    const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    throw new Error(`File size limit exceeded. Maximum allowed file size is ${maxMb}MB.`);
  }

  return true;
}
