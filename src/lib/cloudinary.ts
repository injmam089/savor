/**
 * Cloudinary Integration Layer
 * 
 * This module provides image upload functionality.
 * In development mode (without real API keys), it uses placeholder images.
 * 
 * To enable real uploads:
 * 1. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env
 * 2. Set CLOUDINARY_API_KEY in .env
 * 3. Set CLOUDINARY_API_SECRET in .env
 * 4. Create an unsigned upload preset in your Cloudinary dashboard
 */

const IS_MOCK_MODE = !process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET === 'your-api-secret';

/**
 * Get a placeholder food image URL for development
 */
export function getPlaceholderImage(name: string): string {
  // Generate a consistent placeholder based on the food name
  const encoded = encodeURIComponent(name);
  return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80`;
}

/**
 * Get the Cloudinary image URL from a public ID
 */
export function getCloudinaryUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
}): string {
  if (IS_MOCK_MODE || !publicId) {
    return getPlaceholderImage('food');
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const { width = 600, height = 400, crop = 'fill', quality = 'auto' } = options || {};

  return `https://res.cloudinary.com/${cloudName}/image/upload/c_${crop},w_${width},h_${height},q_${quality}/${publicId}`;
}

/**
 * Check if Cloudinary is in mock mode
 */
export function isCloudinaryMockMode(): boolean {
  return IS_MOCK_MODE;
}
