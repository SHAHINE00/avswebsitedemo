-- Update the featured image URL for the cybersecurity blog post to use the correct public path
UPDATE blog_posts 
SET featured_image_url = '/images/cybersecurity-guide-hero.jpg'
WHERE slug = 'cybersecurite-protegez-donnees';