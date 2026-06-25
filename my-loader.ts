/**
 * 🎨 Professional Image Loader for Static Export.
 * Standardizes assets for Cloudinary and local placeholders.
 */
export default function myImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  // Handle Cloudinary demo as requested
  if (src.startsWith('https://res.cloudinary.com')) {
    const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
    return `https://res.cloudinary.com/demo/image/upload/${params.join(',')}${src}`
  }

  // Fallback for standard placeholders used in the app
  if (src.includes('picsum.photos') || src.includes('images.unsplash.com')) {
    return `${src}${src.includes('?') ? '&' : '?'}w=${width}&q=${quality || 75}`
  }
  
  // Return the path for local assets
  return `${src}?w=${width}&q=${quality || 75}`
}