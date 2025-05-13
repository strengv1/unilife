// components/EventSchema.tsx - Simplified version

import Script from 'next/script';
import React from 'react';

interface EventSchemaProps {
  // Basic details
  title: string;
  description: string;
  image: string;
  
  // Date and location (ISO format for dates when available)
  startDate?: string; // Can be ISO format "2025-09-14T12:00:00" or undefined for unknown
  endDate?: string;   // Optional end date/time
  location?: string;  // Location name
  timezone?: string   // Default to Finland summer time

  // Organization details
  organizers?: string | string[];
  performers?: string | string[];
  
  // Location details
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  streetAddress?: string;
  country?: string;
  
  // Ticket details
  price?: string;
  currency?: string;
  availability?: 'InStock' | 'SoldOut' | 'PreOrder' | 'LimitedAvailability';
  
  // Additional details
  eventCategory?: string;
  maxAttendees?: number;
  status?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled' | 'EventMovedOnline';
  url?: string;
}

export function EventSchema({
  title,
  description,
  image,
  startDate,
  endDate,
  location,
  timezone = "+03:00",
  organizers = ['UNI LIFE'],
  performers,
  addressLocality,
  addressRegion = 'Uusimaa',
  postalCode,
  streetAddress,
  country = 'Finland',
  price,
  currency = 'EUR',
  availability = 'LimitedAvailability',
  eventCategory = 'Event',
  maxAttendees,
  status = 'EventScheduled',
  url
}: EventSchemaProps) {
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
  
  // Create offers if price is specified
  let offerSchema;
  if (price) {
    offerSchema = {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": `https://schema.org/${availability}`,
      "url": url || (typeof window !== 'undefined' ? window.location.href : undefined),
      "validFrom": new Date().toISOString().split('T')[0]
    };
  }
  
  // Add timezone to dates if they don't already have one
  const formatDateWithTimezone = (dateString?: string) => {
    if (!dateString) return undefined;
    
    // If the date already includes timezone info (contains + or -), return as-is
    if (dateString.includes('+') || dateString.includes('-') && dateString.length > 10) {
      return dateString;
    }
    
    // Otherwise append the timezone
    return `${dateString}${timezone}`;
  };
  
  const formattedStartDate = formatDateWithTimezone(startDate);
  const formattedEndDate = formatDateWithTimezone(endDate);

  // Build the schema object
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": title,
    "description": description,
    "image": image.startsWith('http') ? image : `https://unilife.fi${image}`,
    ...(formattedStartDate && { "startDate": formattedStartDate }),
    ...(formattedEndDate && { "endDate": formattedEndDate }),
    "eventStatus": `https://schema.org/${status}`,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": location || "To be announced",
      "address": {
        "@type": "PostalAddress",
        ...(streetAddress && { "streetAddress": streetAddress }),
        ...(addressLocality && { "addressLocality": addressLocality }),
        ...(addressRegion && { "addressRegion": addressRegion }),
        ...(postalCode && { "postalCode": postalCode }),
        "addressCountry": country
      }
    },
    ...(performerSchema && { "performer": performerSchema }),
    ...(organizerSchema && { "organizer": organizerSchema }),
    ...(offerSchema && { "offers": offerSchema }),
    ...(maxAttendees && { "maximumAttendeeCapacity": maxAttendees }),
    ...(eventCategory && { "eventCategory": eventCategory }),
    "url": url || (typeof window !== 'undefined' ? window.location.href : undefined)
  };

  // Clean up the schema by removing undefined properties
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}