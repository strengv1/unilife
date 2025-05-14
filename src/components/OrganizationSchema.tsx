import Script from "next/script";

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'UNI LIFE',
    url: 'https://unilife.fi',
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
    description: 'Creating large-scale and high-value student events across Finland.',
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}