// Sitemap generation utility for SEO

export interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Static routes configuration
export const staticRoutes: SitemapUrl[] = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    url: '/curriculum',
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    url: '/features',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    url: '/instructors',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: '/testimonials',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: '/careers',
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    url: '/blog',
    changefreq: 'daily',
    priority: 0.8
  },
  {
    url: '/auth',
    changefreq: 'yearly',
    priority: 0.3
  },
  {
    url: '/register',
    changefreq: 'yearly',
    priority: 0.3
  },
  {
    url: '/programming-course',
    changefreq: 'monthly',
    priority: 0.9
  },
  {
    url: '/ai-course',
    changefreq: 'monthly',
    priority: 0.9
  },
  {
    url: '/cybersecurity-course',
    changefreq: 'monthly',
    priority: 0.9
  },
  {
    url: '/appointment',
    changefreq: 'yearly',
    priority: 0.5
  },
  {
    url: '/privacy-policy',
    changefreq: 'yearly',
    priority: 0.2
  },
  {
    url: '/terms-of-use',
    changefreq: 'yearly',
    priority: 0.2
  },
  {
    url: '/cookies-policy',
    changefreq: 'yearly',
    priority: 0.2
  }
];

// Generate sitemap XML
export const generateSitemap = (baseUrl: string, additionalUrls: SitemapUrl[] = []): string => {
  const allUrls = [...staticRoutes, ...additionalUrls];
  const currentDate = new Date().toISOString().split('T')[0];

  const urlElements = allUrls.map(route => {
    const lastmod = route.lastmod || currentDate;
    const changefreq = route.changefreq || 'monthly';
    const priority = route.priority || 0.5;

    return `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
};

// Generate robots.txt content
export const generateRobotsTxt = (baseUrl: string): string => {
  return `User-agent: *
Allow: /

# Disallow admin areas
Disallow: /admin*
Disallow: /dashboard*

# Disallow auth pages
Disallow: /auth
Disallow: /register

# Allow important pages
Allow: /
Allow: /curriculum
Allow: /features
Allow: /instructors
Allow: /testimonials
Allow: /careers
Allow: /contact
Allow: /blog
Allow: /programming-course
Allow: /ai-course
Allow: /cybersecurity-course

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1
`;
};

// JSON-LD structured data generator
export const generateJsonLd = (type: 'Organization' | 'EducationalOrganization' | 'Course', data: any) => {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type
  };

  switch (type) {
    case 'Organization':
    case 'EducationalOrganization':
      return {
        ...baseStructure,
        name: 'AVS Institut',
        description: 'Institut de l\'Innovation et de l\'Intelligence Artificielle',
        url: 'https://avs.ma',
        logo: 'https://avs.ma/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+212-6-62-63-29-53',
          contactType: 'customer service',
          email: 'info@avs.ma'
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Avenue Allal El Fassi – Alpha 2000',
          addressLocality: 'Marrakech',
          addressCountry: 'MA'
        },
        sameAs: [
          'https://www.facebook.com/profile.php?id=61578157912314',
          'https://www.linkedin.com/company/avs-innovation-institute',
          'https://www.instagram.com/avs.innovation.institute/',
          'https://twitter.com/avsinstitut'
        ],
        ...data
      };

    case 'Course':
      return {
        ...baseStructure,
        name: data.name,
        description: data.description,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'AVS Institut'
        },
        educationalLevel: 'Professional',
        courseMode: 'Online',
        ...data
      };

    default:
      return baseStructure;
  }
};