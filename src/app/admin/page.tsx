'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, Clock, CalendarDays, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, Line, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPrice, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/analytics');
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const PIE_COLORS = ['#f59e0b', '#f97316', '#ef4444', '#22c55e', '#60a5fa', '#a78bfa', '#ec4899'];

  if (loading) return <div>Loading dashboard...</div>;

  const summary = data?.summary || { totalRevenue: 0, todayOrders: 0, totalCustomers: 0, pendingOrders: 0, monthlyReservations: 0, popularDish: 'N/A' };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard title="Total Revenue" value={formatPrice(summary.totalRevenue)} icon={<DollarSign />} delay={0.1} />
        <SummaryCard title="Today's Orders" value={summary.todayOrders} icon={<ShoppingBag />} delay={0.2} />
        <SummaryCard title="Total Customers" value={summary.totalCustomers} icon={<Users />} delay={0.3} />
        <SummaryCard title="Pending Orders" value={summary.pendingOrders} icon={<Clock />} delay={0.4} />
        <SummaryCard title="Monthly Reservations" value={summary.monthlyReservations} icon={<CalendarDays />} delay={0.5} />
        <SummaryCard title="Popular Dish" value={summary.popularDish} icon={<TrendingUp />} delay={0.6} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="premium-card rounded-2xl border-border bg-card/50">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.revenueTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="premium-card rounded-2xl border-border bg-card/50">
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.ordersByStatus || []} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {(data?.ordersByStatus || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="premium-card rounded-2xl border-border bg-card/50">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 px-4 font-medium text-muted-foreground">Order #</th>
                  <th className="pb-3 px-4 font-medium text-muted-foreground">Customer</th>
                  <th className="pb-3 px-4 font-medium text-muted-foreground">Items</th>
                  <th className="pb-3 px-4 font-medium text-muted-foreground">Total</th>
                  <th className="pb-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 px-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentOrders || []).map((order: any) => (
                  <tr key={order.id} className="border-b border-border bg-card/50 hover:bg-card cursor-pointer transition-colors" onClick={() => router.push(`/admin/orders`)}>
                    <td className="py-3 px-4 font-mono text-sm">{order.id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.items}</td>
                    <td className="py-3 px-4 font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4"><Badge className={cn('capitalize', `status-${order.status.toLowerCase().replace('_', '-')}`)}>{order.status.replace('_', ' ')}</Badge></td>
                    <td className="py-3 px-4">{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ title, value, icon, delay }: { title: string, value: string | number, icon: React.ReactNode, delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <Card className="premium-card rounded-2xl border-border bg-card/50 overflow-hidden relative">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          <div className="h-12 w-12 bg-primary/20 text-primary rounded-full flex items-center justify-center">
            {icon}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
