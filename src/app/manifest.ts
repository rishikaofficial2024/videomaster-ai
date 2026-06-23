
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VideoMaster AI: Professional Studio',
    short_name: 'VideoMaster AI',
    description: 'Elite AI Video Creation & Viral Script Engineering Hub',
    start_url: '/',
    display: 'standalone',
    background_color: '#05070a',
    theme_color: '#3b82f6',
    icons: [
      {
        src: 'https://picsum.photos/seed/videomaster-icon-192/192/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: 'https://picsum.photos/seed/videomaster-icon-512/512/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
    ],
  }
}
