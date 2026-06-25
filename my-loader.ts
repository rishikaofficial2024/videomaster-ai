/**
 * 🎨 Professional Image Loader for Static Export.
 * This function handles URL transformation for optimized assets.
 */
export default function myImageLoader({ src, width, quality }: { src: string, width: number, quality?: number }) {
  // If the image is external (Unsplash/Picsum), we append sizing parameters
  if (src.includes('images.unsplash.com') || src.includes('picsum.photos')) {
    return `${src}${src.includes('?') ? '&' : '?'}w=${width}&q=${quality || 75}`;
  }
  
  // For internal assets, we return the path directly or point to a custom CDN
  return `${src}?w=${width}&q=${quality || 75}`;
}
