import { ShieldCheck, Truck, Users, Activity, AlertTriangle, TrendingUp, Zap, Globe } from 'lucide-react';
import KPICard from '../components/charts/KPICard';
import ChartCard from '../components/charts/ChartCard';
import DataTable from '../components/tables/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import { useTheme } from '../contexts/ThemeContext';
import {
  dashboardStats,
  monthlyTrends,
  verificationsByWilaya,
  deliveryStatusDistribution,
  addressVerifications,
} from '../mockData';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

function useChartColors() {
  const { isDark } = useTheme();
  return {
    grid: isDark ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.06)',
    tick: isDark ? '#64748b' : '#94a3b8',
    legend: isDark ? '#94a3b8' : '#64748b',
    tooltipBg: isDark ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.95)',
    tooltipBorder: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(0,0,0,0.08)',
    tooltipText: isDark ? '#cbd5e1' : '#334155',
  };
}

export default function Dashboard() {
  const { isDark } = useTheme();
  const cc = useChartColors();
  const recentVerifications = addressVerifications.slice(0, 5);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className="px-3 py-2 text-xs rounded-xl shadow-xl backdrop-blur-xl"
        style={{ background: cc.tooltipBg, border: `1px solid ${cc.tooltipBorder}` }}
      >
        <p className="font-medium mb-1" style={{ color: cc.tooltipText }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  };

  const recentColumns = [
    { key: 'rawAddress', label: 'Address', render: (v) => <span className="truncate max-w-[200px] block">{v}</span> },
    {
      key: 'confidenceScore',
      label: 'Score',
      render: (v) => (
        <span className={`font-semibold ${v >= 0.8 ? 'text-emerald-500' : v >= 0.5 ? 'text-amber-500' : 'text-red-500'}`}>
          {(v * 100).toFixed(0)}%
        </span>
      ),
    },
    {
      key: 'riskFlags',
      label: 'Risk',
      render: (v) =>
        v?.length > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs text-amber-500">
            <AlertTriangle size={12} />
            {v.length}
          </span>
        ) : (
          <span className="text-xs text-emerald-500">Clean</span>
        ),
    },
    { key: 'createdAt', label: 'Date', render: (v) => <span className="t-muted">{new Date(v).toLocaleDateString()}</span> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard title="Total Verifications" value={dashboardStats.totalVerifications.toLocaleString()} icon={ShieldCheck} trend={12.5} trendLabel="vs last month" color="primary" />
        <KPICard title="Avg Confidence Score" value={`${(dashboardStats.avgConfidenceScore * 100).toFixed(1)}%`} icon={TrendingUp} trend={3.2} trendLabel="vs last month" color="success" />
        <KPICard title="Risky Addresses" value={dashboardStats.riskyAddresses.toLocaleString()} icon={AlertTriangle} trend={-5.8} trendLabel="vs last month" color="warning" />
        <KPICard title="Delivery Success" value={`${(dashboardStats.deliverySuccessRate * 100).toFixed(1)}%`} icon={Truck} trend={2.1} trendLabel="vs last month" color="info" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard title="Total Deliveries" value={dashboardStats.totalDeliveries.toLocaleString()} icon={Truck} color="info" subtitle="all time" />
        <KPICard title="Active Agents" value={`${dashboardStats.activeAgents}/${dashboardStats.totalAgents}`} icon={Users} color="success" subtitle="currently active" />
        <KPICard title="API Calls" value={dashboardStats.totalApiCalls.toLocaleString()} icon={Zap} color="primary" subtitle="total requests" />
        <KPICard title="Wilayas Covered" value="15" icon={Globe} color="warning" subtitle="out of 58" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard title="Monthly Verification Trends" subtitle="Last 7 months" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="colorVerif" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDeliv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={cc.grid} />
              <XAxis dataKey="month" tick={{ fill: cc.tick, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: cc.tick, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: cc.legend }} />
              <Area type="monotone" dataKey="verifications" stroke="#6366f1" fill="url(#colorVerif)" strokeWidth={2} name="Verifications" />
              <Area type="monotone" dataKey="deliveries" stroke="#10b981" fill="url(#colorDeliv)" strokeWidth={2} name="Deliveries" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Delivery Status" subtitle="Current distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={deliveryStatusDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value">
                {deliveryStatusDistribution.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="px-3 py-2 text-xs rounded-xl shadow-xl backdrop-blur-xl"
                      style={{ background: cc.tooltipBg, border: `1px solid ${cc.tooltipBorder}` }}>
                      <p style={{ color: cc.tooltipText }} className="font-medium">{payload[0].name}: {payload[0].value.toLocaleString()}</p>
                    </div>
                  ) : null
                }
              />
              <Legend wrapperStyle={{ fontSize: 11, color: cc.legend }}
                formatter={(value) => <span style={{ color: cc.legend }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Verifications by Wilaya" subtitle="Top 10 wilayas">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={verificationsByWilaya} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={cc.grid} />
              <XAxis type="number" tick={{ fill: cc.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="wilaya" tick={{ fill: cc.legend, fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={18} name="Verifications" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recent Verifications" subtitle="Latest 5 records">
          <DataTable columns={recentColumns} data={recentVerifications} searchable={false} pageSize={5} />
        </ChartCard>
      </div>
    </div>
  );
}
