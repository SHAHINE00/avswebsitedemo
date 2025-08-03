import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  blurDataURL?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  placeholder,
  className,
  blurDataURL,
  priority = false,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate a simple blur placeholder if none provided
  const generateBlurDataURL = (width = 40, height = 40) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, width, height);
    }
    return canvas.toDataURL();
  };

  const defaultBlurDataURL = blurDataURL || generateBlurDataURL();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Blur placeholder */}
      <img
        src={placeholder || defaultBlurDataURL}
        alt=""
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
        style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
      />

      {/* Main image */}
      {(isInView || priority) && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <span className="text-sm">Image non disponible</span>
        </div>
      )}

      {/* Loading indicator */}
      {!isLoaded && !error && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

// Hook for managing multiple image loading states
export function useImagePreloader(sources: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadPromises = sources.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]));
          resolve(src);
        };
        img.onerror = () => {
          setFailedImages(prev => new Set([...prev, src]));
          reject(src);
        };
        img.src = src;
      });
    });

    Promise.allSettled(preloadPromises);
  }, [sources]);

  return {
    loadedImages,
    failedImages,
    isLoaded: (src: string) => loadedImages.has(src),
    hasFailed: (src: string) => failedImages.has(src),
    loadProgress: (loadedImages.size / sources.length) * 100
  };
}