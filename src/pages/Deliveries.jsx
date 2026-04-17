import { useState, useEffect, useRef } from 'react';
import DataTable from '../components/tables/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, Download, Upload } from 'lucide-react';
import { apiGetDeliveries } from '../api';

function exportCSV(data) {
  const headers = [
    'address', 'status', 'scheduled_date', 'delivery_agent_id',
    'normalized_address', 'latitude', 'longitude', 'confidence_score',
    'ai_preprocessed', 'geocoding_status',
  ];
  const rows = data.map((d) => [
    `"${d.address || ''}"`,
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
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);
  const { isDark } = useTheme();

  const fetchDeliveries = () => {
    setLoading(true);
    apiGetDeliveries(1, 100)
      .then((res) => setData(res.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/admin/deliveries/import`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();
      setImportResult(result);
      fetchDeliveries();
    } catch (err) {
      setImportResult({ message: 'Import failed', created: 0, errors: [err.message] });
    } finally {
      setImporting(false);
      fileInputRef.current.value = '';
    }
  };

  const filtered = statusFilter === 'all'
    ? data
    : data.filter((d) => d.status === statusFilter);

  // ── Fixed: use correct status values matching the DB ──
  const statusTabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (v) => <span className="t-faint font-mono text-xs">#{v}</span>,
    },
    {
      key: 'address',
      label: 'Address',
      render: (v) => <span className="truncate max-w-[200px] block t-secondary text-xs">{v || '—'}</span>,
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
      key: 'confidence_score',
      label: 'Score',
      render: (v) => v != null ? (
        <span className={`font-semibold text-xs ${v >= 0.8 ? 'text-emerald-500' : v >= 0.5 ? 'text-amber-500' : 'text-red-500'}`}>
          {(v * 100).toFixed(0)}%
        </span>
      ) : <span className="t-faint text-xs">—</span>,
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
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${statusFilter === tab.key
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={importing}
            className="btn-secondary flex items-center gap-2 disabled:opacity-60"
          >
            <Upload size={15} />
            {importing ? 'Importing...' : 'Import CSV'}
          </button>
          <button
            onClick={() => exportCSV(filtered)}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Import Result */}
      {importResult && (
        <div className={`p-4 rounded-xl text-sm ${importResult.errors?.length > 0
          ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
          : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
          }`}>
          <p className="font-medium">{importResult.message} — {importResult.created} deliveries added</p>
          {importResult.errors?.length > 0 && (
            <ul className="mt-2 text-xs space-y-1">
              {importResult.errors.map((e, i) => <li key={i}>⚠️ {e}</li>)}
            </ul>
          )}
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        searchKeys={['id', 'status', 'delivery_agent_id', 'address']}
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
              <div className="glass-card-light p-4 md:col-span-2">
                <label className="text-xs font-medium t-faint uppercase">Address</label>
                <p className="text-sm t-primary mt-1">{selectedDelivery.address || '—'}</p>
                {selectedDelivery.normalized_address && selectedDelivery.normalized_address !== selectedDelivery.address && (
                  <p className="text-xs t-muted mt-1">Normalized: {selectedDelivery.normalized_address}</p>
                )}
              </div>
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Confidence Score</label>
                <p className="text-sm t-secondary mt-1">
                  {selectedDelivery.confidence_score != null ? `${(selectedDelivery.confidence_score * 100).toFixed(0)}%` : '—'}
                </p>
              </div>
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Geocoding</label>
                <p className="text-sm t-secondary mt-1">{selectedDelivery.geocoding_status || '—'}</p>
              </div>
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Coordinates</label>
                <p className="text-sm font-mono t-secondary mt-1">
                  {selectedDelivery.latitude && selectedDelivery.longitude
                    ? `${selectedDelivery.latitude.toFixed(4)}, ${selectedDelivery.longitude.toFixed(4)}`
                    : '—'}
                </p>
              </div>
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Scheduled Date</label>
                <p className="text-sm t-secondary mt-1">{new Date(selectedDelivery.scheduled_date).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}