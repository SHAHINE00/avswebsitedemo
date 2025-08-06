
import React, { useRef } from 'react';
import { useSafeState, useSafeEffect } from '@/utils/safeHooks';
import { optimizeImageUrl, generateResponsiveSizes, checkWebPSupport } from '@/utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  quality?: number;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoad?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes,
  width,
  height,
  quality = 85,
  onError,
  onLoad
}) => {
  const [imageError, setImageError] = useSafeState(false);
  const [isLoaded, setIsLoaded] = useSafeState(false);
  const [optimizedSrc, setOptimizedSrc] = useSafeState(src);
  const [webpSupported, setWebpSupported] = useSafeState<boolean | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check WebP support on mount
  useSafeEffect(() => {
    checkWebPSupport().then(setWebpSupported);
  }, []);

  // Update optimized source when WebP support is determined
  useSafeEffect(() => {
    if (webpSupported !== null) {
      const optimized = webpSupported ? optimizeImageUrl(src, width, quality) : src;
      setOptimizedSrc(optimized);
    }
  }, [src, webpSupported, width, quality]);

  // Generate responsive sizes if width is provided
  const responsiveSizes = sizes || (width ? generateResponsiveSizes(width) : undefined);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    // Fallback to original source on error
    if (imageError && optimizedSrc !== src) {
      setOptimizedSrc(src);
      setImageError(false);
    } else if (onError) {
      onError(e);
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div className={`relative overflow-hidden ${!isLoaded ? 'bg-muted animate-pulse' : ''}`}>
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={priority ? 'eager' : 'lazy'}
        sizes={responsiveSizes}
        width={width}
        height={height}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
        }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
    </div>
  );
};

export default OptimizedImage;
