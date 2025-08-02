import React from 'react';
import JsonLd from './JsonLd';

interface StructuredDataProps {
  type: 'website' | 'course' | 'organization' | 'local-business' | 'article';
  data?: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data = {} }) => {
  const generateWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AVS Institut",
    "alternateName": "AVS Innovation Institute",
    "url": "https://avs.ma",
    "description": "Institut de formation spécialisé en Intelligence Artificielle, Programmation et Cybersécurité",
    "inLanguage": "fr",
    "isAccessibleForFree": false,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://avs.ma/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "AVS Institut",
      "url": "https://avs.ma",
      "logo": "https://avs.ma/favicon.png"
    }
  });

  const generateLocalBusinessSchema = () => ({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "AVS Institut",
    "image": "https://avs.ma/favicon.png",
    "description": "Institut de formation en Intelligence Artificielle et technologies avancées au Maroc",
    "url": "https://avs.ma",
    "telephone": "+212-XXXX-XXXXX",
    "email": "contact@avs.ma",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Votre adresse",
      "addressLocality": "Casablanca",
      "addressRegion": "Casablanca-Settat",
      "postalCode": "20000",
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "33.5731",
      "longitude": "-7.5898"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Morocco"
    },
    "serviceType": "Formation professionnelle",
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    }
  });

  const generateCourseSchema = (courseData: any) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseData.name || "Formation Intelligence Artificielle",
    "description": courseData.description || "Formation complète en Intelligence Artificielle et Machine Learning",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "AVS Institut",
      "url": "https://avs.ma"
    },
    "courseCode": courseData.code || "AVS-IA-001",
    "educationalLevel": "Professional",
    "teaches": courseData.skills || ["Intelligence Artificielle", "Machine Learning", "Deep Learning"],
    "timeRequired": courseData.duration || "P18M",
    "courseMode": ["online", "onsite", "blended"],
    "availableLanguage": "fr",
    "instructor": {
      "@type": "Person",
      "name": courseData.instructor || "Équipe pédagogique AVS",
      "jobTitle": "Expert en Intelligence Artificielle"
    },
    "offers": {
      "@type": "Offer",
      "category": "Formation professionnelle",
      "price": courseData.price || "Sur demande",
      "priceCurrency": "MAD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString().split('T')[0],
      "url": "https://avs.ma/register"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "89",
      "bestRating": "5",
      "worstRating": "1"
    }
  });

  const generateArticleSchema = (articleData: any) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.title,
    "description": articleData.description,
    "image": articleData.image || "https://avs.ma/favicon.png",
    "author": {
      "@type": "Organization",
      "name": "AVS Institut"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AVS Institut",
      "logo": {
        "@type": "ImageObject",
        "url": "https://avs.ma/favicon.png"
      }
    },
    "datePublished": articleData.datePublished || new Date().toISOString(),
    "dateModified": articleData.dateModified || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleData.url || window.location.href
    },
    "articleSection": "Technology",
    "keywords": articleData.keywords || ["Intelligence Artificielle", "Formation", "Technologie"]
  });

  const getSchema = () => {
    switch (type) {
      case 'website':
        return generateWebsiteSchema();
      case 'course':
        return generateCourseSchema(data);
      case 'local-business':
        return generateLocalBusinessSchema();
      case 'article':
        return generateArticleSchema(data);
      case 'organization':
        return data;
      default:
        return generateWebsiteSchema();
    }
  };

  return <JsonLd data={getSchema()} />;
};

export default StructuredData;