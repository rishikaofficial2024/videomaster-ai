import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/editor/', '/profile/', '/admin/'],
    },
    sitemap: 'https://videomaster-ai.tech/sitemap.xml',
  }
}
