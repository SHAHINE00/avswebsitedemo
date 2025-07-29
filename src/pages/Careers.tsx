
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CareerSection from '@/components/careers/CareerSection';
import HeroStatsGrid from '@/components/careers/HeroStatsGrid';
import EntrepreneurshipSection from '@/components/careers/EntrepreneurshipSection';
import SuccessStoriesSection from '@/components/careers/SuccessStoriesSection';
import CTASection from '@/components/careers/CTASection';
import { Brain, Code, TrendingUp, Megaphone } from 'lucide-react';
import { aiCareers, programmingCareers, digitalMarketingCareers, entrepreneurshipOpportunities, successStats } from '@/data/careersData';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/utils/seoData';

const Careers = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead {...pageSEO.careers} />
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-br from-academy-purple via-academy-blue to-academy-lightblue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-2xl">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              31+ تخصصاً معتمداً دولياً
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
              اكتشف 31+ تخصصاً معتمداً من MIT وGoogle وMicrosoft وIBM وHarvard وStanford والمزيد. 
              احصل على شهادتك الدولية في 3-8 أسابيع وحوّل مسيرتك المهنية.
            </p>
            
            <HeroStatsGrid stats={successStats} />
          </div>
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Three Pillars Section */}
            <div className="space-y-20">
              
              {/* Pillar 1: AI & Data Science */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-academy-blue/20 to-academy-blue/30 p-6 rounded-3xl shadow-lg">
                    <Brain className="w-16 h-16 text-academy-blue" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-academy-blue to-academy-purple bg-clip-text text-transparent">
                  ركيزة الذكاء الاصطناعي وعلم البيانات
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                  11 تخصصاً معتمداً من MIT وGoogle وMicrosoft وIBM وHarvard وStanford لإتقان الذكاء الاصطناعي التوليدي والتعلم الآلي وتحليل البيانات
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aiCareers.map((career, index) => (
                    <div key={index} className="group relative">
                      <div className="bg-gradient-to-br from-white to-academy-blue/5 border border-academy-blue/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-academy-blue/10 to-academy-blue/20 rounded-xl flex items-center justify-center">
                            <Brain className="w-8 h-8 text-academy-blue" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">{career.title}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">المدة:</span>
                            <span className="font-semibold text-academy-blue">{career.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الشهادة:</span>
                            <span className="font-semibold text-academy-blue">{career.certification}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الجهة:</span>
                            <span className="font-semibold text-academy-blue">{career.certifyingPartners}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 2: Programming & Tech Infrastructure */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-academy-purple/20 to-academy-purple/30 p-6 rounded-3xl shadow-lg">
                    <Code className="w-16 h-16 text-academy-purple" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-academy-purple to-academy-lightblue bg-clip-text text-transparent">
                  ركيزة البرمجة والبنية التحتية التقنية
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                  11 تخصصاً معتمداً من Google وMicrosoft وAWS وIBM وUnity لإتقان التقنيات الأكثر طلباً في السوق
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {programmingCareers.map((career, index) => (
                    <div key={index} className="group relative">
                      <div className="bg-gradient-to-br from-white to-academy-purple/5 border border-academy-purple/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-academy-purple/10 to-academy-purple/20 rounded-xl flex items-center justify-center">
                            <Code className="w-8 h-8 text-academy-purple" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">{career.title}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">المدة:</span>
                            <span className="font-semibold text-academy-purple">{career.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الشهادة:</span>
                            <span className="font-semibold text-academy-purple">{career.certification}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الجهة:</span>
                            <span className="font-semibold text-academy-purple">{career.certifyingPartners}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 3: Digital Marketing & Creative */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-academy-lightblue/20 to-academy-lightblue/30 p-6 rounded-3xl shadow-lg">
                    <Megaphone className="w-16 h-16 text-academy-lightblue" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-academy-lightblue to-academy-blue bg-clip-text text-transparent">
                  ركيزة التسويق الرقمي والإبداع
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                  12 تخصصاً معتمداً من Google وMeta وAdobe وStanford وPMI للهيمنة على الاقتصاد الإبداعي والتسويق الرقمي
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {digitalMarketingCareers.map((career, index) => (
                    <div key={index} className="group relative">
                      <div className="bg-gradient-to-br from-white to-academy-lightblue/5 border border-academy-lightblue/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-academy-lightblue/10 to-academy-lightblue/20 rounded-xl flex items-center justify-center">
                            <Megaphone className="w-8 h-8 text-academy-lightblue" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-center">{career.title}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">المدة:</span>
                            <span className="font-semibold text-academy-lightblue">{career.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الشهادة:</span>
                            <span className="font-semibold text-academy-lightblue">{career.certification}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الجهة:</span>
                            <span className="font-semibold text-academy-lightblue">{career.certifyingPartners}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Entrepreneurship Section */}
            <div className="mt-20">
              <EntrepreneurshipSection opportunities={entrepreneurshipOpportunities} />
            </div>

            {/* Success Stories Section */}
            <SuccessStoriesSection />

            {/* Call to Action */}
            <CTASection />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
