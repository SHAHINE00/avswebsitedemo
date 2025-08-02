import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Target, 
  BookOpen, 
  GraduationCap, 
  Goal, 
  CheckCircle, 
  Users,
  Award
} from 'lucide-react';

interface TableOfContentsItem {
  section: string;
  title: string;
  anchor: string;
  icon: string;
}

interface TableOfContentsSectionProps {
  tableOfContents: TableOfContentsItem[];
}

const iconMap = {
  FileText,
  Target,
  BookOpen,
  GraduationCap,
  Goal,
  CheckCircle,
  Users,
  Award
};

const TableOfContentsSection: React.FC<TableOfContentsSectionProps> = ({ 
  tableOfContents 
}) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Table des Matières
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez le programme complet de cette formation d'excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {tableOfContents.map((item, index) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || FileText;
            
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 cursor-pointer"
              >
                <a href={`#${item.anchor}`} className="block">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="text-sm font-bold text-primary mb-2">
                      Section {item.section}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                      {item.title}
                    </h3>
                  </CardContent>
                </a>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TableOfContentsSection;