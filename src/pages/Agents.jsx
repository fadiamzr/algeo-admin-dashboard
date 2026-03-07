import { useState } from 'react';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/ui/Modal';
import { deliveryAgents } from '../mockData';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Pencil, Trash2, UserCheck } from 'lucide-react';

export default function Agents() {
  const [agents, setAgents] = useState(deliveryAgents);
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', companyId: '' });
  const { isDark } = useTheme();

  const openCreate = () => {
    setEditingAgent(null);
    setForm({ name: '', email: '', companyId: '' });
    setShowModal(true);
  };

  const openEdit = (agent) => {
    setEditingAgent(agent);
    setForm({ name: agent.name, email: agent.email, companyId: String(agent.companyId) });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.companyId) return;
    if (editingAgent) {
      setAgents((prev) => prev.map((a) => a.id === editingAgent.id ? { ...a, name: form.name, email: form.email, companyId: Number(form.companyId) } : a));
    } else {
      const newAgent = {
        id: `da${Date.now()}`,
        companyId: Number(form.companyId),
        name: form.name,
        email: form.email,
        role: 'delivery_agent',
        createdAt: new Date().toISOString().split('T')[0],
        totalDeliveries: 0,
        successRate: 0,
      };
      setAgents((prev) => [...prev, newAgent]);
    }
    setShowModal(false);
  };

  const handleDelete = (agent) => {
    if (confirm(`Delete agent "${agent.name}"?`)) {
      setAgents((prev) => prev.filter((a) => a.id !== agent.id));
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Agent',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400/30 to-primary-600/30 flex items-center justify-center text-primary-600 text-sm font-semibold border border-primary-500/20">
            {v.charAt(0)}
          </div>
          <div>
            <p className="font-medium t-primary text-sm">{v}</p>
            <p className="text-xs t-faint">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'companyId',
      label: 'Company ID',
      render: (v) => <span className="font-mono t-secondary text-sm">{v}</span>,
    },
    {
      key: 'totalDeliveries',
      label: 'Deliveries',
      render: (v) => <span className="t-primary font-medium">{v}</span>,
    },
    {
      key: 'successRate',
      label: 'Success Rate',
      render: (v) => {
        const color = v >= 95 ? 'text-emerald-500' : v >= 90 ? 'text-amber-500' : 'text-red-500';
        return <span className={`font-semibold text-sm ${color}`}>{v}%</span>;
      },
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (v) => <span className="t-muted text-xs">{v}</span>,
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm t-muted">{agents.length} agents registered</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Add Agent
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={agents}
        searchKeys={['name', 'email', 'companyId']}
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAgent ? 'Edit Agent' : 'Add New Agent'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium t-secondary mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="Enter agent name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium t-secondary mb-1.5">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
              placeholder="agent@delivery.dz"
            />
          </div>
          <div>
            <label className="block text-xs font-medium t-secondary mb-1.5">Company ID</label>
            <input
              type="number"
              value={form.companyId}
              onChange={(e) => setForm({ ...form, companyId: e.target.value })}
              className="input-field"
              placeholder="1001"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSave} className="btn-primary">
              <UserCheck size={16} /> {editingAgent ? 'Update Agent' : 'Create Agent'}
            </button>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
