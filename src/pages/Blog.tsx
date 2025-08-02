import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicBlog from '@/components/blog/DynamicBlog';
import SEOHead from '@/components/SEOHead';
import { pageSEO } from '@/utils/seoData';
import BlogHeroSection from '@/components/blog/BlogHeroSection';
import BlogCategories from '@/components/blog/BlogCategories';
import BlogNewsletter from '@/components/blog/BlogNewsletter';
import EmailCaptureForm from '@/components/marketing/EmailCaptureForm';

const Blog = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead {...pageSEO.blog} />
      <Navbar />
      
      {/* Hero Section */}
      <BlogHeroSection />
      
      {/* Categories Section */}
      <BlogCategories />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DynamicBlog />
            </div>
            <div className="space-y-8">
              <EmailCaptureForm 
                source="blog-sidebar"
                title="Guides IA Exclusifs"
                description="Accédez à nos ressources premium"
                incentive="eBook: Guide complet de l'IA en 2024"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Newsletter Section */}
      <BlogNewsletter />
      
      <Footer />
    </div>
  );
};

export default Blog;
