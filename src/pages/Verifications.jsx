import { useState } from 'react';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/ui/Modal';
import { addressVerifications, verificationRecords } from '../mockData';
import { Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Verifications() {
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [filter, setFilter] = useState('all');
  const { isDark } = useTheme();

  const filteredData = addressVerifications.filter((v) => {
    if (filter === 'high') return v.confidenceScore >= 0.8;
    if (filter === 'medium') return v.confidenceScore >= 0.5 && v.confidenceScore < 0.8;
    if (filter === 'low') return v.confidenceScore < 0.5;
    if (filter === 'risky') return v.riskFlags.length > 0;
    return true;
  });

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (v) => <span className="t-faint font-mono text-xs">{v}</span>,
    },
    {
      key: 'rawAddress',
      label: 'Raw Address',
      render: (v) => <span className="truncate max-w-[200px] block font-medium t-primary">{v}</span>,
    },
    {
      key: 'normalizedAddress',
      label: 'Normalized',
      render: (v) => <span className="truncate max-w-[220px] block t-secondary">{v || '—'}</span>,
    },
    {
      key: 'confidenceScore',
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
      key: 'riskFlags',
      label: 'Risk Flags',
      render: (v) =>
        v?.length > 0 ? (
          <div className="flex items-center gap-1">
            <AlertTriangle size={14} className="text-amber-500" />
            <span className="text-xs text-amber-500">{v.length} flag{v.length > 1 ? 's' : ''}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <CheckCircle size={14} className="text-emerald-500" />
            <span className="text-xs text-emerald-500">Clean</span>
          </div>
        ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (v) => <span className="t-muted text-xs">{new Date(v).toLocaleDateString()}</span>,
    },
  ];

  const relatedRecords = selectedVerification
    ? verificationRecords.filter((r) => r.verificationId === selectedVerification.id)
    : [];

  const filterTabs = [
    { key: 'all', label: 'All', count: addressVerifications.length },
    { key: 'high', label: 'High Score', count: addressVerifications.filter((v) => v.confidenceScore >= 0.8).length },
    { key: 'medium', label: 'Medium', count: addressVerifications.filter((v) => v.confidenceScore >= 0.5 && v.confidenceScore < 0.8).length },
    { key: 'low', label: 'Low Score', count: addressVerifications.filter((v) => v.confidenceScore < 0.5).length },
    { key: 'risky', label: 'Risky', count: addressVerifications.filter((v) => v.riskFlags.length > 0).length },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === tab.key
                ? 'bg-primary-600/20 text-primary-600 border border-primary-500/20'
                : `t-muted border border-transparent ${isDark ? 'hover:text-dark-200 hover:bg-white/5' : 'hover:text-dark-900 hover:bg-black/5'}`
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchKeys={['rawAddress', 'normalizedAddress', 'id']}
        pageSize={8}
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
            {/* Address Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium t-faint uppercase">Raw Address</label>
                <p className="text-sm t-primary mt-1">{selectedVerification.rawAddress}</p>
              </div>
              <div>
                <label className="text-xs font-medium t-faint uppercase">Normalized Address</label>
                <p className="text-sm t-primary mt-1">{selectedVerification.normalizedAddress || '—'}</p>
              </div>
            </div>

            {/* Score & Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Confidence Score</label>
                <p className={`text-2xl font-bold mt-1 ${
                  selectedVerification.confidenceScore >= 0.8 ? 'text-emerald-500' :
                  selectedVerification.confidenceScore >= 0.5 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {(selectedVerification.confidenceScore * 100).toFixed(0)}%
                </p>
              </div>
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Match Details</label>
                <p className="text-sm t-secondary mt-1">{selectedVerification.matchDetails}</p>
              </div>
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Created At</label>
                <p className="text-sm t-secondary mt-1">{new Date(selectedVerification.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Risk Flags */}
            {selectedVerification.riskFlags.length > 0 && (
              <div>
                <label className="text-xs font-medium t-faint uppercase mb-2 block">Risk Flags</label>
                <div className="flex flex-wrap gap-2">
                  {selectedVerification.riskFlags.map((flag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium border border-amber-500/20">
                      {flag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Records */}
            {relatedRecords.length > 0 && (
              <div>
                <label className="text-xs font-medium t-faint uppercase mb-2 block">Verification Records</label>
                <div className="space-y-2">
                  {relatedRecords.map((rec) => (
                    <div key={rec.id} className="glass-card-light p-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs t-faint font-mono">{rec.id}</span>
                        <p className="text-sm t-secondary">{rec.verificationDate}</p>
                      </div>
                      <span className={`text-sm font-semibold ${
                        rec.resultScore >= 0.8 ? 'text-emerald-500' : rec.resultScore >= 0.5 ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {(rec.resultScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
