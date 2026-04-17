import { useState, useEffect } from 'react';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/ui/Modal';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Pencil, Trash2, UserCheck, Download } from 'lucide-react';
import { apiGetAgents, apiRegisterAgent, apiUpdateAgent, apiDeleteAgent } from '../api';

function exportCSV(data) {
  const headers = ['id', 'user_id', 'name', 'email', 'company_id'];
  const rows = data.map((a) => [a.id, a.user_id, a.name || '', a.email || '', a.company_id || '']);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agents_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', company_id: '' });
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null); const { isDark } = useTheme();

  useEffect(() => { fetchAgents(); }, []);

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

  const openCreate = () => {
    setEditingAgent(null);
    setForm({ name: '', email: '', company_id: '' });
    setFormError(null);
    setSuccessMsg(null);
    setShowModal(true);
  };

  const openEdit = (agent) => {
    setEditingAgent(agent);
    setForm({
      name: agent.name || '',
      email: agent.email || '',
      password: '',
      company_id: String(agent.company_id || ''),
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (editingAgent) {
      try {
        await apiUpdateAgent(
          editingAgent.id,
          form.company_id !== '' ? Number(form.company_id) : null
        );
        setShowModal(false);
        fetchAgents();
      } catch (err) {
        setFormError(err.message);
      }
    } else {
      if (!form.name || !form.email) {
        setFormError('Name and email are required');
        return;
      }
      try {
        const result = await apiRegisterAgent(form.name, form.email);
        setSuccessMsg(`Agent created!\n\nEmail: ${result.email}\nPassword: ${result.generated_password}`);
        fetchAgents();
      } catch (err) {
        setFormError(err.message);
      }
    }
  };

  const handleDelete = async (agent) => {
    if (!confirm(`Delete agent #${agent.id}?`)) return;
    try {
      await apiDeleteAgent(agent.id);
      fetchAgents();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Agent ID',
      render: (v) => <span className="font-mono t-faint text-xs">#{v}</span>,
    },
    {
      key: 'name',
      label: 'Name',
      render: (v) => <span className="font-medium t-primary">{v || '—'}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (v) => <span className="t-secondary text-sm">{v || '—'}</span>,
    },
    {
      key: 'company_id',
      label: 'Company',
      render: (v) => <span className="font-mono t-secondary text-sm">{v || '—'}</span>,
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAgent ? 'Edit Agent' : 'Register New Agent'}
      >
        <div className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-500">
              {formError}
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 whitespace-pre-line">
              {successMsg}
              <button
                onClick={() => { navigator.clipboard.writeText(successMsg); }}
                className="mt-2 block text-xs underline opacity-70"
              >
                Copy to clipboard
              </button>
            </div>
          )}

          {!successMsg && (
            <>
              {!editingAgent && (
                <>
                  <div>
                    <label className="block text-xs font-medium t-secondary mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                      placeholder="Karim Benali"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium t-secondary mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                      placeholder="karim@algeo.dz"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-medium t-secondary mb-1.5">
                  Company ID <span className="t-faint">(optional)</span>
                </label>
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
                  <UserCheck size={16} /> {editingAgent ? 'Update' : 'Register Agent'}
                </button>
                <button onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </>
          )}

          {successMsg && (
            <button
              onClick={() => { setShowModal(false); setSuccessMsg(null); }}
              className="btn-primary w-full"
            >
              Done
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
}