import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRevenueAnalytics } from "@/hooks/useRevenueAnalytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp } from "lucide-react";

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export const RevenueAnalytics = () => {
  const { getRevenueAnalytics, loading } = useRevenueAnalytics();
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const data = await getRevenueAnalytics();
    if (data) {
      setAnalytics(data);
    }
  };

  if (loading) {
    return <div>Chargement des analytics...</div>;
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total_revenue?.toFixed(2)} MAD</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paiement Moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.average_payment?.toFixed(2)} MAD</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.revenue_by_month?.reduce((sum: number, m: any) => sum + m.transaction_count, 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Month */}
      <Card>
        <CardHeader>
          <CardTitle>Revenus par Mois</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenue_by_month || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short' })}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => `${value.toFixed(2)} MAD`}
                labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR')}
              />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Course */}
      <Card>
        <CardHeader>
          <CardTitle>Revenus par Formation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.revenue_by_course || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course_name" />
              <YAxis />
              <Tooltip formatter={(value: any) => `${value.toFixed(2)} MAD`} />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Revenus par Méthode de Paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.revenue_by_method || []}
                dataKey="revenue"
                nameKey="payment_method"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.payment_method}: ${entry.revenue.toFixed(2)} MAD`}
              >
                {(analytics.revenue_by_method || []).map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `${value.toFixed(2)} MAD`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
