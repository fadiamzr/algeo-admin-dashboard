import { useState, useEffect } from 'react';
import DataTable from '../components/tables/DataTable';
import ChartCard from '../components/charts/ChartCard';
import { useTheme } from '../contexts/ThemeContext';
import { Server, AlertCircle } from 'lucide-react';
import { apiGetLogs, apiGetRequestsPerEndpoint, apiGetErrorRate } from '../api';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

function useChartColors() {
  const { isDark } = useTheme();
  return {
    grid: isDark ? 'rgba(90,119,153,0.1)' : 'rgba(27,43,74,0.06)',
    tick: isDark ? '#3B5576' : '#8FA5BF',
    legend: isDark ? '#5A7799' : '#5A7799',
    tooltipBg: isDark ? 'rgba(27,43,74,0.95)' : 'rgba(255,255,255,0.97)',
    tooltipBorder: isDark ? 'rgba(90,119,153,0.15)' : 'rgba(27,43,74,0.08)',
    tooltipText: isDark ? '#C0D0E0' : '#1B2B4A',
  };
}

export default function SystemLogs() {
  const [tab, setTab] = useState('api');
  const [logs, setLogs] = useState([]);
  const [requestsPerEndpoint, setRequestsPerEndpoint] = useState([]);
  const [errorRate, setErrorRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  const cc = useChartColors();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiGetLogs(200),
      apiGetRequestsPerEndpoint(),
      apiGetErrorRate(),
    ])
      .then(([logsData, endpointsData, errorRateData]) => {
        setLogs(logsData);
        setRequestsPerEndpoint(endpointsData);
        setErrorRate(errorRateData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const errorLogs = logs.filter((l) => l.statusCode >= 400);

  const methodColor = {
    GET: 'text-emerald-600 bg-emerald-500/10',
    POST: 'text-blue-600 bg-blue-500/10',
    PUT: 'text-amber-600 bg-amber-500/10',
    DELETE: 'text-red-600 bg-red-500/10',
  };

  const statusColor = (code) => {
    if (code < 300) return 'text-emerald-600';
    if (code < 400) return 'text-amber-600';
    return 'text-red-600';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="px-3 py-2 text-xs rounded-xl shadow-xl backdrop-blur-xl"
        style={{ background: cc.tooltipBg, border: `1px solid ${cc.tooltipBorder}` }}>
        <p className="font-medium mb-1" style={{ color: cc.tooltipText }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (v) => <span className="t-faint font-mono text-xs">#{v}</span>,
    },
    {
      key: 'method',
      label: 'Method',
      render: (v) => (
        <span className={`px-2 py-0.5 rounded-md text-xs font-mono font-semibold ${methodColor[v] || 't-muted'}`}>
          {v}
        </span>
      ),
    },
    {
      key: 'endpoint',
      label: 'Endpoint',
      render: (v) => <span className="font-mono t-secondary text-xs">{v}</span>,
    },
    {
      key: 'statusCode',
      label: 'Status',
      render: (v) => (
        <span className={`font-mono font-semibold text-sm ${statusColor(v)}`}>{v}</span>
      ),
    },
    {
      key: 'requestTime',
      label: 'Time',
      render: (v) => <span className="t-muted text-xs">{new Date(v).toLocaleString()}</span>,
    },
  ];

  const displayData = tab === 'api' ? logs : errorLogs;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Error Rate Summary */}
      {errorRate && (
        <div className="glass-card p-4 flex items-center gap-6">
          <div>
            <p className="text-xs t-faint uppercase">Total Requests</p>
            <p className="text-2xl font-bold t-primary">{errorRate.total}</p>
          </div>
          <div>
            <p className="text-xs t-faint uppercase">Errors</p>
            <p className="text-2xl font-bold text-red-500">{errorRate.errors}</p>
          </div>
          <div>
            <p className="text-xs t-faint uppercase">Error Rate</p>
            <p className={`text-2xl font-bold ${errorRate.errorRate > 5 ? 'text-red-500' : 'text-emerald-500'}`}>
              {errorRate.errorRate}%
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTab('api')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            tab === 'api'
              ? 'bg-teal-400/15 text-teal-400 border border-teal-400/20'
              : `t-muted border border-transparent ${isDark ? 'hover:text-navy-200 hover:bg-white/5' : 'hover:text-navy-900 hover:bg-black/5'}`
          }`}
        >
          <Server size={16} /> API Logs
          <span className="text-xs opacity-60">({logs.length})</span>
        </button>
        <button
          onClick={() => setTab('errors')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            tab === 'errors'
              ? 'bg-red-600/20 text-red-600 border border-red-500/20'
              : `t-muted border border-transparent ${isDark ? 'hover:text-navy-200 hover:bg-white/5' : 'hover:text-navy-900 hover:bg-black/5'}`
          }`}
        >
          <AlertCircle size={16} /> Error Logs
          <span className="text-xs opacity-60">({errorLogs.length})</span>
        </button>
      </div>

      {requestsPerEndpoint.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="Requests per Endpoint" subtitle="Total API calls by endpoint">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={requestsPerEndpoint} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={cc.grid} />
                <XAxis type="number" tick={{ fill: cc.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="endpoint" tick={{ fill: cc.legend, fontSize: 10 }} axisLine={false} tickLine={false} width={140} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="requests" fill="#4CB79E" radius={[0, 6, 6, 0]} barSize={16} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Error Rate Over Time" subtitle="Daily total requests vs errors">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={errorRateOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke={cc.grid} />
                <XAxis dataKey="date" tick={{ fill: cc.tick, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: cc.tick, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: cc.legend }} />
                <Line type="monotone" dataKey="total" stroke="#4CB79E" strokeWidth={2} dot={{ fill: '#4CB79E', r: 3 }} name="Total Requests" />
                <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} name="Errors" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* Logs Table */}
      <DataTable
        columns={columns}
        data={displayData}
        searchKeys={['endpoint', 'method']}
        pageSize={10}
      />
    </div>
  );
}
