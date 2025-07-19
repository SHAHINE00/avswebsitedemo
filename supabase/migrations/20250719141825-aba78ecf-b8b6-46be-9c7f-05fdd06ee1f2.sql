
-- Add certification provider fields to courses table
ALTER TABLE courses 
ADD COLUMN certification_provider_name TEXT,
ADD COLUMN certification_provider_logo TEXT,
ADD COLUMN certification_recognition TEXT;

-- Update existing courses with certification provider information
UPDATE courses SET 
  certification_provider_name = 'MIT Professional Education',
  certification_provider_logo = '/lovable-uploads/mit-logo.png',
  certification_recognition = 'Accredited by MIT Professional Education'
WHERE title = 'AI & Machine Learning Engineering';

UPDATE courses SET 
  certification_provider_name = 'Google Cloud',
  certification_provider_logo = '/lovable-uploads/google-cloud-logo.png',
  certification_recognition = 'Google Cloud Certified'
WHERE title = 'Business Intelligence';

UPDATE courses SET 
  certification_provider_name = 'Stanford Online',
  certification_provider_logo = '/lovable-uploads/stanford-logo.png',
  certification_recognition = 'Stanford University Certificate'
WHERE title = 'AI for Business';

UPDATE courses SET 
  certification_provider_name = 'IBM SkillsBuild',
  certification_provider_logo = '/lovable-uploads/ibm-logo.png',
  certification_recognition = 'IBM Professional Certificate'
WHERE title = 'AI for Decision Making';

UPDATE courses SET 
  certification_provider_name = 'OpenCV Foundation',
  certification_provider_logo = '/lovable-uploads/opencv-logo.png',
  certification_recognition = 'OpenCV Certified Developer'
WHERE title = 'Computer Vision with OpenCV';

UPDATE courses SET 
  certification_provider_name = 'IEEE Standards',
  certification_provider_logo = '/lovable-uploads/ieee-logo.png',
  certification_recognition = 'IEEE Ethics in AI Certification'
WHERE title = 'Ethical AI & Governance';

UPDATE courses SET 
  certification_provider_name = 'Python Software Foundation',
  certification_provider_logo = '/lovable-uploads/python-logo.png',
  certification_recognition = 'Python Institute Certified'
WHERE title = 'Python for AI & Programming';

UPDATE courses SET 
  certification_provider_name = 'Harvard Extension',
  certification_provider_logo = '/lovable-uploads/harvard-logo.png',
  certification_recognition = 'Harvard Professional Certificate'
WHERE title = 'Data Science for Business';

UPDATE courses SET 
  certification_provider_name = 'Scikit-learn Consortium',
  certification_provider_logo = '/lovable-uploads/scikit-learn-logo.png',
  certification_recognition = 'Scikit-learn Expert Certificate'
WHERE title = 'Data Science with Scikit-learn';

UPDATE courses SET 
  certification_provider_name = 'Industry AI Alliance',
  certification_provider_logo = '/lovable-uploads/ai-alliance-logo.png',
  certification_recognition = 'Industry AI Professional Certificate'
WHERE title = 'AI Applications in Industries';

UPDATE courses SET 
  certification_provider_name = 'Microsoft Learn',
  certification_provider_logo = '/lovable-uploads/microsoft-logo.png',
  certification_recognition = 'Microsoft Excel Expert Certificate'
WHERE title = 'Data Analysis with Microsoft Excel';

UPDATE courses SET 
  certification_provider_name = 'CFA Institute',
  certification_provider_logo = '/lovable-uploads/cfa-logo.png',
  certification_recognition = 'CFA Institute Certificate in Financial Analysis'
WHERE title = 'Financial Data Analysis';

UPDATE courses SET 
  certification_provider_name = 'Google Analytics',
  certification_provider_logo = '/lovable-uploads/google-analytics-logo.png',
  certification_recognition = 'Google Analytics Certified'
WHERE title = 'Google Data Studio Analytics';

UPDATE courses SET 
  certification_provider_name = 'Oracle University',
  certification_provider_logo = '/lovable-uploads/oracle-logo.png',
  certification_recognition = 'Oracle Database Administrator Certified'
WHERE title = 'Database Design & Management';

UPDATE courses SET 
  certification_provider_name = 'Python Software Foundation',
  certification_provider_logo = '/lovable-uploads/python-logo.png',
  certification_recognition = 'Advanced Python Developer Certificate'
WHERE title = 'Advanced Python Programming';

UPDATE courses SET 
  certification_provider_name = 'W3C Web Standards',
  certification_provider_logo = '/lovable-uploads/w3c-logo.png',
  certification_recognition = 'W3C Web Developer Certificate'
WHERE title = 'Web Development (HTML, CSS, JS)';

UPDATE courses SET 
  certification_provider_name = 'Google Developers',
  certification_provider_logo = '/lovable-uploads/google-developers-logo.png',
  certification_recognition = 'Google Mobile Developer Certificate'
WHERE title = 'Mobile App Development';

UPDATE courses SET 
  certification_provider_name = 'AWS Training',
  certification_provider_logo = '/lovable-uploads/aws-logo.png',
  certification_recognition = 'AWS Certified Solutions Architect'
WHERE title = 'Cloud Computing (AWS, Azure)';

UPDATE courses SET 
  certification_provider_name = 'IoT Foundation',
  certification_provider_logo = '/lovable-uploads/iot-foundation-logo.png',
  certification_recognition = 'IoT Professional Certificate'
WHERE title = 'Internet of Things (IoT)';

UPDATE courses SET 
  certification_provider_name = 'Blockchain Council',
  certification_provider_logo = '/lovable-uploads/blockchain-council-logo.png',
  certification_recognition = 'Certified Blockchain Developer'
WHERE title = 'Blockchain & Cryptocurrency';

UPDATE courses SET 
  certification_provider_name = 'Facebook Blueprint',
  certification_provider_logo = '/lovable-uploads/facebook-logo.png',
  certification_recognition = 'Meta Marketing Professional Certificate'
WHERE title = 'AI-Powered Digital Marketing';

UPDATE courses SET 
  certification_provider_name = 'Shopify Academy',
  certification_provider_logo = '/lovable-uploads/shopify-logo.png',
  certification_recognition = 'Shopify E-commerce Expert Certificate'
WHERE title = 'E-commerce Marketing';

UPDATE courses SET 
  certification_provider_name = 'Adobe Certified',
  certification_provider_logo = '/lovable-uploads/adobe-logo.png',
  certification_recognition = 'Adobe Video Production Professional'
WHERE title = 'Video Production & AI Editing';

UPDATE courses SET 
  certification_provider_name = 'Social Media Institute',
  certification_provider_logo = '/lovable-uploads/social-media-institute-logo.png',
  certification_recognition = 'Certified Social Media Creator'
WHERE title = 'Social Media Content Creation';
