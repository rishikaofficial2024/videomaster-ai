import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/editor/', '/profile/'],
    },
    sitemap: 'https://studio-9489287013-59986.web.app/sitemap.xml',
  }
}
