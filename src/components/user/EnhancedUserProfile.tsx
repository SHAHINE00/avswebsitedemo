import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Edit, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Settings, 
  CreditCard,
  Phone,
  Calendar,
  MapPin,
  School,
  Award,
  Download,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import PersonalInfoSection from './profile-sections/PersonalInfoSection';
import AcademicInfoSection from './profile-sections/AcademicInfoSection';
import DocumentsSection from './profile-sections/DocumentsSection';
import PreferencesSection from './profile-sections/PreferencesSection';
import FinancialSection from './profile-sections/FinancialSection';
import ProfileEditDialog from './ProfileEditDialog';

const EnhancedUserProfile = () => {
  const { user } = useAuth();
  const { achievements, statistics, preferences } = useUserProfile();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  if (!user) {
    return null;
  }

  const initials = user.email?.charAt(0).toUpperCase() || 'U';
  const completionPercentage = 75; // This would be calculated based on profile completeness

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{user.email}</h2>
                  <Badge variant="secondary">Étudiant</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Inscrit depuis: {new Date(user.created_at || '').toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <School className="h-4 w-4" />
                    {statistics?.total_enrollments || 0} formations
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-accent/20 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Profil {completionPercentage}% complété
                  </span>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setEditDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div className="text-2xl font-bold">{statistics?.total_enrollments || 0}</div>
            <div className="text-sm text-muted-foreground">Formations</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="text-2xl font-bold">{statistics?.completed_courses || 0}</div>
            <div className="text-sm text-muted-foreground">Complétées</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div className="text-2xl font-bold">{statistics?.total_achievements || 0}</div>
            <div className="text-sm text-muted-foreground">Succès</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div className="text-2xl font-bold">
              {Math.round(statistics?.avg_progress || 0)}%
            </div>
            <div className="text-sm text-muted-foreground">Progression</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Informations détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Personnel</span>
              </TabsTrigger>
              <TabsTrigger value="academic" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Académique</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Préférences</span>
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Financier</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-6">
              <PersonalInfoSection />
            </TabsContent>

            <TabsContent value="academic" className="mt-6">
              <AcademicInfoSection />
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <DocumentsSection />
            </TabsContent>

            <TabsContent value="preferences" className="mt-6">
              <PreferencesSection preferences={preferences} />
            </TabsContent>

            <TabsContent value="financial" className="mt-6">
              <FinancialSection />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ProfileEditDialog 
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
};

export default EnhancedUserProfile;