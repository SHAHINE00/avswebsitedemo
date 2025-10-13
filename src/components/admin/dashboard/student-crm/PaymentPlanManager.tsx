import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Plus } from "lucide-react";
import { useStudentFinancials } from "@/hooks/useStudentFinancials";

interface PaymentPlanManagerProps {
  userId: string;
  onPlanCreated?: () => void;
}

export const PaymentPlanManager = ({ userId, onPlanCreated }: PaymentPlanManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [totalAmount, setTotalAmount] = useState("");
  const [installments, setInstallments] = useState("3");
  const { loading } = useStudentFinancials();

  const handleCreatePlan = async () => {
    const amount = parseFloat(totalAmount);
    const numInstallments = parseInt(installments);
    
    if (amount <= 0 || numInstallments <= 0) return;
    
    const installmentAmount = amount / numInstallments;
    const installmentsList = Array.from({ length: numInstallments }, (_, i) => ({
      installment_number: i + 1,
      amount: installmentAmount,
      due_date: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending'
    }));

    console.log('Creating payment plan:', {
      userId,
      totalAmount: amount,
      installments: installmentsList
    });

    setShowForm(false);
    setTotalAmount("");
    setInstallments("3");
    onPlanCreated?.();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Plans de Paiement</CardTitle>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Plan
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showForm ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="total">Montant Total (MAD)</Label>
              <Input
                id="total"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="installments">Nombre d'Échéances</Label>
              <Input
                id="installments"
                type="number"
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                min="2"
                max="12"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreatePlan} disabled={loading}>
                Créer le Plan
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Plan Standard</p>
                <p className="text-sm text-muted-foreground">3 mensualités</p>
              </div>
              <Badge variant="outline">
                <Calendar className="w-3 h-3 mr-1" />
                Actif
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Créez un plan de paiement personnalisé pour cet étudiant
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
