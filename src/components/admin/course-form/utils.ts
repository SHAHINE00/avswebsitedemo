
// Function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const validateAndFormatLink = (link: string): string => {
  if (!link) return '';
  
  // Remove any existing /course/ prefix to avoid duplication
  let cleanLink = link.replace(/^\/course\//, '').replace(/^\//, '');
  
  // If it's empty after cleaning, return empty
  if (!cleanLink) return '';
  
  // Generate slug from the link
  const slug = generateSlug(cleanLink);
  
  // Return formatted link
  return `/course/${slug}`;
};
