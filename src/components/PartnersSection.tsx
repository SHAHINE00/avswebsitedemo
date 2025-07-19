import React from 'react';

const PartnersSection: React.FC = () => {
  const partners = [
    { name: 'Google', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTIwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjYwIiB5PSIzMiIgZm9udC1mYW1pbHk9IidIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM0QTU1QTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkdvb2dsZTwvdGV4dD48L3N2Zz4=', url: 'https://www.google.com/' },
    { name: 'Microsoft', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTIwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjYwIiB5PSIzMiIgZm9udC1mYW1pbHk9IidIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTciIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM3RTY5QUIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1pY3Jvc29mdDwvdGV4dD48L3N2Zz4=', url: 'https://www.microsoft.com/' },
    { name: 'IBM', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTIwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjYwIiB5PSIzMiIgZm9udC1mYW1pbHk9IidIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiM2RUMxRTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPklCTTwvdGV4dD48L3N2Zz4=', url: 'https://www.ibm.com/' },
    { name: 'Amazon Web Services', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTIwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjYwIiB5PSIzMiIgZm9udC1mYW1pbHk9IidIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiM0QTU1QTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFXUzwvdGV4dD48L3N2Zz4=', url: 'https://aws.amazon.com/' },
    { name: 'Harvard University', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTIwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjYwIiB5PSIzMiIgZm9udC1mYW1pbHk9IidIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTciIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM2RUMxRTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhBUlZBUkQ8L3RleHQ+PC9zdmc+', url: 'https://www.harvard.edu/' },
    { name: 'MIT', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTIwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjYwIiB5PSIzMiIgZm9udC1mYW1pbHk9IidIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiM0QTU1QTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1JVDwvdGV4dD48L3N2Zz4=', url: 'https://web.mit.edu/' },
    { name: 'Stanford University', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTIwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjYwIiB5PSIzMiIgZm9udC1mYW1pbHk9IidIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTciIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM3RTY5QUIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNUQU5GT1JEPC90ZXh0Pjwvc3ZnPg==', url: 'https://www.stanford.edu/' },
    { name: 'Unity Technologies', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTIwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjYwIiB5PSIzMiIgZm9udC1mYW1pbHk9IidIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM3RTY5QUIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlVOSVRZPC90ZXh0Pjwvc3ZnPg==', url: 'https://unity.com/' },
    { name: 'Meta', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTIwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjYwIiB5PSIzMiIgZm9udC1mYW1pbHk9IidIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjIiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM2RUMxRTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1FVEE8L3RleHQ+PC9zdmc+', url: 'https://about.meta.com/' },
    { name: 'Adobe', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTIwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjYwIiB5PSIzMiIgZm9udC1mYW1pbHk9IidIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM0QTU1QTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFkb2JlPC90ZXh0Pjwvc3ZnPg==', url: 'https://www.adobe.com/' },
    { name: 'PMI', logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTIwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjYwIiB5PSIzMiIgZm9udC1mYW1pbHk9IidIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiM3RTY5QUIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBNSTwvdGV4dD48L3N2Zz4=', url: 'https://www.pmi.org/' },
  ];

  // Split partners into two rows
  const firstRowPartners = partners.slice(0, 6);
  const secondRowPartners = partners.slice(6);
  
  // Duplicate arrays for seamless infinite scroll
  const duplicatedFirstRow = [...firstRowPartners, ...firstRowPartners];
  const duplicatedSecondRow = [...secondRowPartners, ...secondRowPartners];

  return (
    <section className="py-6 sm:py-8 bg-gray-50/50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Nos partenaires académiques & technologiques</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            Des certifications reconnues mondialement grâce à nos partenariats prestigieux
          </p>
        </div>

        {/* Partners Slider */}
        <div className="relative space-y-6">
          {/* First Row - Right to Left */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll-rtl">
              {duplicatedFirstRow.map((partner, index) => (
                <div
                  key={`first-${partner.name}-${index}`}
                  className="flex-shrink-0 mx-4 sm:mx-6 md:mx-8 group cursor-pointer"
                >
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-all duration-300 transform group-hover:scale-110 group-hover:drop-shadow-lg"
                  >
                    <div className="h-16 w-32 sm:h-18 sm:w-36 md:h-20 md:w-40 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-5 group-hover:shadow-md group-hover:border-academy-blue/20 transition-all duration-300">
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Second Row - Left to Right */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll-ltr">
              {duplicatedSecondRow.map((partner, index) => (
                <div
                  key={`second-${partner.name}-${index}`}
                  className="flex-shrink-0 mx-4 sm:mx-6 md:mx-8 group cursor-pointer"
                >
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-all duration-300 transform group-hover:scale-110 group-hover:drop-shadow-lg"
                  >
                    <div className="h-16 w-32 sm:h-18 sm:w-36 md:h-20 md:w-40 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-5 group-hover:shadow-md group-hover:border-academy-blue/20 transition-all duration-300">
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient Overlays for Seamless Effect */}
          <div className="absolute top-0 left-0 w-12 sm:w-16 md:w-24 h-full bg-gradient-to-r from-gray-50/50 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-12 sm:w-16 md:w-24 h-full bg-gradient-to-l from-gray-50/50 to-transparent pointer-events-none"></div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 md:mt-12 max-w-4xl mx-auto border-none">
          <div className="text-center border-none">
            <div className="text-2xl sm:text-3xl font-bold text-academy-blue mb-1 sm:mb-2 border-none">11+</div>
            <div className="text-gray-600 text-xs sm:text-sm border-none">Partenaires prestigieux</div>
          </div>
          <div className="text-center border-none">
            <div className="text-2xl sm:text-3xl font-bold text-academy-blue mb-1 sm:mb-2 border-none">100%</div>
            <div className="text-gray-600 text-xs sm:text-sm border-none">Certifications reconnues</div>
          </div>
          <div className="text-center border-none">
            <div className="text-2xl sm:text-3xl font-bold text-academy-blue mb-1 sm:mb-2 border-none">26+</div>
            <div className="text-gray-600 text-xs sm:text-sm border-none">Formations certifiées</div>
          </div>
          <div className="text-center border-none">
            <div className="text-2xl sm:text-3xl font-bold text-academy-blue mb-1 sm:mb-2 border-none">∞</div>
            <div className="text-gray-600 text-xs sm:text-sm border-none">Opportunités</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;