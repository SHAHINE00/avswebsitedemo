import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Eye, EyeOff, ArrowUp, ArrowDown, SkipForward, SkipBack } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logError } from '@/utils/logger';

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

interface EnhancedSectionReorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageName: string;
  sections: SectionVisibility[];
  onVisibilityChange: (sectionKey: string, isVisible: boolean) => Promise<void>;
  onReorder: (sectionKey: string, newOrder: number) => Promise<void>;
  onRefetch: () => void;
}

interface SortableItemProps {
  section: SectionVisibility;
  onVisibilityToggle: (sectionKey: string, isVisible: boolean) => Promise<void>;
  onMoveUp: (section: SectionVisibility) => void;
  onMoveDown: (section: SectionVisibility) => void;
  onMoveToTop: (section: SectionVisibility) => void;
  onMoveToBottom: (section: SectionVisibility) => void;
  isFirst: boolean;
  isLast: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({
  section,
  onVisibilityToggle,
  onMoveUp,
  onMoveDown,
  onMoveToTop,
  onMoveToBottom,
  isFirst,
  isLast,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className={`mb-2 ${isDragging ? 'shadow-lg' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            
            <Badge variant="outline" className="text-xs">
              {section.display_order}
            </Badge>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">{section.section_name}</h4>
                {section.is_visible ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
              </div>
              {section.section_description && (
                <p className="text-sm text-gray-600 mt-1">{section.section_description}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">Key: {section.section_key}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={section.is_visible}
              onCheckedChange={(checked) => onVisibilityToggle(section.section_key, checked)}
            />
            
            <div className="flex flex-col space-y-1">
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMoveToTop(section)}
                  disabled={isFirst}
                  className="h-6 w-6 p-0"
                >
                  <SkipBack className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMoveUp(section)}
                  disabled={isFirst}
                  className="h-6 w-6 p-0"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMoveDown(section)}
                  disabled={isLast}
                  className="h-6 w-6 p-0"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMoveToBottom(section)}
                  disabled={isLast}
                  className="h-6 w-6 p-0"
                >
                  <SkipForward className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EnhancedSectionReorderDialog: React.FC<EnhancedSectionReorderDialogProps> = ({
  open,
  onOpenChange,
  pageName,
  sections,
  onVisibilityChange,
  onReorder,
  onRefetch,
}) => {
  const [orderedSections, setOrderedSections] = useState<SectionVisibility[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const filteredSections = sections
      .filter(section => section.page_name === pageName)
      .sort((a, b) => a.display_order - b.display_order);
    setOrderedSections(filteredSections);
  }, [sections, pageName]);

  const getPageDisplayName = (pageName: string) => {
    const pageNames: Record<string, string> = {
      home: 'Page d\'accueil',
      about: 'À propos',
      courses: 'Cours',
      contact: 'Contact',
      global: 'Éléments globaux',
    };
    return pageNames[pageName] || pageName;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over?.id) {
      const activeSection = orderedSections.find(s => s.id === active.id);
      const overIndex = orderedSections.findIndex(s => s.id === over.id);
      
      if (activeSection && overIndex !== -1) {
        // Use the index position instead of display_order for better accuracy
        await updateSectionOrder(activeSection.section_key, overIndex);
      }
    }
  };

  const updateSectionOrder = async (sectionKey: string, newOrder: number) => {
    setIsUpdating(true);
    try {
      await onReorder(sectionKey, newOrder);
      
      toast({
        title: "Ordre mis à jour",
        description: "L'ordre des sections a été sauvegardé automatiquement.",
      });
      
      // Don't manually update state - let the hook handle it through refetch
      onRefetch();
    } catch (error) {
      logError('Error updating section order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'ordre des sections.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVisibilityToggle = async (sectionKey: string, isVisible: boolean) => {
    setIsUpdating(true);
    try {
      await onVisibilityChange(sectionKey, isVisible);
      toast({
        title: "Visibilité mise à jour",
        description: `La section a été ${isVisible ? 'affichée' : 'masquée'} automatiquement.`,
      });
      onRefetch();
    } catch (error) {
      logError('Error updating visibility:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la visibilité.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const moveSection = async (section: SectionVisibility, direction: 'up' | 'down' | 'top' | 'bottom') => {
    const currentIndex = orderedSections.findIndex(s => s.id === section.id);
    if (currentIndex === -1) return;
    
    let newOrder: number;
    
    switch (direction) {
      case 'up':
        newOrder = Math.max(0, currentIndex - 1);
        break;
      case 'down':
        newOrder = Math.min(orderedSections.length - 1, currentIndex + 1);
        break;
      case 'top':
        newOrder = 0;
        break;
      case 'bottom':
        newOrder = orderedSections.length - 1;
        break;
    }
    
    // Only proceed if there's an actual change
    if (newOrder !== currentIndex) {
      await updateSectionOrder(section.section_key, newOrder);
    }
  };

  const visibleCount = orderedSections.filter(s => s.is_visible).length;
  const hiddenCount = orderedSections.length - visibleCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Gérer les sections - {getPageDisplayName(pageName)}
          </DialogTitle>
          <div className="flex space-x-4 text-sm text-gray-600">
            <span>Total: {orderedSections.length}</span>
            <span className="text-green-600">Visibles: {visibleCount}</span>
            <span className="text-gray-400">Masquées: {hiddenCount}</span>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🎯 Contrôle complet des sections</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Faites glisser les sections pour les réorganiser</li>
              <li>• Utilisez les boutons de position pour un contrôle précis</li>
              <li>• Basculez la visibilité avec les interrupteurs</li>
              <li>• Tous les changements sont sauvegardés automatiquement</li>
              <li>• ✨ Système de reordonnancement amélioré - résistant aux conflits</li>
            </ul>
          </div>

          {isUpdating && (
            <div className="text-center py-2 text-blue-600">
              Mise à jour en cours...
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedSections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {orderedSections.map((section, index) => (
                <SortableItem
                  key={section.id}
                  section={section}
                  onVisibilityToggle={handleVisibilityToggle}
                  onMoveUp={(s) => moveSection(s, 'up')}
                  onMoveDown={(s) => moveSection(s, 'down')}
                  onMoveToTop={(s) => moveSection(s, 'top')}
                  onMoveToBottom={(s) => moveSection(s, 'bottom')}
                  isFirst={index === 0}
                  isLast={index === orderedSections.length - 1}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedSectionReorderDialog;