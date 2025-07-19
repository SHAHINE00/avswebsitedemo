
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

const Careers = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
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
            
            {/* AI & Data Science Careers Section */}
            <CareerSection
              title="تخصصات الذكاء الاصطناعي وعلم البيانات"
              description="الذكاء الاصطناعي يحدث ثورة في جميع القطاعات. 11 تخصصاً معتمداً من MIT وGoogle وMicrosoft وIBM وHarvard وStanford لإتقان الذكاء الاصطناعي التوليدي والتعلم الآلي وتحليل البيانات."
              icon={<Brain className="w-8 h-8 text-academy-blue" />}
              careers={aiCareers}
              colorScheme="blue"
            />

            {/* Programming & Tech Infrastructure Section */}
            <CareerSection
              title="تخصصات البرمجة والبنية التحتية التقنية"
              description="تطوير البرمجيات وهندسة السحابة في قلب التحول الرقمي. 11 تخصصاً معتمداً من Google وMicrosoft وAWS وIBM وUnity لإتقان التقنيات الأكثر طلباً."
              icon={<Code className="w-8 h-8 text-academy-purple" />}
              careers={programmingCareers}
              colorScheme="purple"
            />

            {/* Digital Marketing & Creative Section */}
            <CareerSection
              title="تخصصات التسويق الرقمي والإبداع"
              description="التسويق الرقمي المدعوم بالذكاء الاصطناعي وإنشاء المحتوى يوفران فرصاً استثنائية. 12 تخصصاً معتمداً من Google وMeta وAdobe وStanford وPMI للهيمنة على الاقتصاد الإبداعي."
              icon={<Megaphone className="w-8 h-8 text-academy-lightblue" />}
              careers={digitalMarketingCareers}
              colorScheme="green"
            />

            {/* Entrepreneurship Section */}
            <EntrepreneurshipSection opportunities={entrepreneurshipOpportunities} />

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
