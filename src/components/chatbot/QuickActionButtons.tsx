import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  TrendingUp, 
  CheckCircle, 
  Award,
  GraduationCap,
  FileText,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface QuickActionButtonsProps {
  userRole: 'admin' | 'professor' | 'student' | 'visitor';
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({ userRole }) => {
  const navigate = useNavigate();

  const quickActions: Record<string, QuickAction[]> = {
    admin: [
      { icon: <LayoutDashboard className="w-4 h-4" />, label: '📊 Vue d\'ensemble', path: '/admin?tab=dashboard' },
      { icon: <Users className="w-4 h-4" />, label: '👥 CRM Étudiants', path: '/admin?tab=students' },
      { icon: <MessageSquare className="w-4 h-4" />, label: '✉️ Communication', path: '/admin?tab=students' },
      { icon: <BookOpen className="w-4 h-4" />, label: '📚 Gérer Cours', path: '/admin?tab=courses' },
      { icon: <TrendingUp className="w-4 h-4" />, label: '📈 Analytics', path: '/admin?tab=analytics' }
    ],
    student: [
      { icon: <LayoutDashboard className="w-4 h-4" />, label: '📊 Mon Dashboard', path: '/student?tab=overview' },
      { icon: <TrendingUp className="w-4 h-4" />, label: '📈 Ma Progression', path: '/student?tab=progress' },
      { icon: <Award className="w-4 h-4" />, label: '🎓 Mes Certificats', path: '/student?tab=certificates' },
      { icon: <CheckCircle className="w-4 h-4" />, label: '✅ Mon Assiduité', path: '/student?tab=attendance' },
      { icon: <BookOpen className="w-4 h-4" />, label: '📚 Catalogue', path: '/curriculum' }
    ],
    professor: [
      { icon: <LayoutDashboard className="w-4 h-4" />, label: '📊 Dashboard', path: '/professor' },
      { icon: <BookOpen className="w-4 h-4" />, label: '📚 Mes Cours', path: '/professor' },
      { icon: <MessageSquare className="w-4 h-4" />, label: '📢 Annonces', path: '/professor' },
      { icon: <FileText className="w-4 h-4" />, label: '✏️ Notes', path: '/professor' },
      { icon: <CheckCircle className="w-4 h-4" />, label: '✅ Présences', path: '/professor' }
    ],
    visitor: [
      { icon: <BookOpen className="w-4 h-4" />, label: '📚 Catalogue', path: '/curriculum' },
      { icon: <GraduationCap className="w-4 h-4" />, label: 'ℹ️ À Propos', path: '/about' },
      { icon: <Calendar className="w-4 h-4" />, label: '📅 Prendre RDV', path: '/appointment' },
      { icon: <MessageSquare className="w-4 h-4" />, label: '📞 Contact', path: '/contact' }
    ]
  };

  const actions = quickActions[userRole] || quickActions.visitor;

  return (
    <div className="flex flex-wrap gap-2 mt-3 mb-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => navigate(action.path)}
          className="text-xs h-8 px-3 gap-1.5 hover:bg-primary/10"
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  );
};
