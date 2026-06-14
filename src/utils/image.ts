/**
 * Optimizes Unsplash image URLs by setting width, quality, and compression parameters.
 * If the URL is invalid or is a base64 data string, it returns the original URL.
 */
export const optimizeImageUrl = (url: string, targetWidth: number = 500, quality: number = 60): string => {
  if (!url) return '';
  if (url.startsWith('data:')) return url; // Base64 data URI

  if (url.includes('unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', targetWidth.toString());
      urlObj.searchParams.set('q', quality.toString());
      urlObj.searchParams.set('auto', 'format,compress');
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }
  return url;
};
