import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VideoMaster AI - Developed by Rinku Ganjawala',
    short_name: 'VideoMaster',
    description: 'Professional AI Video Production Hub. Developed by Rinku Ganjawala.',
    start_url: '/',
    display: 'standalone',
    background_color: '#05070a',
    theme_color: '#D4AF37',
    icons: [
      {
        src: 'https://picsum.photos/seed/videomaster-icon/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/videomaster-icon-large/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
