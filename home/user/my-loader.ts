/**
 * 🎨 Professional Image Loader for Static Export.
 * This function handles URL transformation for optimized assets.
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
  // If it's a Cloudinary demo or specific external asset
  if (src.startsWith('https://res.cloudinary.com')) {
    const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
    return `https://res.cloudinary.com/demo/image/upload/${params.join(',')}${src}`
  }

  // Fallback for Picsum or Unsplash used in the app templates
  if (src.includes('picsum.photos') || src.includes('images.unsplash.com')) {
    return `${src}${src.includes('?') ? '&' : '?'}w=${width}&q=${quality || 75}`
  }
  
  // For internal assets, return the path with basic params
  return `${src}?w=${width}&q=${quality || 75}`
}
