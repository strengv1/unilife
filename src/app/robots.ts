import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/contact', '/events', '/events/battleroyale','/events/magicisland'],
      disallow: '/private/',
    },
    sitemap: 'https://unilife.fi/sitemap.xml',
  }
}