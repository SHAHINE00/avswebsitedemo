import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  ogType?: string;
  ogSiteName?: string;
  ogUrl?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "AVS - Institut de l'Innovation et de l'Intelligence Artificielle",
  description = "Rejoignez notre programme complet AVS IA Course et maîtrisez les technologies d'intelligence artificielle de pointe avec des instructeurs experts.",
  keywords = "formation ia, intelligence artificielle, machine learning, programmation, cybersécurité, formation en ligne",
  ogImage = "https://lovable.dev/opengraph-image-p98pqg.png",
  canonicalUrl,
  noIndex = false,
  ogType = "website",
  ogSiteName = "AVS - Institut de l'Innovation et de l'Intelligence Artificielle",
  ogUrl
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to convert relative URLs to absolute URLs
    const getAbsoluteUrl = (url: string): string => {
      if (!url) return ogImage; // Fallback to default image
      
      // If already absolute URL, return as is
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      
      // If relative URL starting with /src/assets, convert to absolute
      if (url.startsWith('/src/assets/')) {
        const baseUrl = window.location.origin;
        return `${baseUrl}${url.replace('/src/assets/', '/src/assets/')}`;
      }
      
      // If relative URL, make it absolute
      if (url.startsWith('/')) {
        return `${window.location.origin}${url}`;
      }
      
      // Return the fallback image for any other case
      return ogImage;
    };

    // Get current page URL if not provided
    const currentUrl = ogUrl || window.location.href;
    const absoluteImageUrl = getAbsoluteUrl(ogImage);

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', absoluteImageUrl, 'property');
    updateMetaTag('og:type', ogType, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:site_name', ogSiteName, 'property');
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', absoluteImageUrl);
    updateMetaTag('twitter:site', '@AVSInstitut');

    // Canonical URL
    if (canonicalUrl) {
      let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalElement) {
        canonicalElement = document.createElement('link');
        canonicalElement.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalElement);
      }
      canonicalElement.setAttribute('href', canonicalUrl);
    }

    // Robots meta tag
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

  }, [title, description, keywords, ogImage, canonicalUrl, noIndex, ogType, ogSiteName, ogUrl]);

  return null; // This component doesn't render anything
};

export default SEOHead;