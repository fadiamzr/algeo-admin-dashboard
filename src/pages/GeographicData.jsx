import { useState, useEffect } from 'react';
import DataTable from '../components/tables/DataTable';
import ChartCard from '../components/charts/ChartCard';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin } from 'lucide-react';
import { apiGetVerificationsByWilaya } from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function GeographicData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();

  const cc = {
    grid: isDark ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.06)',
    tick: isDark ? '#64748b' : '#6b7280',
    legend: isDark ? '#94a3b8' : '#4b5563',
    tooltipBg: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.97)',
    tooltipBorder: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(0,0,0,0.1)',
    tooltipText: isDark ? '#cbd5e1' : '#1e293b',
  };

  useEffect(() => {
    apiGetVerificationsByWilaya()
      .then((res) => setData(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="px-3 py-2 text-xs rounded-xl shadow-xl"
        style={{ background: cc.tooltipBg, border: `1px solid ${cc.tooltipBorder}` }}>
        <p className="font-medium mb-1" style={{ color: cc.tooltipText }}>{label}</p>
        <p style={{ color: '#6366f1' }} className="font-medium">
          Verifications: {payload[0].value}
        </p>
      </div>
    );
  };

  const wilayaColumns = [
    { key: 'id', label: 'ID', render: (v) => <span className="t-faint font-mono text-xs">{v}</span> },
    { key: 'code', label: 'Code', render: (v) => <span className="px-2 py-0.5 rounded-md bg-teal-400/10 text-teal-400 text-xs font-mono font-medium">{v}</span> },
    { key: 'name_fr', label: 'Name (FR)', render: (v) => <span className="font-medium t-primary">{v}</span> },
    { key: 'name_en', label: 'Name (EN)', render: (v) => <span className="t-secondary">{v}</span> },
  ];

  const communeColumns = [
    { key: 'id', label: 'ID', render: (v) => <span className="t-faint font-mono text-xs">{v}</span> },
    { key: 'name_fr', label: 'Name (FR)', render: (v) => <span className="font-medium t-primary">{v}</span> },
    { key: 'name_en', label: 'Name (EN)', render: (v) => <span className="t-secondary">{v}</span> },
    { key: 'postalCode', label: 'Postal Code', render: (v) => <span className="font-mono t-secondary text-sm">{v}</span> },
    {
      key: 'wilaya',
      label: 'Wilaya',
      render: (v) => (
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-primary-500" />
          <span className="font-medium t-primary">{v}</span>
        </div>
      ),
    },
    {
      key: 'count',
      label: 'Verifications',
      render: (v, row) => {
        const max = data[0]?.count || 1;
        const pct = (v / max) * 100;
        return (
          <div className="flex items-center gap-3">
            <div className={`w-24 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-dark-700' : 'bg-dark-200'}`}>
              <div className="h-full rounded-full bg-primary-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="font-semibold t-primary text-sm">{v}</span>
          </div>
        );
      },
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

  if (data.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <MapPin size={40} className="t-faint" />
      <p className="t-muted">No geographic data yet. Start verifying addresses!</p>
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('wilayas')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              tab === 'wilayas'
                ? 'bg-teal-400/15 text-teal-400 border border-teal-400/20'
                : `t-muted border border-transparent ${isDark ? 'hover:text-navy-200 hover:bg-white/5' : 'hover:text-navy-900 hover:bg-black/5'}`
            }`}
          >
            <MapPin size={16} /> Wilayas
            <span className="text-xs opacity-60">({wilayaList.length})</span>
          </button>
          <button
            onClick={() => setTab('communes')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              tab === 'communes'
                ? 'bg-teal-400/15 text-teal-400 border border-teal-400/20'
                : `t-muted border border-transparent ${isDark ? 'hover:text-navy-200 hover:bg-white/5' : 'hover:text-navy-900 hover:bg-black/5'}`
            }`}
          >
            <Building2 size={16} /> Communes
            <span className="text-xs opacity-60">({communeList.length})</span>
          </button>
        </div>
      </div>

      {tab === 'wilayas' && (
        <DataTable columns={wilayaColumns} data={wilayaList} searchKeys={['name_fr', 'name_en', 'code']} pageSize={10}
          actions={(row) => (
            <button onClick={(e) => { e.stopPropagation(); openWilayaEdit(row); }}
              className={`p-1.5 rounded-lg hover:text-teal-400 transition-colors t-faint ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`} title="Edit">
              <Pencil size={15} />
            </button>
          )}
        />
      )}

      {tab === 'communes' && (
        <DataTable columns={communeColumns} data={communeList} searchKeys={['name_fr', 'name_en', 'postalCode']} pageSize={10}
          actions={(row) => (
            <button onClick={(e) => { e.stopPropagation(); openCommuneEdit(row); }}
              className={`p-1.5 rounded-lg hover:text-teal-400 transition-colors t-faint ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`} title="Edit">
              <Pencil size={15} />
            </button>
          )}
        />
      )}

      <Modal isOpen={showModal && tab === 'wilayas'} onClose={() => setShowModal(false)} title={editing ? 'Edit Wilaya' : 'Add Wilaya'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium t-secondary mb-1.5">Wilaya Code</label>
            <input type="text" value={wilayaForm.code} onChange={(e) => setWilayaForm({ ...wilayaForm, code: e.target.value })} className="input-field" placeholder="16" />
          </div>
          <div>
            <label className="block text-xs font-medium t-secondary mb-1.5">Name (French)</label>
            <input type="text" value={wilayaForm.name_fr} onChange={(e) => setWilayaForm({ ...wilayaForm, name_fr: e.target.value })} className="input-field" placeholder="Alger" />
          </div>
          <div>
            <label className="block text-xs font-medium t-secondary mb-1.5">Name (English)</label>
            <input type="text" value={wilayaForm.name_en} onChange={(e) => setWilayaForm({ ...wilayaForm, name_en: e.target.value })} className="input-field" placeholder="Algiers" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={saveWilaya} className="btn-primary"><Save size={16} /> Save</button>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showModal && tab === 'communes'} onClose={() => setShowModal(false)} title={editing ? 'Edit Commune' : 'Add Commune'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium t-secondary mb-1.5">Name (French)</label>
            <input type="text" value={communeForm.name_fr} onChange={(e) => setCommuneForm({ ...communeForm, name_fr: e.target.value })} className="input-field" placeholder="Bab El Oued" />
          </div>
          <div>
            <label className="block text-xs font-medium t-secondary mb-1.5">Name (English)</label>
            <input type="text" value={communeForm.name_en} onChange={(e) => setCommuneForm({ ...communeForm, name_en: e.target.value })} className="input-field" placeholder="Bab El Oued" />
          </div>
          <div>
            <label className="block text-xs font-medium t-secondary mb-1.5">Postal Code</label>
            <input type="number" value={communeForm.postalCode} onChange={(e) => setCommuneForm({ ...communeForm, postalCode: e.target.value })} className="input-field" placeholder="16006" />
          </div>
          <div>
            <label className="block text-xs font-medium t-secondary mb-1.5">Wilaya</label>
            <select value={communeForm.wilayaId} onChange={(e) => setCommuneForm({ ...communeForm, wilayaId: e.target.value })} className="input-field">
              <option value="">Select wilaya...</option>
              {wilayaList.map((w) => (<option key={w.id} value={w.id}>{w.name_fr} ({w.code})</option>))}
            </select>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={saveCommune} className="btn-primary"><Save size={16} /> Save</button>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
