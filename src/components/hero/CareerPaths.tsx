import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Code, Megaphone, TrendingUp, ArrowRight } from 'lucide-react';

const CareerPaths: React.FC = () => {
  console.log('🎯 CareerPaths component is rendering!');
  
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Opportunités de Carrière
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez des carrières passionnantes dans nos 3 spécialités de formation
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">85%</div>
              <div className="text-sm text-muted-foreground">Placement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">€52k</div>
              <div className="text-sm text-muted-foreground">Salaire moyen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">25%</div>
              <div className="text-sm text-muted-foreground">Croissance</div>
            </div>
          </div>
          
          {/* Career Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* AI & Data Science Career */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-lg mr-3">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">IA & Data Science</h3>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Data Scientist</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Ingénieur ML/IA</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Architecte IA</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>Analyste BI</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                  €45k - €85k
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </div>
            
            {/* Programming & Infrastructure Career */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="bg-secondary/10 p-3 rounded-lg mr-3">
                  <Code className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Programmation & Infrastructure</h3>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-secondary-foreground rounded-full mr-3"></div>
                  <span>Développeur Full Stack</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-secondary-foreground rounded-full mr-3"></div>
                  <span>Développeur Mobile</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-secondary-foreground rounded-full mr-3"></div>
                  <span>Ingénieur DevOps</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-secondary-foreground rounded-full mr-3"></div>
                  <span>Architecte Cloud</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="bg-secondary/10 text-secondary-foreground rounded-full px-3 py-1 text-sm font-medium">
                  €40k - €75k
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </div>

            {/* Marketing Digital & Créatif */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="bg-accent/10 p-3 rounded-lg mr-3">
                  <Megaphone className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Marketing Digital & Créatif</h3>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent-foreground rounded-full mr-3"></div>
                  <span>Marketing Manager</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent-foreground rounded-full mr-3"></div>
                  <span>Community Manager</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent-foreground rounded-full mr-3"></div>
                  <span>Content Creator</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent-foreground rounded-full mr-3"></div>
                  <span>E-commerce Specialist</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="bg-accent/10 text-accent-foreground rounded-full px-3 py-1 text-sm font-medium">
                  €35k - €65k
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <Button asChild size="lg" className="px-8 py-3 text-base">
              <Link to="/careers" className="flex items-center">
                Voir toutes les opportunités
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPaths;