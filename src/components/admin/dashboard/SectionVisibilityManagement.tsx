import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Settings, Globe, Shuffle, AlertTriangle } from 'lucide-react';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';
import { useToast } from '@/hooks/use-toast';
import EnhancedSectionReorderDialog from './EnhancedSectionReorderDialog';

const SectionVisibilityManagement: React.FC = () => {
  // Component mappings for validation
  const MAPPED_SECTIONS = [
    'global_navbar', 'global_footer',
    'home_hero', 'home_partners', 'home_features', 'home_course_guide',
    'home_instructors', 'home_testimonials', 'home_faq', 'home_cta',
    'about_hero', 'about_mission', 'about_values', 'about_stats',
    'about_history', 'about_cta',
    'features_hero', 'features_main'
  ];

  const {
    sections,
    loading,
    error,
    updateSectionVisibility,
    updateSectionOrder,
    getSectionsByPage,
    refetch
  } = useSectionVisibility();

  const { toast } = useToast();
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [selectedPageForReorder, setSelectedPageForReorder] = useState<string>('');

  const handleToggleVisibility = async (sectionKey: string, currentVisibility: boolean) => {
    try {
      await updateSectionVisibility(sectionKey, !currentVisibility);
      toast({
        title: "Visibilité mise à jour",
        description: `La section a été ${!currentVisibility ? 'activée' : 'désactivée'}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la visibilité de la section",
        variant: "destructive",
      });
    }
  };

  const getPageDisplayName = (pageName: string) => {
    switch (pageName) {
      case 'home': return 'Accueil';
      case 'about': return 'À propos';
      case 'features': return 'Fonctionnalités';
      case 'global': return 'Éléments globaux';
      default: return pageName;
    }
  };

  const getVisibilityStats = () => {
    const total = sections.length;
    const visible = sections.filter(s => s.is_visible).length;
    const hidden = total - visible;
    return { total, visible, hidden };
  };

  const getUnmappedSections = () => {
    return sections.filter(section => !MAPPED_SECTIONS.includes(section.section_key));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Erreur: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const stats = getVisibilityStats();
  const pageNames = [...new Set(sections.map(s => s.page_name))];
  const unmappedSections = getUnmappedSections();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Gestion de la Visibilité</h1>
          <p className="text-muted-foreground">
            Contrôlez la visibilité des sections de votre site web
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Sections gérées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sections Visibles</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.visible}</div>
            <p className="text-xs text-muted-foreground">
              Affichées sur le site
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sections Masquées</CardTitle>
            <EyeOff className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.hidden}</div>
            <p className="text-xs text-muted-foreground">
              Temporairement cachées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Unmapped Sections Warning */}
      {unmappedSections.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="space-y-2">
              <p className="font-semibold">⚠️ Sections sans composant détectées</p>
              <p className="text-sm">Les sections suivantes existent dans la base de données mais n'ont pas de composant React mappé :</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {unmappedSections.map(section => (
                  <Badge key={section.section_key} variant="outline" className="text-orange-700 border-orange-300">
                    {section.section_key}
                  </Badge>
                ))}
              </div>
              <p className="text-xs mt-2">Ces sections ne s'afficheront pas sur le site web. Contactez un développeur pour créer les composants manquants.</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Sections by Page */}
      <div className="space-y-6">
        {pageNames.map((pageName) => {
          const pageSections = getSectionsByPage(pageName);
          
          return (
            <Card key={pageName}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {getPageDisplayName(pageName)}
                    </CardTitle>
                    <CardDescription>
                      Gérez la visibilité des sections de la page {getPageDisplayName(pageName).toLowerCase()}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPageForReorder(pageName);
                      setReorderDialogOpen(true);
                    }}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
                  >
                    <Shuffle className="h-4 w-4" />
                    Contrôle complet
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {pageSections.map((section, index) => (
                  <div key={section.id}>
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{section.section_name}</h4>
                          <Badge 
                            variant={section.is_visible ? "default" : "secondary"}
                            className={section.is_visible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {section.is_visible ? 'Visible' : 'Masqué'}
                          </Badge>
                          {!MAPPED_SECTIONS.includes(section.section_key) && (
                            <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-50">
                              Pas de composant
                            </Badge>
                          )}
                        </div>
                        {section.section_description && (
                          <p className="text-sm text-muted-foreground">
                            {section.section_description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Clé: {section.section_key} • Ordre: {section.display_order}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {section.is_visible ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-red-600" />
                        )}
                        <Switch
                          checked={section.is_visible}
                          onCheckedChange={() => handleToggleVisibility(section.section_key, section.is_visible)}
                        />
                      </div>
                    </div>
                    
                    {index < pageSections.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>
            Utilisez ces raccourcis pour des modifications en masse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>💡 <strong>Astuce:</strong> Utilisez les commutateurs ci-dessus pour contrôler la visibilité de chaque section individuellement.</p>
            <p className="mt-2">🔄 Les modifications sont appliquées immédiatement et visibles sur votre site web.</p>
            <p className="mt-2">⚠️ Attention: Masquer des éléments globaux comme la navigation ou le footer affectera toutes les pages.</p>
            <p className="mt-2">🎯 <strong>Nouveau:</strong> Utilisez le bouton "Contrôle complet" pour un contrôle avancé avec glisser-déposer automatique.</p>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Section Reorder Dialog */}
      <EnhancedSectionReorderDialog
        open={reorderDialogOpen}
        onOpenChange={setReorderDialogOpen}
        pageName={selectedPageForReorder}
        sections={sections}
        onVisibilityChange={updateSectionVisibility}
        onReorder={updateSectionOrder}
        onRefetch={refetch}
      />
    </div>
  );
};

export default SectionVisibilityManagement;