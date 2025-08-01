#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import the sitemap utility (we'll use a simple approach since it's TypeScript)
const { generateSitemap, staticRoutes } = (() => {
  // Define the routes directly in this script to avoid TypeScript compilation issues
  const staticRoutes = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/curriculum', changefreq: 'weekly', priority: 0.9 },
    { url: '/features', changefreq: 'monthly', priority: 0.8 },
    { url: '/instructors', changefreq: 'monthly', priority: 0.7 },
    { url: '/testimonials', changefreq: 'monthly', priority: 0.7 },
    { url: '/careers', changefreq: 'weekly', priority: 0.8 },
    { url: '/contact', changefreq: 'monthly', priority: 0.6 },
    { url: '/blog', changefreq: 'daily', priority: 0.8 },
    { url: '/auth', changefreq: 'yearly', priority: 0.3 },
    { url: '/register', changefreq: 'yearly', priority: 0.3 },
    { url: '/programming-course', changefreq: 'monthly', priority: 0.9 },
    { url: '/ai-course', changefreq: 'monthly', priority: 0.9 },
    { url: '/cybersecurity-course', changefreq: 'monthly', priority: 0.9 },
    { url: '/appointment', changefreq: 'yearly', priority: 0.5 },
    { url: '/privacy-policy', changefreq: 'yearly', priority: 0.2 },
    { url: '/terms-of-use', changefreq: 'yearly', priority: 0.2 },
    { url: '/cookies-policy', changefreq: 'yearly', priority: 0.2 },
    { url: '/about', changefreq: 'monthly', priority: 0.7 }
  ];

  const generateSitemap = (baseUrl, additionalUrls = []) => {
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

  return { generateSitemap, staticRoutes };
})();

// Configuration
const SITE_URL = 'https://avs.ma';
const OUTPUT_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'sitemap.xml');

// Generate sitemap
console.log('🗺️  Generating sitemap.xml...');

try {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate sitemap content
  const sitemapContent = generateSitemap(SITE_URL);

  // Write sitemap to file
  fs.writeFileSync(OUTPUT_FILE, sitemapContent, 'utf8');

  console.log('✅ Sitemap.xml generated successfully!');
  console.log(`📍 Location: ${OUTPUT_FILE}`);
  console.log(`🌐 URL: ${SITE_URL}/sitemap.xml`);
  console.log(`📊 Routes included: ${staticRoutes.length}`);

} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}