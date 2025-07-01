import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

const blogPosts = [
  {
    title: "Les fondamentaux de l'Intelligence Artificielle expliqués simplement",
    content: "L'Intelligence Artificielle (IA) est devenue omniprésente dans notre vie quotidienne. Mais qu'est-ce que c'est vraiment ? Dans cet article, nous allons explorer les bases de l'IA et comprendre comment cette technologie révolutionnaire fonctionne...",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop",
    date: "10 avril 2025",
    author: "Dr. Youssef Bennani",
    category: "Intelligence Artificielle"
  },
  {
    title: "Comment débuter en programmation : Guide complet pour les débutants",
    content: "La programmation peut sembler intimidante au premier abord, mais avec les bonnes bases et une approche structurée, tout le monde peut apprendre à coder. Ce guide vous accompagnera dans vos premiers pas...",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    date: "28 mars 2025",
    author: "Fatima Zahra Alami",
    category: "Programmation"
  },
  {
    title: "Le deep learning en 2025 : Tendances et innovations",
    content: "Le deep learning continue d'évoluer rapidement. En 2025, nous observons des avancées remarquables dans plusieurs domaines. Découvrons ensemble les dernières innovations...",
    image: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=800&h=500&fit=crop",
    date: "15 mars 2025",
    author: "Dr. Hassan Cherkaoui",
    category: "Deep Learning"
  },
  {
    title: "Les métiers d'avenir dans la tech : Se former pour réussir",
    content: "Le secteur technologique offre de nombreuses opportunités de carrière. Quels sont les métiers les plus prometteurs et comment s'y préparer ? Explorons ensemble...",
    image: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=800&h=500&fit=crop",
    date: "5 mars 2025",
    author: "Aicha Bourhim",
    category: "Carrière"
  }
];

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const postIndex = parseInt(id || '1') - 1;
  const post = blogPosts[postIndex];

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
            <Link to="/blog" className="text-academy-blue hover:underline">
              Retour au blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-academy-blue hover:underline mb-8"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Retour au blog
          </Link>
          
          <article>
            <div className="mb-8">
              <span className="bg-academy-blue/10 text-academy-blue px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-8">
              <span>Par {post.author}</span>
              <span className="mx-2">•</span>
              <span>{post.date}</span>
            </div>
            
            <OptimizedImage
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                {post.content}
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;