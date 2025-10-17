import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, Calendar, Edit, User, MapPin, GraduationCap, Target, BookOpen, Users } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface StudentProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at?: string;
  student_status?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  academic_level?: string;
  previous_education?: string;
  career_goals?: string;
  formation_type?: string;
  formation_domaine?: string;
  formation_programme?: string;
  formation_tag?: string;
}

interface StudentOverviewProps {
  student: StudentProfile;
  onEditStudent?: (student: StudentProfile) => void;
}

const getStatusBadgeVariant = (status?: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'on_hold':
      return 'secondary';
    case 'suspended':
      return 'destructive';
    case 'graduated':
      return 'outline';
    case 'inactive':
      return 'secondary';
    default:
      return 'default';
  }
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'on_hold':
      return 'En pause';
    case 'suspended':
      return 'Suspendu';
    case 'graduated':
      return 'Diplômé';
    case 'inactive':
      return 'Inactif';
    default:
      return 'Actif';
  }
};

export const StudentOverview: React.FC<StudentOverviewProps> = ({ student, onEditStudent }) => {
  const [parentInfo, setParentInfo] = useState<any>(null);
  
  const initials = student.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'ST';

  useEffect(() => {
    const fetchParentInfo = async () => {
      const { data } = await supabase
        .from('student_parents')
        .select('*')
        .eq('student_id', student.id)
        .maybeSingle();
      
      if (data) {
        setParentInfo(data);
      }
    };

    fetchParentInfo();
  }, [student.id]);

  return (
    <div className="space-y-6">
      {/* Basic Contact Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{student.full_name}</CardTitle>
                <CardDescription className="mt-1">
                  <Badge variant={getStatusBadgeVariant(student.student_status)}>
                    {getStatusLabel(student.student_status)}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            {onEditStudent && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEditStudent(student)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{student.email}</p>
              </div>
            </div>

            {student.phone && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                  <p className="text-sm">{student.phone}</p>
                </div>
              </div>
            )}

            {student.created_at && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Inscription</p>
                  <p className="text-sm">
                    {format(new Date(student.created_at), 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Identifiant</p>
                <p className="text-sm font-mono text-xs">{student.id.substring(0, 8)}...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      {(student.date_of_birth || student.address || student.city) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {student.date_of_birth && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date de Naissance</p>
                  <p className="text-sm mt-1">{format(new Date(student.date_of_birth), 'dd/MM/yyyy')}</p>
                </div>
              )}
              {student.address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                  <p className="text-sm mt-1">{student.address}</p>
                </div>
              )}
              {student.city && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ville</p>
                  <p className="text-sm mt-1">{student.city}</p>
                </div>
              )}
              {student.postal_code && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Code Postal</p>
                  <p className="text-sm mt-1">{student.postal_code}</p>
                </div>
              )}
              {student.country && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pays</p>
                  <p className="text-sm mt-1">{student.country}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Academic Background */}
      {(student.academic_level || student.previous_education || student.career_goals) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Parcours Académique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {student.academic_level && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Niveau Académique</p>
                  <p className="text-sm mt-1">{student.academic_level}</p>
                </div>
              )}
              {student.previous_education && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Formation Antérieure</p>
                  <p className="text-sm mt-1">{student.previous_education}</p>
                </div>
              )}
              {student.career_goals && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Objectifs de Carrière</p>
                  <p className="text-sm mt-1">{student.career_goals}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formation Details */}
      {(student.formation_type || student.formation_domaine || student.formation_programme || student.formation_tag) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Programme de Formation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {student.formation_type && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type de Formation</p>
                  <p className="text-sm mt-1">{student.formation_type}</p>
                </div>
              )}
              {student.formation_domaine && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Domaine</p>
                  <p className="text-sm mt-1">{student.formation_domaine}</p>
                </div>
              )}
              {student.formation_programme && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Programme</p>
                  <p className="text-sm mt-1">{student.formation_programme}</p>
                </div>
              )}
              {student.formation_tag && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tag</p>
                  <Badge variant="secondary">{student.formation_tag}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parent/Guardian Information */}
      {parentInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Informations du parent/tuteur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {parentInfo.parent_name && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nom du parent</p>
                  <p className="text-sm mt-1">{parentInfo.parent_name}</p>
                </div>
              )}
              {parentInfo.parent_email && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email du parent</p>
                  <p className="text-sm mt-1">{parentInfo.parent_email}</p>
                </div>
              )}
              {parentInfo.parent_phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Téléphone du parent</p>
                  <p className="text-sm mt-1">{parentInfo.parent_phone}</p>
                </div>
              )}
              {parentInfo.relationship && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Lien de parenté</p>
                  <p className="text-sm mt-1">{parentInfo.relationship}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
