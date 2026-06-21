import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/editor/', '/profile/', '/admin/', '/test-connection/'],
    },
    sitemap: 'https://videomaster-ai.tech/sitemap.xml',
    host: 'https://videomaster-ai.tech'
  }
}
