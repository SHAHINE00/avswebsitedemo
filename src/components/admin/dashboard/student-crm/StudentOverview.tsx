import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, Calendar, Edit, User } from 'lucide-react';
import { format } from 'date-fns';

interface StudentProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at?: string;
  student_status?: string;
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
  const initials = student.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'ST';

  return (
    <div className="space-y-6">
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
    </div>
  );
};
