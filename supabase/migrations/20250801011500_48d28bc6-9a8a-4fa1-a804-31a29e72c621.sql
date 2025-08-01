-- Update the cybersecurity blog post to link the generated hero image
UPDATE blog_posts 
SET featured_image_url = '/src/assets/cybersecurity-guide-hero.jpg'
WHERE slug = 'cybersecurite-protegez-donnees';