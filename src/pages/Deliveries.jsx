import { useState } from 'react';
import DataTable from '../components/tables/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { deliveries, addressVerifications, deliveryAgents, feedbacks } from '../mockData';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, MapPin, User, Phone, MessageSquare } from 'lucide-react';

export default function Deliveries() {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { isDark } = useTheme();

  const enrichedDeliveries = deliveries.map((d) => {
    const agent = deliveryAgents.find((a) => a.id === d.agentId);
    const verification = addressVerifications.find((v) => v.id === d.addressVerificationId);
    const feedback = feedbacks.find((f) => f.deliveryId === d.id);
    return { ...d, agentName: agent?.name || '—', address: verification?.normalizedAddress || verification?.rawAddress || '—', score: verification?.confidenceScore, feedback };
  });

  const filteredDeliveries = statusFilter === 'all'
    ? enrichedDeliveries
    : enrichedDeliveries.filter((d) => d.status === statusFilter);

  const statusTabs = [
    { key: 'all', label: 'All', count: enrichedDeliveries.length },
    { key: 'delivered', label: 'Delivered', count: enrichedDeliveries.filter((d) => d.status === 'delivered').length },
    { key: 'in_transit', label: 'In Transit', count: enrichedDeliveries.filter((d) => d.status === 'in_transit').length },
    { key: 'pending', label: 'Pending', count: enrichedDeliveries.filter((d) => d.status === 'pending').length },
    { key: 'failed', label: 'Failed', count: enrichedDeliveries.filter((d) => d.status === 'failed').length },
  ];

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (v) => <span className="t-faint font-mono text-xs">{v}</span>,
    },
    {
      key: 'clientName',
      label: 'Client',
      render: (v, row) => (
        <div>
          <p className="font-medium t-primary text-sm">{v}</p>
          <p className="text-xs t-faint">{row.clientPhone}</p>
        </div>
      ),
    },
    {
      key: 'agentName',
      label: 'Agent',
      render: (v) => <span className="t-secondary">{v}</span>,
    },
    {
      key: 'address',
      label: 'Address',
      render: (v) => <span className="truncate max-w-[200px] block t-muted text-xs">{v}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => <StatusBadge status={v} />,
    },
    {
      key: 'score',
      label: 'Score',
      render: (v) =>
        v != null ? (
          <span className={`text-xs font-semibold ${v >= 0.8 ? 'text-emerald-500' : v >= 0.5 ? 'text-amber-500' : 'text-red-500'}`}>
            {(v * 100).toFixed(0)}%
          </span>
        ) : (
          <span className="t-faint">—</span>
        ),
    },
    {
      key: 'scheduledDate',
      label: 'Scheduled',
      render: (v) => <span className="t-muted text-xs">{v}</span>,
    },
  ];

  const selectedFeedback = selectedDelivery?.feedback;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Status Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              statusFilter === tab.key
                ? 'bg-teal-400/15 text-teal-400 border border-teal-400/20'
                : `t-muted border border-transparent ${isDark ? 'hover:text-navy-200 hover:bg-white/5' : 'hover:text-navy-900 hover:bg-black/5'}`
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
        data={filteredDeliveries}
        searchKeys={['clientName', 'agentName', 'address', 'id']}
        pageSize={8}
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
              <div className="glass-card-light p-4 space-y-3">
                <h4 className="text-xs font-semibold t-muted uppercase flex items-center gap-1.5">
                  <User size={14} /> Client Information
                </h4>
                <div>
                  <p className="text-sm font-medium t-primary">{selectedDelivery.clientName}</p>
                  <p className="text-xs t-muted flex items-center gap-1 mt-1">
                    <Phone size={12} /> {selectedDelivery.clientPhone}
                  </p>
                </div>
              </div>

              <div className="glass-card-light p-4 space-y-3">
                <h4 className="text-xs font-semibold t-muted uppercase flex items-center gap-1.5">
                  <MapPin size={14} /> Delivery Address
                </h4>
                <p className="text-sm t-secondary">{selectedDelivery.address}</p>
                <div className="flex items-center gap-3">
                  <StatusBadge status={selectedDelivery.status} />
                  {selectedDelivery.score != null && (
                    <span className={`text-xs font-semibold ${selectedDelivery.score >= 0.8 ? 'text-emerald-500' : selectedDelivery.score >= 0.5 ? 'text-amber-500' : 'text-red-500'}`}>
                      Score: {(selectedDelivery.score * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Agent</label>
                <p className="text-sm t-secondary mt-1">{selectedDelivery.agentName}</p>
              </div>
              <div className="glass-card-light p-4">
                <label className="text-xs font-medium t-faint uppercase">Scheduled Date</label>
                <p className="text-sm t-secondary mt-1">{selectedDelivery.scheduledDate}</p>
              </div>
            </div>

            {selectedFeedback && (
              <div className="glass-card-light p-4">
                <h4 className="text-xs font-semibold t-muted uppercase flex items-center gap-1.5 mb-3">
                  <MessageSquare size={14} /> Delivery Feedback
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={selectedFeedback.outcome} />
                  <span className="text-xs t-faint">{new Date(selectedFeedback.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm t-secondary">{selectedFeedback.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
