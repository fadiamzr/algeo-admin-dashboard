import { useState, useEffect } from 'react';
import ChartCard from '../components/charts/ChartCard';
import { useTheme } from '../contexts/ThemeContext';
import {
  apiGetScoreDistribution,
  apiGetMonthlyTrends,
  apiGetVerificationsByWilaya,
  apiGetDeliveryStatusDistribution,
} from '../api';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
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

const SCORE_COLORS = ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#22c55e'];

export default function Analytics() {
  const cc = useChartColors();

  const [scoreDistribution, setScoreDistribution] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [wilayaData, setWilayaData] = useState([]);
  const [statusDist, setStatusDist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGetScoreDistribution().catch(() => []),
      apiGetMonthlyTrends().catch(() => []),
      apiGetVerificationsByWilaya().catch(() => []),
      apiGetDeliveryStatusDistribution().catch(() => []),
    ])
      .then(([scores, trends, wilayas, statuses]) => {
        setScoreDistribution(scores || []);
        setMonthlyTrends(trends || []);
        setWilayaData(wilayas || []);
        setStatusDist(statuses || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="px-3 py-2 text-xs rounded-xl shadow-xl backdrop-blur-xl"
        style={{ background: cc.tooltipBg, border: `1px solid ${cc.tooltipBorder}` }}>
        <p className="font-medium mb-1" style={{ color: cc.tooltipText }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          </p>
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Verification Score Distribution" subtitle="Distribution of confidence scores across all verifications">
          {scoreDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={cc.grid} />
                <XAxis dataKey="range" tick={{ fill: cc.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: cc.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Verifications" radius={[6, 6, 0, 0]} barSize={30}>
                  {scoreDistribution.map((_, idx) => (
                    <Cell key={idx} fill={SCORE_COLORS[idx % SCORE_COLORS.length]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[320px] t-muted text-sm">No score data yet</div>
          )}
        </ChartCard>

        <ChartCard title="Delivery Outcome Breakdown" subtitle="Overall delivery status distribution">
          {statusDist.length > 0 ? (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={statusDist} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {statusDist.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                  </Pie>
                  <Tooltip content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="px-3 py-2 text-xs rounded-xl shadow-xl backdrop-blur-xl"
                        style={{ background: cc.tooltipBg, border: `1px solid ${cc.tooltipBorder}` }}>
                        <p style={{ color: cc.tooltipText }} className="font-medium">{payload[0].name}: {payload[0].value.toLocaleString()}</p>
                      </div>
                    ) : null
                  } />
                  <Legend wrapperStyle={{ fontSize: 11 }} formatter={(value) => <span style={{ color: cc.legend }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[320px] t-muted text-sm">No delivery data</div>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Monthly Trends" subtitle="Verifications and deliveries over time">
          {monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={cc.grid} />
                <XAxis dataKey="month" tick={{ fill: cc.tick, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: cc.tick, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: cc.legend }} />
                <Line type="monotone" dataKey="verifications" stroke="#4CB79E" strokeWidth={2.5} dot={{ fill: '#4CB79E', r: 4 }} name="Verifications" />
                <Line type="monotone" dataKey="deliveries" stroke="#3B82F6" strokeWidth={2.5} dot={{ fill: '#3B82F6', r: 4 }} name="Deliveries" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] t-muted text-sm">No trend data yet</div>
          )}
        </ChartCard>

        <ChartCard title="Top Wilayas by Verification Volume" subtitle="Geographic distribution">
          {wilayaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={wilayaData.slice(0, 10)} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={cc.grid} />
                <XAxis type="number" tick={{ fill: cc.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="wilaya" tick={{ fill: cc.legend, fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#4CB79E" radius={[0, 8, 8, 0]} barSize={22} name="Verifications">
                  {wilayaData.slice(0, 10).map((_, idx) => (<Cell key={idx} fill={`hsl(${160 + idx * 8}, 50%, ${40 + idx * 3}%)`} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] t-muted text-sm">No wilaya data yet</div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}