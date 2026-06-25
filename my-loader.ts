/**
 * 🎨 Professional Image Loader for Static Export.
 * Standardizes assets for Cloudinary, Picsum, and Unsplash.
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
  // Handle res.cloudinary.com assets
  if (src.startsWith('https://res.cloudinary.com')) {
    const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
    return `https://res.cloudinary.com/demo/image/upload/${params.join(',')}${src}`
  }

  // Handle Picsum and Unsplash placeholders
  if (src.includes('picsum.photos') || src.includes('images.unsplash.com')) {
    return `${src}${src.includes('?') ? '&' : '?'}w=${width}&q=${quality || 75}`
  }
  
  // Return path for local or unhandled assets
  return `${src}?w=${width}&q=${quality || 75}`
}
