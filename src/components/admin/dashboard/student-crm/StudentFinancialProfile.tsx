import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CreditCard, Download, Plus } from 'lucide-react';
import { useStudentFinancials } from '@/hooks/useStudentFinancials';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudentFinancialProfileProps {
  userId: string;
}

const StudentFinancialProfile: React.FC<StudentFinancialProfileProps> = ({ userId }) => {
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    payment_method: 'cash',
    notes: ''
  });

  const { getFinancialSummary, getPaymentHistory, getInvoices, recordPayment, loading } = useStudentFinancials();

  useEffect(() => {
    fetchFinancialData();
  }, [userId]);

  const fetchFinancialData = async () => {
    const [summary, payments, inv] = await Promise.all([
      getFinancialSummary(userId),
      getPaymentHistory(userId),
      getInvoices(userId)
    ]);

    setFinancialSummary(summary);
    setPaymentHistory(payments);
    setInvoices(inv);
  };

  const handleRecordPayment = async () => {
    if (!paymentData.amount) return;

    const success = await recordPayment({
      user_id: userId,
      amount: parseFloat(paymentData.amount),
      payment_method: paymentData.payment_method,
      notes: paymentData.notes
    });

    if (success) {
      setShowPaymentDialog(false);
      setPaymentData({ amount: '', payment_method: 'cash', notes: '' });
      fetchFinancialData();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Financial Summary */}
      {financialSummary && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Payé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {financialSummary.total_paid || 0} MAD
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {financialSummary.total_pending || 0} MAD
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financialSummary.payment_count || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des Paiements</CardTitle>
              <CardDescription>Tous les paiements de l'étudiant</CardDescription>
            </div>
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Enregistrer Paiement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enregistrer un Paiement</DialogTitle>
                  <DialogDescription>Ajoutez un nouveau paiement manuel</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Montant (MAD)</Label>
                    <Input
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Méthode de Paiement</Label>
                    <Select value={paymentData.payment_method} onValueChange={(v) => setPaymentData({ ...paymentData, payment_method: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Espèces</SelectItem>
                        <SelectItem value="bank_transfer">Virement Bancaire</SelectItem>
                        <SelectItem value="card">Carte</SelectItem>
                        <SelectItem value="installment">Échelonnement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Notes (optionnel)</Label>
                    <Input
                      value={paymentData.notes}
                      onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                      placeholder="Notes..."
                    />
                  </div>
                  <Button onClick={handleRecordPayment} disabled={loading} className="w-full">
                    Enregistrer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {paymentHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Aucun paiement</p>
            ) : (
              paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{payment.amount} {payment.currency}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.payment_method} • {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  {getStatusBadge(payment.payment_status)}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Factures</CardTitle>
          <CardDescription>Historique des factures générées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {invoices.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Aucune facture</p>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{invoice.invoice_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.total_amount} MAD • {new Date(invoice.invoice_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(invoice.status)}
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentFinancialProfile;
