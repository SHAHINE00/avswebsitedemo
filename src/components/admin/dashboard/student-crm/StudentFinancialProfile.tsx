import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, CreditCard, Download, Plus } from 'lucide-react';
import { useStudentFinancials } from '@/hooks/useStudentFinancials';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvoicePDFGenerator } from './InvoicePDFGenerator';
import { PaymentPlanManager } from './PaymentPlanManager';
import { BulkReceiptDownloader } from './BulkReceiptDownloader';
import { supabase } from '@/integrations/supabase/client';

interface StudentFinancialProfileProps {
  userId: string;
}

const StudentFinancialProfile: React.FC<StudentFinancialProfileProps> = ({ userId }) => {
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    payment_method: 'cash',
    notes: ''
  });

  const { getFinancialSummary, getPaymentHistory, getInvoices, recordPayment, generateInvoice, loading } = useStudentFinancials();

  useEffect(() => {
    fetchFinancialData();
  }, [userId]);

  const fetchFinancialData = async () => {
    const [summary, payments, inv, profile] = await Promise.all([
      getFinancialSummary(userId),
      getPaymentHistory(userId),
      getInvoices(userId),
      supabase.from('profiles').select('*').eq('id', userId).single()
    ]);

    setFinancialSummary(summary);
    setPaymentHistory(payments);
    setInvoices(inv);
    setStudentProfile(profile.data);
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

  const handleGenerateMissingInvoices = async () => {
    const completedPayments = paymentHistory.filter(p => p.payment_status === 'completed');
    const invoiceTransactionIds = invoices.map(inv => inv.transaction_id);
    const paymentsWithoutInvoice = completedPayments.filter(p => !invoiceTransactionIds.includes(p.id));

    if (paymentsWithoutInvoice.length === 0) {
      return;
    }

    for (const payment of paymentsWithoutInvoice) {
      await generateInvoice({
        user_id: userId,
        transaction_id: payment.id,
        amount: Number(payment.amount),
        tax_amount: 0
      });
    }

    fetchFinancialData();
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="invoices">Factures</TabsTrigger>
        <TabsTrigger value="plans">Plans de Paiement</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
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

      </TabsContent>

      <TabsContent value="invoices" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Factures</CardTitle>
                <CardDescription>Gérer et télécharger les factures</CardDescription>
              </div>
              {paymentHistory.some(p => p.payment_status === 'completed') && (
                <Button onClick={handleGenerateMissingInvoices} disabled={loading} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Générer les factures manquantes
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-muted-foreground">Aucune facture générée pour cet étudiant</p>
                {paymentHistory.some(p => p.payment_status === 'completed') ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Des paiements complétés existent. Cliquez pour générer les factures manquantes.
                    </p>
                    <Button onClick={handleGenerateMissingInvoices} disabled={loading}>
                      <Plus className="w-4 h-4 mr-2" />
                      Générer les factures manquantes
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Enregistrez un paiement dans l'onglet "Vue d'ensemble" pour créer une facture automatiquement.
                  </p>
                )}
              </div>
            ) : (
              <>
                <BulkReceiptDownloader 
                  receipts={invoices.map(inv => ({
                    id: inv.id,
                    invoice_number: inv.invoice_number,
                    invoice_date: inv.invoice_date,
                    amount: inv.amount,
                    tax_amount: inv.tax_amount,
                    total_amount: inv.total_amount,
                    status: inv.status,
                    student_email: studentProfile?.email || '',
                    user_id: userId
                  }))}
                />
                <div className="space-y-2 mt-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{invoice.invoice_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.total_amount} MAD • {new Date(invoice.invoice_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(invoice.status)}
                        <InvoicePDFGenerator
                          invoice={invoice}
                          student={{
                            id: userId,
                            full_name: studentProfile?.full_name || 'N/A',
                            email: studentProfile?.email || '',
                            address: studentProfile?.address
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="plans" className="space-y-4">
        <PaymentPlanManager userId={userId} onPlanCreated={fetchFinancialData} />
      </TabsContent>
    </Tabs>
  );
};


export default StudentFinancialProfile;
