
import React from 'react';

const AdvantageBadges: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center">Nos avantages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="feature-card bg-white p-4 sm:p-5 rounded-lg border border-gray-200 hover:border-academy-blue transition-all flex items-center min-h-[60px] touch-manipulation">
            <span className="text-2xl sm:text-3xl mr-3 sm:mr-4 flex-shrink-0">🎓</span>
            <span className="font-medium text-sm sm:text-base">Formation reconnue par l'État</span>
          </div>
          <div className="feature-card bg-white p-4 sm:p-5 rounded-lg border border-gray-200 hover:border-academy-blue transition-all flex items-center min-h-[60px] touch-manipulation">
            <span className="text-2xl sm:text-3xl mr-3 sm:mr-4 flex-shrink-0">🌍</span>
            <span className="font-medium text-sm sm:text-base">Certification internationale</span>
          </div>
          <div className="feature-card bg-white p-4 sm:p-5 rounded-lg border border-gray-200 hover:border-academy-blue transition-all flex items-center min-h-[60px] touch-manipulation">
            <span className="text-2xl sm:text-3xl mr-3 sm:mr-4 flex-shrink-0">💼</span>
            <span className="font-medium text-sm sm:text-base">Métiers tech rémunérateurs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvantageBadges;
