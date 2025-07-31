import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, GripVertical, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SectionVisibility {
  id: string;
  section_key: string;
  section_name: string;
  section_description?: string;
  is_visible: boolean;
  page_name: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

interface SectionReorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageName: string;
  sections: SectionVisibility[];
  onSuccess: () => void;
  onReorder: (sectionKey: string, newOrder: number) => Promise<void>;
}

const SectionReorderDialog: React.FC<SectionReorderDialogProps> = ({
  open,
  onOpenChange,
  pageName,
  sections,
  onSuccess,
  onReorder
}) => {
  const [orderedSections, setOrderedSections] = useState<SectionVisibility[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (sections) {
      const sorted = [...sections].sort((a, b) => a.display_order - b.display_order);
      setOrderedSections(sorted);
    }
  }, [sections]);

  const moveSection = (fromIndex: number, toIndex: number) => {
    const newSections = [...orderedSections];
    const [removed] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, removed);
    setOrderedSections(newSections);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update the display_order for each section based on its new position
      const updates = [];
      for (let i = 0; i < orderedSections.length; i++) {
        const section = orderedSections[i];
        const newOrder = i + 1;
        if (section.display_order !== newOrder) {
          updates.push(onReorder(section.section_key, newOrder));
        }
      }

      // Wait for all updates to complete
      await Promise.all(updates);

      toast({
        title: "Ordre mis à jour",
        description: "L'ordre des sections a été mis à jour avec succès.",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating section order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'ordre des sections.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPageDisplayName = (pageName: string): string => {
    const pageNames: Record<string, string> = {
      'home': 'Page d\'accueil',
      'about': 'À propos',
      'courses': 'Formations',
      'curriculum': 'Curriculum',
      'contact': 'Contact',
      'features': 'Fonctionnalités',
      'testimonials': 'Témoignages',
      'instructors': 'Instructeurs',
      'careers': 'Carrières',
      'blog': 'Blog'
    };
    return pageNames[pageName] || pageName;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Réorganiser les sections - {getPageDisplayName(pageName)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Utilisez les flèches pour réorganiser l'ordre d'affichage des sections sur cette page.
          </p>
          
          <div className="space-y-2">
            {orderedSections.map((section, index) => (
              <Card key={section.id} className="p-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3 flex-1">
                     <div className="flex items-center space-x-2">
                       <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                       <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                         {index + 1}
                       </div>
                     </div>
                     
                     <div className="flex-1">
                       <div className="flex items-center space-x-2">
                         <h4 className="font-medium">{section.section_name}</h4>
                         <Badge 
                           variant={section.is_visible ? "default" : "secondary"}
                           className="text-xs"
                         >
                           {section.is_visible ? (
                             <><Eye className="h-3 w-3 mr-1" />Visible</>
                           ) : (
                             <><EyeOff className="h-3 w-3 mr-1" />Masqué</>
                           )}
                         </Badge>
                       </div>
                       {section.section_description && (
                         <p className="text-sm text-muted-foreground mt-1">
                           {section.section_description}
                         </p>
                       )}
                     </div>
                   </div>
                   
                   <div className="flex items-center space-x-1">
                     <Button
                       variant="outline"
                       size="icon"
                       onClick={() => moveSection(index, index - 1)}
                       disabled={index === 0}
                       className="h-8 w-8 hover:bg-primary/10"
                       title="Déplacer vers le haut"
                     >
                       <ArrowUp className="h-4 w-4" />
                     </Button>
                     <Button
                       variant="outline"
                       size="icon"
                       onClick={() => moveSection(index, index + 1)}
                       disabled={index === orderedSections.length - 1}
                       className="h-8 w-8 hover:bg-primary/10"
                       title="Déplacer vers le bas"
                     >
                       <ArrowDown className="h-4 w-4" />
                     </Button>
                   </div>
                 </div>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Sauvegarde..." : "Sauvegarder l'ordre"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SectionReorderDialog;