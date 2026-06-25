import { MetadataRoute } from 'next'

export const dynamic = 'force-static'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/editor', '/profile', '/admin', '/test-connection'],
      },
    ],
    sitemap: 'https://videomaster-ai.tech/sitemap.xml',
  }
}