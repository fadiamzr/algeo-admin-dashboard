import { useState, useEffect } from 'react';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/ui/Modal';
import { Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { apiGetVerifications } from '../api';

export default function Verifications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    setLoading(true);
    apiGetVerifications(page, 20, filter)
      .then((res) => {
        setData(res.items || []);
        setTotal(res.total || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filter, page]);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (v) => <span className="t-faint font-mono text-xs">{v}</span>,
    },
    {
      key: 'raw_address',
      label: 'Raw Address',
      render: (v) => <span className="truncate max-w-[200px] block font-medium t-primary">{v}</span>,
    },
    {
      key: 'normalized_address',
      label: 'Normalized',
      render: (v) => <span className="truncate max-w-[220px] block t-secondary">{v || '—'}</span>,
    },
    {
      key: 'confidence_score',
      label: 'Score',
      render: (v) => {
        const pct = (v * 100).toFixed(0);
        const color = v >= 0.8 ? 'text-emerald-500' : v >= 0.5 ? 'text-amber-500' : 'text-red-500';
        const bg = v >= 0.8 ? 'bg-emerald-500' : v >= 0.5 ? 'bg-amber-500' : 'bg-red-500';
        return (
          <div className="flex items-center gap-2">
            <div className={`w-16 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-dark-700' : 'bg-dark-200'}`}>
              <div className={`h-full rounded-full ${bg}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-xs font-semibold ${color}`}>{pct}%</span>
          </div>
        );
      },
    },
    {
      key: 'match_details',
      label: 'Match',
      render: (v) =>
        v ? (
          <div className="flex items-center gap-1">
            <CheckCircle size={14} className="text-emerald-500" />
            <span className="text-xs text-emerald-500 truncate max-w-[120px]">{v}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <AlertTriangle size={14} className="text-amber-500" />
            <span className="text-xs text-amber-500">No match</span>
          </div>
        ),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (v) => <span className="t-muted text-xs">{new Date(v).toLocaleDateString()}</span>,
    },
  ];

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'high', label: 'High Score' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low Score' },
    { key: 'risky', label: 'Risky' },
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

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setFilter(tab.key); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === tab.key
                ? 'bg-primary-600/20 text-primary-600 border border-primary-500/20'
                : `t-muted border border-transparent ${isDark ? 'hover:text-dark-200 hover:bg-white/5' : 'hover:text-dark-900 hover:bg-black/5'}`
            }`}
          >
            {tab.label}
          </button>
        ))}
        <span className="ml-auto text-xs t-muted">{total} total</span>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        searchKeys={['raw_address', 'normalized_address']}
        pageSize={20}
        actions={(row) => (
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedVerification(row); }}
            className={`p-1.5 rounded-lg hover:text-primary-500 transition-colors t-faint ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
            title="View details"
          >
            <Eye size={16} />
          </button>
        )}
      />

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedVerification}
        onClose={() => setSelectedVerification(null)}
        title="Verification Details"
        size="lg"
      >
        {selectedVerification && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium t-faint uppercase">Raw Address</label>
                <p className="text-sm t-primary mt-1">{selectedVerification.raw_address}</p>
              </div>
              <div>
                <label className="text-xs font-medium t-faint uppercase">Normalized Address</label>
                <p className="text-sm t-primary mt-1">{selectedVerification.normalized_address || '—'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Confidence Score</label>
                <p className={`text-2xl font-bold mt-1 ${
                  selectedVerification.confidence_score >= 0.8 ? 'text-emerald-500' :
                  selectedVerification.confidence_score >= 0.5 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {(selectedVerification.confidence_score * 100).toFixed(0)}%
                </p>
              </div>
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Match Details</label>
                <p className="text-sm t-secondary mt-1">{selectedVerification.match_details || '—'}</p>
              </div>
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Created At</label>
                <p className="text-sm t-secondary mt-1">{new Date(selectedVerification.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
