import { Card } from "@/components/ui/card";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StudentAnalyticsChartsProps {
  analytics: any;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#fbbf24', '#ef4444', '#8b5cf6'];

export const StudentAnalyticsCharts = ({ analytics }: StudentAnalyticsChartsProps) => {
  if (!analytics) return null;

  const monthlyRevenue = analytics.monthly_revenue || [];
  const enrollmentsByProgram = analytics.enrollments_by_program || [];
  const paymentStatusDistribution = analytics.payment_status_distribution || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Monthly Revenue Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenus Mensuels</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="Revenus (MAD)" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Enrollments by Program */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Inscriptions par Programme</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={enrollmentsByProgram}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ program, count }) => `${program}: ${count}`}
              outerRadius={80}
              fill="hsl(var(--primary))"
              dataKey="count"
            >
              {enrollmentsByProgram.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Payment Status Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Statut des Paiements</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={paymentStatusDistribution}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="status" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="hsl(var(--primary))" name="Montant (MAD)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Student Growth Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Croissance des Étudiants</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" name="Tendance" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};