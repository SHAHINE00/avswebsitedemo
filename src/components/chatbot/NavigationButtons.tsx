import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface NavigationAction {
  label: string;
  path: string;
}

interface NavigationButtonsProps {
  actions: NavigationAction[];
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({ actions }) => {
  const navigate = useNavigate();

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => navigate(action.path)}
          className="text-xs h-8 px-3 gap-1.5"
        >
          {action.label}
          <ArrowRight className="w-3 h-3" />
        </Button>
      ))}
    </div>
  );
};

/**
 * Parse AI assistant response to detect navigation suggestions
 */
export const parseNavigationActions = (content: string): NavigationAction[] => {
  const actions: NavigationAction[] = [];
  
  // Pattern 1: Detect "Admin → [Tab]" navigation paths
  const adminPatterns = [
    { match: 'Admin → Étudiants', label: '👥 CRM Étudiants', path: '/admin?tab=students' },
    { match: 'Admin → Professeurs', label: '👨‍🏫 Gérer Professeurs', path: '/admin?tab=professors' },
    { match: 'Admin → Cours', label: '📚 Gérer Cours', path: '/admin?tab=courses' },
    { match: 'Admin → Classes', label: '🏫 Gérer Classes', path: '/admin?tab=classes' },
    { match: 'Admin → Utilisateurs', label: '👤 Utilisateurs', path: '/admin?tab=users' },
    { match: 'Admin → Documents', label: '📄 Documents', path: '/admin?tab=documents' },
    { match: 'Admin → Analytics', label: '📈 Analytics', path: '/admin?tab=analytics' },
    { match: 'Admin → Sécurité', label: '🔒 Sécurité', path: '/admin?tab=security' },
    { match: 'Admin → Visibilité', label: '👁️ Visibilité', path: '/admin?tab=visibility' },
    { match: 'Admin → Abonnements', label: '🗂️ Abonnements', path: '/admin?tab=subscribers' },
    { match: 'Admin → Système', label: '⚙️ Système', path: '/admin?tab=system' },
    { match: 'Vue d\'ensemble', label: '📊 Vue d\'ensemble', path: '/admin?tab=dashboard' }
  ];

  adminPatterns.forEach(pattern => {
    if (content.includes(pattern.match) && !actions.some(a => a.path === pattern.path)) {
      actions.push({ label: pattern.label, path: pattern.path });
    }
  });

  // Pattern 2: Detect "Dashboard → [Tab]" for student
  const studentTabPatterns = [
    { match: 'Onglet "Progression"', label: '📊 Ma Progression', path: '/student?tab=progress' },
    { match: 'Onglet "Mes Cours"', label: '📚 Mes Cours', path: '/student?tab=courses' },
    { match: 'Onglet "Calendrier"', label: '📅 Mon Calendrier', path: '/student?tab=calendar' },
    { match: 'Onglet "Assiduité"', label: '✅ Mon Assiduité', path: '/student?tab=attendance' },
    { match: 'Onglet "Certificats"', label: '🎓 Mes Certificats', path: '/student?tab=certificates' },
    { match: 'Onglet "Récompenses"', label: '🏆 Mes Récompenses', path: '/student?tab=rewards' },
    { match: 'Onglet "Notifications"', label: '🔔 Notifications', path: '/student?tab=notifications' },
    { match: 'Onglet "Profil"', label: '👤 Mon Profil', path: '/student?tab=profile' },
    { match: 'Onglet "Confidentialité"', label: '🔒 Confidentialité', path: '/student?tab=privacy' }
  ];

  studentTabPatterns.forEach(pattern => {
    if (content.includes(pattern.match) && !actions.some(a => a.path === pattern.path)) {
      actions.push({ label: pattern.label, path: pattern.path });
    }
  });

  // Pattern 3: Detect professor course-specific paths
  const professorPatterns = [
    { match: 'Onglet Présence', label: '✅ Marquer Présences', path: '/professor' },
    { match: 'Onglet Notes', label: '📝 Gérer Notes', path: '/professor' },
    { match: 'Onglet Communication', label: '📢 Annonces', path: '/professor' },
    { match: 'Onglet Matériels', label: '📎 Supports de Cours', path: '/professor' }
  ];

  professorPatterns.forEach(pattern => {
    if (content.includes(pattern.match) && !actions.some(a => a.path === pattern.path)) {
      actions.push({ label: pattern.label, path: pattern.path });
    }
  });

  // Pattern 4: Detect explicit URLs like "/curriculum"
  const urlMatches = content.match(/(?:Allez sur|aller à|accéder à|visiter)?\s*(\/[\w-/?=]+)/gi);
  if (urlMatches) {
    urlMatches.forEach(match => {
      const path = match.match(/\/([\w-/?=]+)/)?.[0];
      if (path && !actions.some(a => a.path === path)) {
        const label = getPathLabel(path);
        if (label) {
          actions.push({ label, path });
        }
      }
    });
  }
  
  // Pattern 5: Detect dashboard mentions without explicit tabs
  if ((content.includes('/student') || content.includes('Dashboard étudiant')) && 
      !actions.some(a => a.path.includes('/student'))) {
    actions.push({ label: '🏠 Mon Dashboard', path: '/student' });
  }
  
  if ((content.includes('/professor') || content.includes('Dashboard professeur')) && 
      !actions.some(a => a.path.includes('/professor'))) {
    actions.push({ label: '📚 Dashboard Professeur', path: '/professor' });
  }
  
  if ((content.includes('/curriculum') || content.includes('Catalogue')) && 
      !actions.some(a => a.path.includes('/curriculum'))) {
    actions.push({ label: '📚 Voir le Catalogue', path: '/curriculum' });
  }

  if ((content.includes('/admin') || content.includes('Dashboard admin')) && 
      !actions.some(a => a.path.includes('/admin'))) {
    actions.push({ label: '📊 Dashboard Admin', path: '/admin' });
  }
  
  // Limit to 3 most relevant actions
  return actions.slice(0, 3);
};

/**
 * Get user-friendly label for a path
 */
const getPathLabel = (path: string): string | null => {
  const pathLabels: Record<string, string> = {
    '/admin': '📊 Dashboard Admin',
    '/admin?tab=students': '👥 CRM Étudiants',
    '/admin?tab=professors': '👨‍🏫 Professeurs',
    '/admin?tab=courses': '📚 Cours',
    '/admin?tab=classes': '🏫 Classes',
    '/admin?tab=users': '👤 Utilisateurs',
    '/admin?tab=documents': '📄 Documents',
    '/admin?tab=analytics': '📈 Analytics',
    '/admin?tab=security': '🔒 Sécurité',
    '/professor': '📚 Dashboard Professeur',
    '/student': '🏠 Mon Dashboard',
    '/student?tab=progress': '📊 Ma Progression',
    '/student?tab=courses': '📚 Mes Cours',
    '/student?tab=calendar': '📅 Mon Calendrier',
    '/student?tab=attendance': '✅ Mon Assiduité',
    '/student?tab=certificates': '🎓 Mes Certificats',
    '/student?tab=rewards': '🏆 Mes Récompenses',
    '/dashboard': '🏠 Mon Dashboard',
    '/curriculum': '📚 Catalogue des Cours',
    '/about': 'ℹ️ À Propos',
    '/contact': '📞 Contact',
    '/appointment': '📅 Prendre RDV',
    '/testimonials': '💬 Témoignages',
    '/blog': '📝 Blog',
    '/auth': '🔐 Se Connecter',
    '/features': '🎯 Fonctionnalités',
    '/instructors': '👨‍🏫 Instructeurs',
    '/faq': '❓ FAQ',
    '/careers': '💼 Carrières'
  };
  
  return pathLabels[path] || null;
};
