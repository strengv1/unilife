import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://unilife.fi',
      lastModified: new Date(),
    },
    {
      url: 'https://unilife.fi/about',
      lastModified: new Date(),
    },
    {
      url: 'https://unilife.fi/contact',
      lastModified: new Date(),
    },
    {
      url: 'https://unilife.fi/events',
      lastModified: new Date(),
    },
    {
      url: 'https://unilife.fi/events/battleroyale',
      lastModified: new Date(),
    },
    {
      url: 'https://unilife.fi/events/magicisland',
      lastModified: new Date(),
    },
    {
      url: 'https://unilife.fi/privacy',
      lastModified: new Date(),
    }
  ]
}