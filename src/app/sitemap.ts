import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.unilife.fi',
      lastModified: new Date(),
    },
    {
      url: 'https://www.unilife.fi/about',
      lastModified: new Date(),
    },
    {
      url: 'https://www.unilife.fi/contact',
      lastModified: new Date(),
    },
    {
      url: 'https://www.unilife.fi/events',
      lastModified: new Date(),
    },
    {
      url: 'https://www.unilife.fi/events/battleroyale',
      lastModified: new Date(),
    },
    {
      url: 'https://www.unilife.fi/events/magicisland',
      lastModified: new Date(),
    },
    {
      url: 'https://www.unilife.fi/privacy',
      lastModified: new Date(),
    }
  ]
}