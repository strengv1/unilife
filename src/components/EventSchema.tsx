// app/components/EventSchema.tsx
export function EventSchema({ 
  title, 
  description, 
  date, 
  location, 
  image,
  startTime,
  endTime
}: {
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  startTime?: string;
  endTime?: string;
}) {
  // Format date strings for schema
  const formattedDate = date !== "???" ? date : null;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: title,
    description: description,
    image: `https://unilife.fi${image}`,
    location: {
      '@type': 'Place',
      name: location !== "???" ? location : "To be announced",
      address: {
        '@type': 'PostalAddress',
        addressLocality: location !== "???" ? location : "Finland",
        addressCountry: 'Finland'
      }
    },
    organizer: {
      '@type': 'Organization',
      name: 'UNI LIFE',
      url: 'https://unilife.fi'
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(formattedDate && {
      startDate: formattedDate,
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}