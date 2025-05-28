import Script from "next/script";

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'UNI LIFE',
    url: 'https://www.unilife.fi',
    logo: 'https://unilife.fi/unilife_logo.png',
    sameAs: [
      'https://www.instagram.com/unilife.fi',
      // Add other social profiles
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Helsinki',
      addressRegion: 'Uusimaa',
      addressCountry: 'Finland',
    },
    description: 'No more boring parties. Time to make the most out of uni.',
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}