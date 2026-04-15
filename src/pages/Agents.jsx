import { useState, useEffect } from 'react';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/ui/Modal';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Pencil, Trash2, UserCheck, Download } from 'lucide-react';
import { apiGetAgents, apiCreateAgent, apiUpdateAgent, apiDeleteAgent } from '../api';

// ── Export CSV ────────────────────────────────────────────────────────────────
function exportCSV(data) {
  const headers = ['id', 'user_id', 'company_id'];
  const rows = data.map((a) => [a.id, a.user_id, a.company_id || '']);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agents_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [form, setForm] = useState({ user_id: '', company_id: '' });
  const { isDark } = useTheme();

  useEffect(() => { fetchAgents(); }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAgents = () => {
    setLoading(true);
    apiGetAgents()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.agents ?? data?.items ?? []);
        setAgents(list);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // ── Create / Edit modal ────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingAgent(null);
    setForm({ user_id: '', company_id: '' });
    setShowModal(true);
  };

  const openEdit = (agent) => {
    setEditingAgent(agent);
    setForm({ user_id: String(agent.user_id), company_id: String(agent.company_id || '') });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.user_id) return;
    try {
      if (editingAgent) {
        await apiUpdateAgent(
          editingAgent.id,
          form.company_id !== '' ? Number(form.company_id) : null
        );
      } else {
        await apiCreateAgent(Number(form.user_id));
      }
      setShowModal(false);
      fetchAgents();
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (agent) => {
    if (!confirm(`Delete agent #${agent.id}?`)) return;
    try {
      await apiDeleteAgent(agent.id);
      fetchAgents();
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'id',
      label: 'Agent ID',
      render: (v) => <span className="font-mono t-faint text-xs">#{v}</span>,
    },
    {
      key: 'user_id',
      label: 'User',
      render: (v) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400/30 to-primary-600/30 flex items-center justify-center text-primary-600 text-sm font-semibold border border-primary-500/20">
            {v}
          </div>
          <span className="font-mono t-secondary text-sm">User #{v}</span>
        </div>
      ),
    },
    {
      key: 'company_id',
      label: 'Company ID',
      render: (v) => <span className="font-mono t-secondary text-sm">{v || '—'}</span>,
    },
  ];

  // ── Guards ─────────────────────────────────────────────────────────────────
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm t-muted">{agents.length} agents registered</p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCSV(agents)}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={15} />
            Export CSV
          </button>

          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Agent
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <DataTable
        columns={columns}
        data={agents}
        searchKeys={['id', 'user_id', 'company_id']}
        pageSize={8}
        actions={(row) => (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); openEdit(row); }}
              className={`p-1.5 rounded-lg hover:text-primary-500 transition-colors t-faint ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
              title="Edit"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
              className={`p-1.5 rounded-lg hover:text-red-500 transition-colors t-faint ${isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      />

      {/* ── Add / Edit Modal ── */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAgent ? 'Edit Agent' : 'Add New Agent'}
      >
        <div className="space-y-4">
          {!editingAgent && (
            <div>
              <label className="block text-xs font-medium t-secondary mb-1.5">User ID</label>
              <input
                type="number"
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                className="input-field"
                placeholder="Enter user ID"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium t-secondary mb-1.5">Company ID</label>
            <input
              type="number"
              value={form.company_id}
              onChange={(e) => setForm({ ...form, company_id: e.target.value })}
              className="input-field"
              placeholder="1001"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSave} className="btn-primary flex items-center gap-2">
              <UserCheck size={16} /> {editingAgent ? 'Update' : 'Create'}
            </button>
            <button onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}