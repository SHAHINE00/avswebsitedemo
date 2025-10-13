import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAtRiskStudents, AtRiskStudent } from "@/hooks/useAtRiskStudents";
import { AlertTriangle, Clock, DollarSign, Mail } from "lucide-react";

export const AtRiskStudentsDashboard = () => {
  const { getAtRiskStudents, loading } = useAtRiskStudents();
  const [students, setStudents] = useState<AtRiskStudent[]>([]);

  useEffect(() => {
    fetchAtRiskStudents();
  }, []);

  const fetchAtRiskStudents = async () => {
    const data = await getAtRiskStudents();
    setStudents(data);
  };

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'overdue_payment':
        return <DollarSign className="w-4 h-4" />;
      case 'inactive':
        return <Clock className="w-4 h-4" />;
      case 'stuck_on_lesson':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRiskLabel = (type: string) => {
    switch (type) {
      case 'overdue_payment':
        return 'Paiement en retard';
      case 'inactive':
        return 'Inactif';
      case 'stuck_on_lesson':
        return 'Bloqué sur leçon';
      default:
        return 'À risque';
    }
  };

  const getRiskVariant = (type: string): "destructive" | "secondary" | "outline" => {
    switch (type) {
      case 'overdue_payment':
        return 'destructive';
      case 'inactive':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Étudiants à Risque
        </CardTitle>
        <CardDescription>
          Étudiants nécessitant une attention particulière
        </CardDescription>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun étudiant à risque</p>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <div key={`${student.user_id}-${student.risk_type}`} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium">{student.full_name}</p>
                    <Badge variant={getRiskVariant(student.risk_type)} className="flex items-center gap-1">
                      {getRiskIcon(student.risk_type)}
                      {getRiskLabel(student.risk_type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{student.email}</p>
                  <div className="text-xs text-muted-foreground">
                    {student.risk_type === 'overdue_payment' && (
                      <span>Retard: {student.risk_details?.days_overdue} jours - {student.risk_details?.amount} MAD</span>
                    )}
                    {student.risk_type === 'inactive' && (
                      <span>Inactif depuis: {student.risk_details?.days_inactive} jours</span>
                    )}
                    {student.risk_type === 'stuck_on_lesson' && (
                      <span>Bloqué depuis: {student.risk_details?.days_stuck} jours</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Envoyer Rappel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
