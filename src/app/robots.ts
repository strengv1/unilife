import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/contact', '/events', '/events/battleroyale','/events/magicisland'],
      disallow: ['/private/','/cdn-cgi/'],
    },
    sitemap: 'https://www.unilife.fi/sitemap.xml',
  }
}