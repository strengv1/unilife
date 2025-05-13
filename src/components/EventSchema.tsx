// components/EventSchema.tsx

import React from 'react';

interface EventSchemaProps {
  // Basic event details
  title: string;
  description: string;
  image: string;
  
  // Optional date and location details (can be unknown)
  date?: string;
  time?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  
  // Organization details
  organizers?: string | string[];
  performers?: string | string[];
  
  // Ticket/registration details
  price?: string;
  currency?: string;
  availability?: 'InStock' | 'SoldOut' | 'PreOrder' | 'LimitedAvailability';
  
  // Location details
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  streetAddress?: string;
  country?: string;
  
  // Additional properties
  url?: string;
  status?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled' | 'EventMovedOnline';
  maxAttendees?: number;
  eventCategory?: string;
}

export function EventSchema({
  // Basic event details with defaults
  title,
  description,
  image,
  date,
  time,
  location,
  startTime,
  endTime,
  organizers = ['UNI LIFE'],
  performers,
  price,
  currency = 'EUR',
  availability = 'LimitedAvailability',
  addressLocality,
  addressRegion = 'Uusimaa',
  postalCode,
  streetAddress,
  country = 'Finland',
  url,
  status = 'EventScheduled',
  maxAttendees,
  eventCategory = 'Event'
}: EventSchemaProps) {
  // Check if important details are unknown (represented by "???")
  const isDateUnknown = !date || date === '???';
  const isLocationUnknown = !location || location === '???';
  
  // Parse date and time if available
  let isoStartDate = '';
  let isoEndDate = '';

  if (!isDateUnknown) {
    try {
      // Handle different date formats by extracting components
      const dateStr = date.replace(/\b(\d)(st|nd|rd|th)\b/g, '$1'); // Remove ordinals
      
      // Get time components if available
      let startHour = 0;
      let startMinute = 0;
      let endHour = 23;
      let endMinute = 59;
      
      if (time) {
        const timeMatch = time.match(/(\d+):(\d+)\s*-\s*(\d+):(\d+)/);
        if (timeMatch) {
          startHour = parseInt(timeMatch[1], 10);
          startMinute = parseInt(timeMatch[2], 10);
          endHour = parseInt(timeMatch[3], 10);
          endMinute = parseInt(timeMatch[4], 10);
        }
      }
      
      if (startTime) {
        const startTimeParts = startTime.split(':');
        startHour = parseInt(startTimeParts[0], 10);
        startMinute = parseInt(startTimeParts[1], 10) || 0;
      }
      
      if (endTime) {
        const endTimeParts = endTime.split(':');
        endHour = parseInt(endTimeParts[0], 10);
        endMinute = parseInt(endTimeParts[1], 10) || 0;
      }
      
      // For known format like "September 14th, 2025"
      const dateMatch = dateStr.match(/(\w+)\s+(\d+),\s+(\d+)/);
      if (dateMatch) {
        const month = dateMatch[1];
        const day = parseInt(dateMatch[2], 10);
        const year = parseInt(dateMatch[3], 10);
        
        // Convert month name to month number
        const monthMap: Record<string, number> = {
          'January': 0, 'February': 1, 'March': 2, 'April': 3,
          'May': 4, 'June': 5, 'July': 6, 'August': 7,
          'September': 8, 'October': 9, 'November': 10, 'December': 11
        };
        
        const monthNum = monthMap[month];
        if (monthNum !== undefined) {
          const eventDate = new Date(year, monthNum, day);
          
          // Create start date with time
          const startDate = new Date(eventDate);
          startDate.setHours(startHour, startMinute, 0);
          isoStartDate = startDate.toISOString();
          
          // Create end date with time
          const endDate = new Date(eventDate);
          endDate.setHours(endHour, endMinute, 0);
          isoEndDate = endDate.toISOString();
        }
      }
    } catch (error) {
      console.error("Error parsing date:", error);
      isoStartDate = '';
      isoEndDate = '';
    }
  }
  
  // Format performers
  let performerSchema;
  if (performers) {
    if (Array.isArray(performers)) {
      performerSchema = performers.map(performer => ({
        "@type": "PerformingGroup",
        "name": performer
      }));
    } else {
      performerSchema = {
        "@type": "PerformingGroup",
        "name": performers
      };
    }
  }
  
  // Format organizers
  let organizerSchema;
  if (organizers) {
    if (Array.isArray(organizers)) {
      organizerSchema = organizers.map(organizer => ({
        "@type": "Organization",
        "name": organizer,
        "url": organizer === "UNI LIFE" ? "https://unilife.fi" : undefined
      }));
    } else {
      organizerSchema = {
        "@type": "Organization",
        "name": organizers,
        "url": organizers === "UNI LIFE" ? "https://unilife.fi" : undefined
      };
    }
  }
  
  // Create offers if price is specified
  let offerSchema;
  if (price) {
    offerSchema = {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": `https://schema.org/${availability}`,
      "url": url || (typeof window !== 'undefined' ? window.location.href : undefined),
      "validFrom": new Date().toISOString().split('T')[0] // Valid from today
    };
  }

  // Determine location name for schema
  let locationName = location;
  if (isLocationUnknown) {
    locationName = addressLocality ? `To be announced in ${addressLocality}, ${country}` : `To be announced in ${country}`;
  }
  
  // Build address object based on available information
  const addressObject = {
    "@type": "PostalAddress",
    ...(streetAddress && { "streetAddress": streetAddress }),
    ...(addressLocality && { "addressLocality": addressLocality }),
    ...(addressRegion && { "addressRegion": addressRegion }),
    ...(postalCode && { "postalCode": postalCode }),
    "addressCountry": country
  };
  
  // Build the schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": title,
    "description": description,
    "image": image.startsWith('http') ? image : `https://unilife.fi${image}`,
    ...(isoStartDate && { "startDate": isoStartDate }),
    ...(isoEndDate && { "endDate": isoEndDate }),
    "eventStatus": `https://schema.org/${status}`,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": locationName,
      "address": addressObject
    },
    ...(performerSchema && { "performer": performerSchema }),
    ...(organizerSchema && { "organizer": organizerSchema }),
    ...(offerSchema && { "offers": offerSchema }),
    ...(maxAttendees && { "maximumAttendeeCapacity": maxAttendees }),
    ...(eventCategory && { "eventCategory": eventCategory }),
    "url": url || (typeof window !== 'undefined' ? window.location.href : undefined)
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}