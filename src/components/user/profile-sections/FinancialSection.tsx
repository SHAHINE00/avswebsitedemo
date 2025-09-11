import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Receipt, 
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  course_title: string;
  payment_date: string;
  payment_method: string;
  invoice_url?: string;
}

interface Subscription {
  id: string;
  plan_name: string;
  status: 'active' | 'cancelled' | 'expired';
  current_period_start: string;
  current_period_end: string;
  amount: number;
  currency: string;
  auto_renewal: boolean;
}

const FinancialSection = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [outstandingBalance, setOutstandingBalance] = useState(0);

  useEffect(() => {
    fetchFinancialData();
  }, [user]);

  const fetchFinancialData = async () => {
    // Mock financial data - in real app, this would come from your payments system
    const mockPayments: Payment[] = [
      {
        id: '1',
        amount: 599,
        currency: 'EUR',
        status: 'paid',
        course_title: 'Formation IA & Machine Learning',
        payment_date: '2024-01-15',
        payment_method: 'Carte bancaire',
        invoice_url: '#'
      },
      {
        id: '2',
        amount: 449,
        currency: 'EUR',
        status: 'paid',
        course_title: 'Formation Cybersécurité',
        payment_date: '2023-12-10',
        payment_method: 'PayPal',
        invoice_url: '#'
      },
      {
        id: '3',
        amount: 299,
        currency: 'EUR',
        status: 'pending',
        course_title: 'Formation Développement Web',
        payment_date: '2024-01-20',
        payment_method: 'Virement bancaire'
      }
    ];

    const mockSubscription: Subscription = {
      id: 'sub_1',
      plan_name: 'Premium Monthly',
      status: 'active',
      current_period_start: '2024-01-01',
      current_period_end: '2024-02-01',
      amount: 29,
      currency: 'EUR',
      auto_renewal: true
    };

    setPayments(mockPayments);
    setSubscription(mockSubscription);
    setTotalSpent(mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0));
    setOutstandingBalance(mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0));
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'refunded':
        return <Receipt className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Payé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Échec</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800">Remboursé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total dépensé</div>
                <div className="font-semibold">{formatCurrency(totalSpent, 'EUR')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Solde en attente</div>
                <div className="font-semibold">{formatCurrency(outstandingBalance, 'EUR')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Receipt className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Transactions</div>
                <div className="font-semibold">{payments.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Subscription */}
      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Abonnement actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-lg">{subscription.plan_name}</h4>
                  <p className="text-muted-foreground">
                    {formatCurrency(subscription.amount, subscription.currency)}/mois
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Période: {new Date(subscription.current_period_start).toLocaleDateString()} - {new Date(subscription.current_period_end).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {subscription.status === 'active' ? (
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    ) : (
                      <Badge variant="secondary">{subscription.status}</Badge>
                    )}
                    
                    {subscription.auto_renewal && (
                      <Badge variant="outline">Renouvellement automatique</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Modifier l'abonnement
                </Button>
                <Button variant="outline" size="sm">
                  Annuler
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Historique des paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun paiement enregistré</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(payment.status)}
                      <div className="flex-1">
                        <h4 className="font-semibold">{payment.course_title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{formatCurrency(payment.amount, payment.currency)}</span>
                          <span>•</span>
                          <span>{payment.payment_method}</span>
                          <span>•</span>
                          <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(payment.status)}
                      {payment.invoice_url && payment.status === 'paid' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Facture
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Moyens de paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">•••• •••• •••• 4242</div>
                    <div className="text-sm text-muted-foreground">Expire 12/26</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Principal</Badge>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              + Ajouter un moyen de paiement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de facturation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-1">💳 Paiements automatiques</h5>
            <p className="text-sm text-blue-800">
              Vos paiements sont traités automatiquement le jour du renouvellement.
            </p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg">
            <h5 className="font-medium text-green-900 mb-1">📧 Reçus par email</h5>
            <p className="text-sm text-green-800">
              Vous recevrez automatiquement vos reçus par email après chaque paiement.
            </p>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Télécharger tous les reçus
              </Button>
              <Button variant="outline" size="sm">
                Paramètres de facturation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSection;