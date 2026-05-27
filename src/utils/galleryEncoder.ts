// Utility to encode/decode gallery images into URL-safe strings
// Images are compressed and stored as base64 data URLs in the URL hash

// Compress an image file to a smaller JPEG data URL
export function compressImage(
file: File,
maxSize: number = 600,
quality: number = 0.6)
: Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Scale down if larger than maxSize
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round(height * maxSize / width);
            width = maxSize;
          } else {
            width = Math.round(width * maxSize / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Encode an array of image data URLs into a URL-safe hash string
export function encodeGalleryData(imageUrls: string[]): string {
  try {
    const json = JSON.stringify(imageUrls);
    // Use TextEncoder for proper UTF-8 handling, then btoa
    const bytes = new TextEncoder().encode(json);
    // Convert to binary string for btoa
    let binary = '';
    bytes.forEach((b) => binary += String.fromCharCode(b));
    const encoded = btoa(binary);
    // Make URL-safe
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (err) {
    console.error('Failed to encode gallery data', err);
    return '';
  }
}

// Decode a URL hash string back into an array of image data URLs
export function decodeGalleryData(hash: string): string[] {
  try {
    if (!hash) return [];
    // Restore base64 characters
    let encoded = hash.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding
    while (encoded.length % 4) encoded += '=';
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const urls = JSON.parse(json);
    if (Array.isArray(urls) && urls.every((u) => typeof u === 'string')) {
      return urls;
    }
    return [];
  } catch (err) {
    console.error('Failed to decode gallery data', err);
    return [];
  }
}