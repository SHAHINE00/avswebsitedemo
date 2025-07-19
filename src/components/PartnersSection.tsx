import React from 'react';

const PartnersSection: React.FC = () => {
  const partners = [
    { name: 'MIT', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg', url: 'https://web.mit.edu/' },
    { name: 'Stanford University', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Coat_of_Arms_of_Leland_Stanford_Junior_University.svg', url: 'https://www.stanford.edu/' },
    { name: 'Harvard University', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Harvard_University_coat_of_arms.svg', url: 'https://www.harvard.edu/' },
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', url: 'https://www.google.com/' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', url: 'https://www.microsoft.com/' },
    { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', url: 'https://www.ibm.com/' },
    { name: 'Amazon Web Services', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', url: 'https://aws.amazon.com/' },
    { name: 'Unity Technologies', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Unity_Technologies_logo.svg', url: 'https://unity.com/' },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', url: 'https://about.meta.com/' },
    { name: 'Adobe', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg', url: 'https://www.adobe.com/' },
    { name: 'PMI', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/PMI_logo.svg', url: 'https://www.pmi.org/' },
  ];

  // Duplicate the partners array for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-16 bg-gray-50/50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Nos partenaires académiques & technologiques</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Des certifications reconnues mondialement grâce à nos partenariats prestigieux
          </p>
        </div>

        {/* Partners Slider */}
        <div className="relative">
          {/* Main Slider Container */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll">
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="flex-shrink-0 mx-8 group cursor-pointer"
                >
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-all duration-300 transform group-hover:scale-110 group-hover:drop-shadow-lg"
                  >
                    <div className="h-16 w-32 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-4 group-hover:shadow-md group-hover:border-academy-blue/20 transition-all duration-300">
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                        loading="lazy"
                      />
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient Overlays for Seamless Effect */}
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-gray-50/50 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-50/50 to-transparent pointer-events-none"></div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === 0 ? 'bg-academy-blue' : 'bg-gray-300'
                }`}
                style={{
                  animationDelay: `${index * 0.5}s`,
                  animation: 'progress-pulse 2.5s infinite'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Stats Below */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-academy-blue mb-2">11+</div>
            <div className="text-gray-600 text-sm">Partenaires prestigieux</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-academy-blue mb-2">100%</div>
            <div className="text-gray-600 text-sm">Certifications reconnues</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-academy-blue mb-2">26+</div>
            <div className="text-gray-600 text-sm">Formations certifiées</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-academy-blue mb-2">∞</div>
            <div className="text-gray-600 text-sm">Opportunités</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;