import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useChatbotLanguage } from '@/hooks/useChatbotLanguage';
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
  const { t } = useChatbotLanguage();

  const quickActions: Record<string, QuickAction[]> = {
    admin: [
      { icon: <LayoutDashboard className="w-4 h-4" />, label: t.quickActionButtons.overview, path: '/admin?tab=dashboard' },
      { icon: <Users className="w-4 h-4" />, label: t.quickActionButtons.crmStudents, path: '/admin?tab=students' },
      { icon: <MessageSquare className="w-4 h-4" />, label: t.quickActionButtons.communication, path: '/admin?tab=students' },
      { icon: <BookOpen className="w-4 h-4" />, label: t.quickActionButtons.manageCourses, path: '/admin?tab=courses' },
      { icon: <TrendingUp className="w-4 h-4" />, label: t.quickActionButtons.analytics, path: '/admin?tab=analytics' }
    ],
    student: [
      { icon: <LayoutDashboard className="w-4 h-4" />, label: t.quickActionButtons.dashboard, path: '/student?tab=overview' },
      { icon: <TrendingUp className="w-4 h-4" />, label: t.quickActionButtons.myProgress, path: '/student?tab=progress' },
      { icon: <Award className="w-4 h-4" />, label: t.quickActionButtons.myCertificates, path: '/student?tab=certificates' },
      { icon: <CheckCircle className="w-4 h-4" />, label: t.quickActionButtons.myAttendance, path: '/student?tab=attendance' },
      { icon: <BookOpen className="w-4 h-4" />, label: t.quickActionButtons.catalogue, path: '/curriculum' }
    ],
    professor: [
      { icon: <LayoutDashboard className="w-4 h-4" />, label: t.quickActionButtons.profDashboard, path: '/professor' },
      { icon: <BookOpen className="w-4 h-4" />, label: t.quickActionButtons.myCourses, path: '/professor' },
      { icon: <MessageSquare className="w-4 h-4" />, label: t.quickActionButtons.announcements, path: '/professor' },
      { icon: <FileText className="w-4 h-4" />, label: t.quickActionButtons.grades, path: '/professor' },
      { icon: <CheckCircle className="w-4 h-4" />, label: t.quickActionButtons.attendance, path: '/professor' }
    ],
    visitor: [
      { icon: <BookOpen className="w-4 h-4" />, label: t.quickActionButtons.catalogue, path: '/curriculum' },
      { icon: <GraduationCap className="w-4 h-4" />, label: t.quickActionButtons.about, path: '/about' },
      { icon: <Calendar className="w-4 h-4" />, label: t.quickActionButtons.appointment, path: '/appointment' },
      { icon: <MessageSquare className="w-4 h-4" />, label: t.quickActionButtons.contact, path: '/contact' }
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
          className="text-xs h-8 px-3 hover:bg-primary/10 cursor-pointer"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};
