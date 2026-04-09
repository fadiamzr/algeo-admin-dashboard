import { useState, useEffect } from 'react';
import DataTable from '../components/tables/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, Download } from 'lucide-react';
import { apiGetDeliveries } from '../api';

function exportCSV(data) {
  const headers = [
    'address',
    'status',
    'scheduled_date',
    'delivery_agent_id',
    'normalized_address',
    'latitude',
    'longitude',
    'confidence_score',
    'ai_preprocessed',
    'geocoding_status',
  ];

  const rows = data.map((d) => [
    `"${d.raw_address || ''}"`,
    d.status || '',
    d.scheduled_date || '',
    d.delivery_agent_id || '',
    `"${d.normalized_address || ''}"`,
    d.latitude || '',
    d.longitude || '',
    d.confidence_score || '',
    d.ai_preprocessed ? 'true' : 'false',
    d.geocoding_status || '',
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `deliveries_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Deliveries() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { isDark } = useTheme();

  useEffect(() => {
    apiGetDeliveries(1, 100)
      .then((res) => setData(res.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = statusFilter === 'all'
    ? data
    : data.filter((d) => d.status === statusFilter);

  const statusTabs = [
    { key: 'all', label: 'All' },
    { key: 'completed', label: 'Completed' },
    { key: 'inProgress', label: 'In Progress' },
    { key: 'pending', label: 'Pending' },
    { key: 'failed', label: 'Failed' },
  ];

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (v) => <span className="t-faint font-mono text-xs">#{v}</span>,
    },
    {
      key: 'delivery_agent_id',
      label: 'Agent ID',
      render: (v) => <span className="t-secondary">Agent #{v}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <StatusBadge status={v} />,
    },
    {
      key: 'scheduled_date',
      label: 'Scheduled',
      render: (v) => <span className="t-muted text-xs">{new Date(v).toLocaleDateString()}</span>,
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

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                statusFilter === tab.key
                  ? 'bg-teal-400/15 text-teal-400 border border-teal-400/20'
                  : `t-muted border border-transparent ${isDark ? 'hover:text-dark-200 hover:bg-white/5' : 'hover:text-dark-900 hover:bg-black/5'}`
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-60">
                ({tab.key === 'all' ? data.length : data.filter((d) => d.status === tab.key).length})
              </span>
            </button>
          ))}
        </div>

        {/* CSV Button */}
        <button
          onClick={() => exportCSV(filtered)}
          className="btn-secondary flex items-center gap-2"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        searchKeys={['id', 'status', 'delivery_agent_id']}
        pageSize={10}
        actions={(row) => (
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedDelivery(row); }}
            className={`p-1.5 rounded-lg hover:text-teal-400 transition-colors t-faint ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
            title="View details"
          >
            <Eye size={16} />
          </button>
        )}
      />

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedDelivery}
        onClose={() => setSelectedDelivery(null)}
        title="Delivery Details"
        size="lg"
      >
        {selectedDelivery && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Status</label>
                <div className="mt-1"><StatusBadge status={selectedDelivery.status} /></div>
              </div>
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Agent ID</label>
                <p className="text-sm t-secondary mt-1">Agent #{selectedDelivery.delivery_agent_id}</p>
              </div>
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Scheduled Date</label>
                <p className="text-sm t-secondary mt-1">{new Date(selectedDelivery.scheduled_date).toLocaleString()}</p>
              </div>
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Delivery ID</label>
                <p className="text-sm font-mono t-secondary mt-1">#{selectedDelivery.id}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
