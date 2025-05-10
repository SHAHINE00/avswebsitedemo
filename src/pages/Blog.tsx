
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    title: "Les fondamentaux de l'Intelligence Artificielle expliqués simplement",
    excerpt: "Comprendre les bases qui ont révolutionné le monde de la technologie ces dernières années.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop",
    date: "10 avril 2025",
    author: "Dr. Ahmed Al-Faisal",
    category: "Intelligence Artificielle"
  },
  {
    title: "Comment débuter en programmation : Guide complet pour les débutants",
    excerpt: "Les étapes essentielles pour commencer votre parcours en programmation et devenir développeur.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    date: "28 mars 2025",
    author: "Nadia Al-Khatib",
    category: "Programmation"
  },
  {
    title: "Le deep learning en 2025 : Tendances et innovations",
    excerpt: "Découvrez les avancées récentes dans le domaine du deep learning et leur impact sur l'industrie.",
    image: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=800&h=500&fit=crop",
    date: "15 mars 2025",
    author: "Dr. Omar Nasser",
    category: "Deep Learning"
  },
  {
    title: "Les métiers d'avenir dans la tech : Se former pour réussir",
    excerpt: "Quelles sont les compétences recherchées par les entreprises et comment s'y préparer ?",
    image: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=800&h=500&fit=crop",
    date: "5 mars 2025",
    author: "Layla Mahmoud",
    category: "Carrière"
  }
];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span className="bg-academy-blue/10 text-academy-blue px-2 py-1 rounded-full">{post.category}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 hover:text-academy-blue transition-colors">
                    <a href="#">{post.title}</a>
                  </h2>
                  <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-600">Par {post.author}</span>
                    <a href="#" className="text-academy-blue font-medium flex items-center hover:underline">
                      Lire plus <ArrowRight className="ml-1 w-4 h-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
