import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VideoMaster AI',
    short_name: 'VideoMaster',
    description: 'The Professional AI Video Studio & Script Writer (.tech)',
    start_url: '/',
    display: 'standalone',
    background_color: '#05070a',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
