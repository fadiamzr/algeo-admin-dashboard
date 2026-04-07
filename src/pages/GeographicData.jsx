import { useState, useEffect } from 'react';
import DataTable from '../components/tables/DataTable';
import ChartCard from '../components/charts/ChartCard';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin } from 'lucide-react';
import { apiGetVerificationsByWilaya } from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function GeographicData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();

  const cc = {
    grid: isDark ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.06)',
    tick: isDark ? '#64748b' : '#6b7280',
    legend: isDark ? '#94a3b8' : '#4b5563',
    tooltipBg: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.97)',
    tooltipBorder: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(0,0,0,0.1)',
    tooltipText: isDark ? '#cbd5e1' : '#1e293b',
  };

  useEffect(() => {
    apiGetVerificationsByWilaya()
      .then((res) => setData(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="px-3 py-2 text-xs rounded-xl shadow-xl"
        style={{ background: cc.tooltipBg, border: `1px solid ${cc.tooltipBorder}` }}>
        <p className="font-medium mb-1" style={{ color: cc.tooltipText }}>{label}</p>
        <p style={{ color: '#6366f1' }} className="font-medium">
          Verifications: {payload[0].value}
        </p>
      </div>
    );
  };

  const columns = [
    {
      key: 'wilaya',
      label: 'Wilaya',
      render: (v) => (
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-primary-500" />
          <span className="font-medium t-primary">{v}</span>
        </div>
      ),
    },
    {
      key: 'count',
      label: 'Verifications',
      render: (v, row) => {
        const max = data[0]?.count || 1;
        const pct = (v / max) * 100;
        return (
          <div className="flex items-center gap-3">
            <div className={`w-24 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-dark-700' : 'bg-dark-200'}`}>
              <div className="h-full rounded-full bg-primary-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="font-semibold t-primary text-sm">{v}</span>
          </div>
        );
      },
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-red-500">Error: {error}</p>
    </div>
  );

  if (data.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <MapPin size={40} className="t-faint" />
      <p className="t-muted">No geographic data yet. Start verifying addresses!</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="glass-card p-4 flex items-center gap-6">
        <div>
          <p className="text-xs t-faint uppercase">Wilayas Covered</p>
          <p className="text-2xl font-bold t-primary">{data.length}</p>
        </div>
        <div>
          <p className="text-xs t-faint uppercase">Total Verifications</p>
          <p className="text-2xl font-bold t-primary">
            {data.reduce((sum, d) => sum + d.count, 0)}
          </p>
        </div>
        <div>
          <p className="text-xs t-faint uppercase">Top Wilaya</p>
          <p className="text-2xl font-bold text-primary-500">{data[0]?.wilaya || '—'}</p>
        </div>
      </div>

      {/* Chart */}
      <ChartCard title="Verifications by Wilaya" subtitle="Geographic distribution">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.slice(0, 15)} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={cc.grid} />
            <XAxis type="number" tick={{ fill: cc.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="wilaya" tick={{ fill: cc.legend, fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={18} name="Verifications" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        searchKeys={['wilaya']}
        pageSize={10}
      />
    </div>
  );
}
