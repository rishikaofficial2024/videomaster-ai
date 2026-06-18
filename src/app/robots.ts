import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/editor/', '/profile/'],
    },
    sitemap: 'https://videomaster-ai.in/sitemap.xml',
  }
}
