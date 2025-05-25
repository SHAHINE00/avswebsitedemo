
import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes,
  onError
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if the browser supports WebP
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // Generate WebP version if supported
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('unsplash.com')) {
      // For Unsplash images, add WebP format parameter
      const url = new URL(originalSrc);
      url.searchParams.set('fm', 'webp');
      url.searchParams.set('auto', 'format,compress');
      return url.toString();
    }
    return originalSrc;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    if (onError) {
      onError(e);
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const optimizedSrc = supportsWebP() ? getOptimizedSrc(src) : src;

  return (
    <div className={`relative ${!isLoaded ? 'bg-gray-200 animate-pulse' : ''}`}>
      <img
        src={imageError ? src : optimizedSrc}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoaded ? 1 : 0
        }}
      />
    </div>
  );
};

export default OptimizedImage;
