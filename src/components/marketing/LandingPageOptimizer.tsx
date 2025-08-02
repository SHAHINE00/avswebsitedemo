import React, { useEffect, useState } from 'react';

interface LandingPageOptimizerProps {
  children: React.ReactNode;
  testName: string;
  variants: Record<string, React.ReactNode>;
}

const LandingPageOptimizer: React.FC<LandingPageOptimizerProps> = ({
  children,
  testName,
  variants
}) => {
  const [variant, setVariant] = useState<string>('default');

  useEffect(() => {
    // Check if user already has a variant assigned
    const storedVariant = localStorage.getItem(`ab_test_${testName}`);
    
    if (storedVariant && variants[storedVariant]) {
      setVariant(storedVariant);
    } else {
      // Assign random variant
      const variantKeys = Object.keys(variants);
      const randomVariant = variantKeys[Math.floor(Math.random() * variantKeys.length)];
      setVariant(randomVariant);
      localStorage.setItem(`ab_test_${testName}`, randomVariant);
    }
  }, [testName, variants]);

  // Track variant view
  useEffect(() => {
    if (variant !== 'default') {
      // Track A/B test exposure
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'ab_test_exposure', {
          test_name: testName,
          variant: variant,
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [variant, testName]);

  if (variant === 'default') {
    return <>{children}</>;
  }

  return <>{variants[variant] || children}</>;
};

export default LandingPageOptimizer;