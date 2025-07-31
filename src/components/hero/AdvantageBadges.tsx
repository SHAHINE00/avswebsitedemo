
import React from 'react';

const AdvantageBadges: React.FC = () => {
  return (
    <div className="container mx-auto px-6 mt-4">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-6 text-center">Nos avantages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="feature-card bg-white p-5 rounded-lg border border-gray-200 hover:border-academy-blue transition-all flex items-center">
            <span className="text-3xl mr-4">🎓</span>
            <span className="font-medium">Formation reconnue par l'État</span>
          </div>
          <div className="feature-card bg-white p-5 rounded-lg border border-gray-200 hover:border-academy-blue transition-all flex items-center">
            <span className="text-3xl mr-4">🌍</span>
            <span className="font-medium">Certification internationale</span>
          </div>
          <div className="feature-card bg-white p-5 rounded-lg border border-gray-200 hover:border-academy-blue transition-all flex items-center">
            <span className="text-3xl mr-4">💼</span>
            <span className="font-medium">Métiers tech rémunérateurs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvantageBadges;
