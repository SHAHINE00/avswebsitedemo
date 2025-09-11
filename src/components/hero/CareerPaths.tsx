import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Code, Send, TrendingUp, ArrowRight } from 'lucide-react';

const CareerPaths: React.FC = () => {
  return (
    <section className="py-20 bg-academy-gray">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-foreground">
              Opportunités de Carrière
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Découvrez des carrières passionnantes dans nos 3 spécialités de formation
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center gap-16 mb-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-academy-blue mb-2">85%</div>
              <div className="text-muted-foreground">Placement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">€52k</div>
              <div className="text-muted-foreground">Salaire moyen</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-academy-lightblue mb-2">25%</div>
              <div className="text-muted-foreground">Croissance</div>
            </div>
          </div>
          
          {/* Career Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* IA & Data Science */}
            <div className="bg-card rounded-3xl p-8 shadow-lg border border-border relative">
              <div className="absolute top-6 right-6">
                <div className="w-3 h-3 bg-academy-blue rounded-full"></div>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-academy-blue/10 rounded-full flex items-center justify-center mr-4">
                  <Brain className="w-6 h-6 text-academy-blue" />
                </div>
                <h3 className="text-2xl font-bold text-academy-blue">IA & Data Science</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-4"></div>
                  <span className="text-card-foreground">Data Scientist</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-4"></div>
                  <span className="text-card-foreground">Ingénieur ML/IA</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-4"></div>
                  <span className="text-card-foreground">Architecte IA</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-4"></div>
                  <span className="text-card-foreground">Analyste BI</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="bg-academy-blue/10 text-academy-blue rounded-full px-4 py-2 font-semibold">
                  €45k - €85k
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            
            {/* Programmation & Infrastructure */}
            <div className="bg-card rounded-3xl p-8 shadow-lg border border-border relative">
              <div className="absolute top-6 right-6">
                <div className="w-3 h-3 bg-academy-purple rounded-full"></div>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-academy-purple/10 rounded-full flex items-center justify-center mr-4">
                  <Code className="w-6 h-6 text-academy-purple" />
                </div>
                <h3 className="text-2xl font-bold text-academy-purple">Programmation & Infrastructure</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-4"></div>
                  <span className="text-card-foreground">Développeur Full Stack</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-4"></div>
                  <span className="text-card-foreground">Développeur Mobile</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-4"></div>
                  <span className="text-card-foreground">Ingénieur DevOps</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-4"></div>
                  <span className="text-card-foreground">Architecte Cloud</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="bg-academy-purple/10 text-academy-purple rounded-full px-4 py-2 font-semibold">
                  €40k - €75k
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>

            {/* Marketing Digital & Créatif */}
            <div className="bg-card rounded-3xl p-8 shadow-lg border border-border relative">
              <div className="absolute top-6 right-6">
                <div className="w-3 h-3 bg-academy-lightblue rounded-full"></div>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-academy-lightblue/10 rounded-full flex items-center justify-center mr-4">
                  <Send className="w-6 h-6 text-academy-lightblue" />
                </div>
                <h3 className="text-2xl font-bold text-academy-lightblue">Marketing Digital & Créatif</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-4"></div>
                  <span className="text-card-foreground">Marketing Manager</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-4"></div>
                  <span className="text-card-foreground">Community Manager</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-4"></div>
                  <span className="text-card-foreground">Content Creator</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-4"></div>
                  <span className="text-card-foreground">E-commerce Specialist</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="bg-academy-lightblue/10 text-academy-lightblue rounded-full px-4 py-2 font-semibold">
                  €35k - €65k
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <Button asChild className="bg-academy-blue hover:bg-academy-blue/90 text-white px-8 py-4 rounded-xl text-lg font-semibold">
              <Link to="/careers" className="flex items-center">
                Voir toutes les opportunités
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPaths;