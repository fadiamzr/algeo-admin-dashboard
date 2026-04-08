import { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Users, Activity, AlertTriangle, TrendingUp, Zap, Globe } from 'lucide-react';
import KPICard from '../components/charts/KPICard';
import ChartCard from '../components/charts/ChartCard';
import DataTable from '../components/tables/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import { useTheme } from '../contexts/ThemeContext';
import {
  apiGetStatistics,
  apiGetMonthlyTrends,
  apiGetVerificationsByWilaya,
  apiGetDeliveryStatusDistribution,
  apiGetVerifications,
} from '../api';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

function useChartColors() {
  const { isDark } = useTheme();
  return {
    grid: isDark ? 'rgba(90,119,153,0.1)' : 'rgba(27,43,74,0.06)',
    tick: isDark ? '#3B5576' : '#8FA5BF',
    legend: isDark ? '#5A7799' : '#5A7799',
    tooltipBg: isDark ? 'rgba(27,43,74,0.9)' : 'rgba(255,255,255,0.95)',
    tooltipBorder: isDark ? 'rgba(90,119,153,0.15)' : 'rgba(27,43,74,0.08)',
    tooltipText: isDark ? '#C0D0E0' : '#1B2B4A',
  };
}

export default function Dashboard() {
  const { isDark } = useTheme();
  const cc = useChartColors();

  const [stats, setStats] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [wilayaData, setWilayaData] = useState([]);
  const [statusDist, setStatusDist] = useState([]);
  const [recentVerifications, setRecentVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGetStatistics().catch(() => null),
      apiGetMonthlyTrends().catch(() => []),
      apiGetVerificationsByWilaya().catch(() => []),
      apiGetDeliveryStatusDistribution().catch(() => []),
      apiGetVerifications(1, 5).catch(() => ({ items: [] })),
    ])
      .then(([statsData, trendsData, wilayaRes, statusRes, verifRes]) => {
        setStats(statsData);
        setMonthlyTrends(trendsData || []);
        setWilayaData(wilayaRes || []);
        setStatusDist(statusRes || []);
        setRecentVerifications(verifRes?.items || []);
      })
      .finally(() => setLoading(false));
  }, []);

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
            {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          </p>
        ))}
      </div>
    );
  };

  const recentColumns = [
    { key: 'raw_address', label: 'Address', render: (v) => <span className="truncate max-w-[200px] block">{v || '—'}</span> },
    {
      key: 'confidence_score',
      label: 'Score',
      render: (v) => (
        <span className={`font-semibold ${v >= 0.8 ? 'text-emerald-500' : v >= 0.5 ? 'text-amber-500' : 'text-red-500'}`}>
          {v != null ? `${(v * 100).toFixed(0)}%` : '—'}
        </span>
      ),
    },
    {
      key: 'match_details',
      label: 'Match',
      render: (v) => <span className="text-xs t-muted">{v || '—'}</span>,
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (v) => <span className="t-muted">{v ? new Date(v).toLocaleDateString() : '—'}</span>,
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
    </div>
  );

  const s = stats || {};
  const totalVerif = s.totalVerifications || 0;
  const avgScore = s.avgConfidenceScore || 0;
  const riskyCount = s.riskyAddresses || 0;
  const successRate = s.deliverySuccessRate || 0;
  const totalDel = s.totalDeliveries || 0;
  const totalAgents = s.totalAgents || 0;
  const activeAgents = s.activeAgents || 0;
  const totalApi = s.totalApiCalls || 0;
  const wilayasCovered = wilayaData.length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard title="Total Verifications" value={totalVerif.toLocaleString()} icon={ShieldCheck} color="primary" />
        <KPICard title="Avg Confidence Score" value={`${(avgScore * 100).toFixed(1)}%`} icon={TrendingUp} color="success" />
        <KPICard title="Risky Addresses" value={riskyCount.toLocaleString()} icon={AlertTriangle} color="warning" />
        <KPICard title="Delivery Success" value={`${(successRate * 100).toFixed(1)}%`} icon={Truck} color="info" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard title="Total Deliveries" value={totalDel.toLocaleString()} icon={Truck} color="info" subtitle="all time" />
        <KPICard title="Active Agents" value={`${activeAgents}/${totalAgents}`} icon={Users} color="success" subtitle="currently active" />
        <KPICard title="API Calls" value={totalApi.toLocaleString()} icon={Zap} color="primary" subtitle="total requests" />
        <KPICard title="Wilayas Covered" value={`${wilayasCovered}`} icon={Globe} color="warning" subtitle="out of 58" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard title="Monthly Verification Trends" subtitle="Verifications & Deliveries" className="lg:col-span-2">
          {monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorVerif" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CB79E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4CB79E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDeliv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={cc.grid} />
                <XAxis dataKey="month" tick={{ fill: cc.tick, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: cc.tick, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: cc.legend }} />
                <Area type="monotone" dataKey="verifications" stroke="#4CB79E" fill="url(#colorVerif)" strokeWidth={2} name="Verifications" />
                <Area type="monotone" dataKey="deliveries" stroke="#3B82F6" fill="url(#colorDeliv)" strokeWidth={2} name="Deliveries" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] t-muted text-sm">No trend data yet</div>
          )}
        </ChartCard>

        <ChartCard title="Delivery Status" subtitle="Current distribution">
          {statusDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusDist} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value">
                  {statusDist.map((entry, idx) => (
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
          ) : (
            <div className="flex items-center justify-center h-[280px] t-muted text-sm">No delivery data</div>
          )}
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Verifications by Wilaya" subtitle={`${wilayaData.length} wilayas`}>
          {wilayaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={wilayaData.slice(0, 10)} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={cc.grid} />
                <XAxis type="number" tick={{ fill: cc.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="wilaya" tick={{ fill: cc.legend, fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#4CB79E" radius={[0, 6, 6, 0]} barSize={18} name="Verifications" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] t-muted text-sm">No wilaya data yet</div>
          )}
        </ChartCard>

        <ChartCard title="Recent Verifications" subtitle={`Latest ${recentVerifications.length} records`}>
          {recentVerifications.length > 0 ? (
            <DataTable columns={recentColumns} data={recentVerifications} searchable={false} pageSize={5} />
          ) : (
            <div className="flex items-center justify-center h-[300px] t-muted text-sm">No verifications yet</div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}