import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, TrendingDown, AlertCircle, Clock } from 'lucide-react';
import { useStudentCRM } from '@/hooks/useStudentCRM';

const StudentSegments: React.FC = () => {
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getStudentSegments } = useStudentCRM();

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    setLoading(true);
    const data = await getStudentSegments();
    setSegments(data);
    setLoading(false);
  };

  const getSegmentIcon = (name: string) => {
    if (name.includes('Active')) return TrendingUp;
    if (name.includes('Overdue') || name.includes('At-Risk')) return AlertCircle;
    if (name.includes('Completed')) return TrendingDown;
    if (name.includes('Recent')) return Clock;
    return Users;
  };

  const getSegmentColor = (name: string) => {
    if (name.includes('Active')) return 'text-green-600';
    if (name.includes('Overdue')) return 'text-red-600';
    if (name.includes('At-Risk')) return 'text-orange-600';
    if (name.includes('Completed')) return 'text-blue-600';
    if (name.includes('Recent')) return 'text-purple-600';
    return 'text-gray-600';
  };

  const getSegmentBadgeVariant = (name: string): any => {
    if (name.includes('Active')) return 'default';
    if (name.includes('Overdue') || name.includes('At-Risk')) return 'destructive';
    if (name.includes('Completed')) return 'secondary';
    return 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segments d'Étudiants</CardTitle>
        <CardDescription>Groupes d'étudiants organisés par statut et comportement</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Chargement...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {segments.map((segment) => {
              const Icon = getSegmentIcon(segment.segment_name);
              return (
                <Card key={segment.segment_name} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${getSegmentColor(segment.segment_name)}`} />
                      <Badge variant={getSegmentBadgeVariant(segment.segment_name)}>
                        {segment.segment_count}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm">{segment.segment_name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {segment.segment_count} étudiant{segment.segment_count > 1 ? 's' : ''}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentSegments;
