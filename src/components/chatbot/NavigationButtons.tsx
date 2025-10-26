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
  
  // Pattern 1: Detect "Admin → Étudiants" or similar navigation paths
  if (content.includes('Admin → Étudiants')) {
    actions.push({ label: 'Ouvrir CRM Étudiants', path: '/admin' });
  }
  
  if (content.includes('Admin → Professeurs')) {
    actions.push({ label: 'Gérer Professeurs', path: '/admin' });
  }
  
  if (content.includes('Admin → Cours')) {
    actions.push({ label: 'Gérer Cours', path: '/admin' });
  }
  
  // Pattern 2: Detect explicit URLs like "/curriculum"
  const urlMatches = content.match(/(?:Allez sur|aller à|accéder à|visiter)?\s*(\/[\w-/]+)/gi);
  if (urlMatches) {
    urlMatches.forEach(match => {
      const path = match.match(/\/([\w-/]+)/)?.[0];
      if (path && !actions.some(a => a.path === path)) {
        const label = getPathLabel(path);
        if (label) {
          actions.push({ label, path });
        }
      }
    });
  }
  
  // Pattern 3: Detect "/student", "/professor", "/admin" dashboard mentions
  if (content.includes('/student') || content.includes('Dashboard étudiant')) {
    if (!actions.some(a => a.path === '/student')) {
      actions.push({ label: 'Mon Dashboard', path: '/student' });
    }
  }
  
  if (content.includes('/professor') || content.includes('Dashboard professeur')) {
    if (!actions.some(a => a.path === '/professor')) {
      actions.push({ label: 'Dashboard Professeur', path: '/professor' });
    }
  }
  
  if (content.includes('/curriculum') || content.includes('Catalogue')) {
    if (!actions.some(a => a.path === '/curriculum')) {
      actions.push({ label: 'Voir le Catalogue', path: '/curriculum' });
    }
  }
  
  // Limit to 3 most relevant actions
  return actions.slice(0, 3);
};

/**
 * Get user-friendly label for a path
 */
const getPathLabel = (path: string): string | null => {
  const pathLabels: Record<string, string> = {
    '/admin': 'Dashboard Admin',
    '/professor': 'Dashboard Professeur',
    '/student': 'Mon Dashboard',
    '/dashboard': 'Mon Dashboard',
    '/curriculum': 'Catalogue des Cours',
    '/about': 'À Propos',
    '/contact': 'Contact',
    '/appointment': 'Prendre RDV',
    '/testimonials': 'Témoignages',
    '/blog': 'Blog',
    '/auth': 'Se Connecter'
  };
  
  return pathLabels[path] || null;
};
