import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicBlog from '@/components/blog/DynamicBlog';


const Blog = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-white to-academy-gray">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Découvrez nos articles sur l'Intelligence Artificielle, la Programmation et les carrières dans la tech.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <DynamicBlog />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
