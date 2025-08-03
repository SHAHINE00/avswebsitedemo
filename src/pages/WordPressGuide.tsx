
import React from 'react';
import { Link } from 'react-router-dom';

const WordPressGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-academy-blue">WordPress & Elementor Integration Guide</h1>
        
        <div className="bg-academy-gray p-6 rounded-lg mb-8">
          <p className="text-lg mb-4">
            This page provides guidance on how to transfer this React-based landing page design to WordPress using Elementor.
          </p>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-academy-purple">Method 1: Section-by-Section HTML Export</h2>
        <p className="mb-6">
          Each section below contains the HTML markup that can be copied and pasted into Elementor's HTML widget.
          You'll need to add your own styles or use Elementor's styling options.
        </p>
        
        <div className="space-y-8">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Hero Section</h3>
            <p className="mb-4">Copy this HTML into an Elementor HTML widget:</p>
            <div className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto">
              <pre>{`<div class="hero-section">
  <div class="hero-content">
    <span class="tag">Now Enrolling</span>
    <h1>Become an <span class="gradient-text">AI Technician Specialist</span></h1>
    <p>Master cutting-edge AI technologies with our comprehensive training program.</p>
    <div class="buttons">
      <a href="#" class="button primary">Enroll Now</a>
      <a href="#" class="button secondary">Download Syllabus</a>
    </div>
    <div class="stats">
      <div class="stat"><span>5000+ Graduates</span></div>
      <div class="stat"><span>Industry-Approved</span></div>
      <div class="stat"><span>4.8/5 Rating</span></div>
    </div>
  </div>
  <div class="hero-image">
    <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" alt="AI Training">
  </div>
</div>`}</pre>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Features Section</h3>
            <p className="mb-4">Copy this HTML into an Elementor HTML widget:</p>
            <div className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto">
              <pre>{`<div class="features-section">
  <h2>Why Choose Our AI Technician Program</h2>
  <p>Our comprehensive program is designed to transform beginners into industry-ready AI specialists.</p>
  
  <div class="features-grid">
    <div class="feature">
      <div class="icon"><!-- Insert icon here --></div>
      <h3>AI Fundamentals</h3>
      <p>Learn the core concepts and mathematics behind machine learning and artificial intelligence.</p>
    </div>
    <!-- Repeat similar blocks for other features -->
  </div>
</div>`}</pre>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">CSS Styles</h3>
            <p className="mb-4">Add these styles to Elementor's Custom CSS section:</p>
            <div className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto">
              <pre>{`:root {
  --academy-blue: #4A55A2;
  --academy-purple: #7E69AB;
  --academy-lightblue: #6EC1E4;
  --academy-gray: #F8F9FA;
}

.gradient-text {
  background-image: linear-gradient(to right, var(--academy-blue), var(--academy-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.button.primary {
  background-color: var(--academy-blue);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  display: inline-block;
  transition: background-color 0.3s;
}

.button.primary:hover {
  background-color: var(--academy-purple);
}

/* Add more styles as needed */`}</pre>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Colors & Typography</h3>
            <p className="mb-4">Configure these global styles in Elementor:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Primary Color:</strong> #4A55A2 (Academy Blue)</li>
              <li><strong>Secondary Color:</strong> #7E69AB (Academy Purple)</li>
              <li><strong>Accent Color:</strong> #6EC1E4 (Light Blue)</li>
              <li><strong>Background:</strong> #F8F9FA (Light Gray)</li>
              <li><strong>Heading Font:</strong> Montserrat</li>
              <li><strong>Body Font:</strong> Source Sans Pro</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 bg-academy-blue/10 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Need Further Assistance?</h2>
          <p>
            For more detailed instructions or custom implementation support, please contact our web development team
            or consider hiring a WordPress developer familiar with Elementor.
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-block bg-academy-blue text-white px-6 py-2 rounded hover:bg-academy-purple transition-colors"
          >
            Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WordPressGuide;
