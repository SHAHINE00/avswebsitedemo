import React from 'react';
import CareerPaths from '@/components/hero/CareerPaths';

/**
 * Isolated test component for CareerPaths to verify it renders independently
 */
const CareerPathsTestComponent: React.FC = () => {
  console.log('🧪 CareerPathsTestComponent: Rendering isolated test');
  
  return (
    <div className="bg-blue-50 border-2 border-blue-200 p-4 m-4 rounded-lg">
      <h2 className="text-blue-800 font-bold mb-4">
        🧪 Isolated CareerPaths Test Component
      </h2>
      <p className="text-blue-700 mb-4">
        This is a direct render of the CareerPaths component to test if it works independently.
      </p>
      <div className="border border-blue-300 rounded">
        <CareerPaths />
      </div>
    </div>
  );
};

export default CareerPathsTestComponent;