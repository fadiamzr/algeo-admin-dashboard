import { useState } from 'react';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/ui/Modal';
import { wilayas, communes } from '../mockData';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Pencil, MapPin, Building2, Save } from 'lucide-react';

export default function GeographicData() {
  const [tab, setTab] = useState('wilayas');
  const [wilayaList, setWilayaList] = useState(wilayas);
  const [communeList, setCommuneList] = useState(communes);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [wilayaForm, setWilayaForm] = useState({ code: '', name_fr: '', name_en: '' });
  const [communeForm, setCommuneForm] = useState({ name_fr: '', name_en: '', postalCode: '', wilayaId: '' });
  const { isDark } = useTheme();

  const openWilayaCreate = () => { setEditing(null); setWilayaForm({ code: '', name_fr: '', name_en: '' }); setShowModal(true); };
  const openWilayaEdit = (w) => { setEditing(w); setWilayaForm({ code: w.code, name_fr: w.name_fr, name_en: w.name_en }); setShowModal(true); };
  const saveWilaya = () => {
    if (!wilayaForm.code || !wilayaForm.name_fr) return;
    if (editing) { setWilayaList((prev) => prev.map((w) => w.id === editing.id ? { ...w, ...wilayaForm } : w)); }
    else { setWilayaList((prev) => [...prev, { id: prev.length + 1, ...wilayaForm }]); }
    setShowModal(false);
  };

  const openCommuneCreate = () => { setEditing(null); setCommuneForm({ name_fr: '', name_en: '', postalCode: '', wilayaId: '' }); setShowModal(true); };
  const openCommuneEdit = (c) => { setEditing(c); setCommuneForm({ name_fr: c.name_fr, name_en: c.name_en, postalCode: String(c.postalCode), wilayaId: String(c.wilayaId) }); setShowModal(true); };
  const saveCommune = () => {
    if (!communeForm.name_fr || !communeForm.postalCode) return;
    if (editing) { setCommuneList((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...communeForm, postalCode: Number(communeForm.postalCode), wilayaId: Number(communeForm.wilayaId) } : c)); }
    else { setCommuneList((prev) => [...prev, { id: prev.length + 1, ...communeForm, postalCode: Number(communeForm.postalCode), wilayaId: Number(communeForm.wilayaId) }]); }
    setShowModal(false);
  };

  const wilayaColumns = [
    { key: 'id', label: 'ID', render: (v) => <span className="t-faint font-mono text-xs">{v}</span> },
    { key: 'code', label: 'Code', render: (v) => <span className="px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-600 text-xs font-mono font-medium">{v}</span> },
    { key: 'name_fr', label: 'Name (FR)', render: (v) => <span className="font-medium t-primary">{v}</span> },
    { key: 'name_en', label: 'Name (EN)', render: (v) => <span className="t-secondary">{v}</span> },
  ];

  const communeColumns = [
    { key: 'id', label: 'ID', render: (v) => <span className="t-faint font-mono text-xs">{v}</span> },
    { key: 'name_fr', label: 'Name (FR)', render: (v) => <span className="font-medium t-primary">{v}</span> },
    { key: 'name_en', label: 'Name (EN)', render: (v) => <span className="t-secondary">{v}</span> },
    { key: 'postalCode', label: 'Postal Code', render: (v) => <span className="font-mono t-secondary text-sm">{v}</span> },
    {
      key: 'wilayaId',
      label: 'Wilaya',
      render: (v) => {
        const w = wilayaList.find((w) => w.id === v);
        return <span className="t-muted text-sm">{w?.name_fr || '—'}</span>;
      },
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('wilayas')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              tab === 'wilayas'
                ? 'bg-primary-600/20 text-primary-600 border border-primary-500/20'
                : `t-muted border border-transparent ${isDark ? 'hover:text-dark-200 hover:bg-white/5' : 'hover:text-dark-900 hover:bg-black/5'}`
            }`}
          >
            <MapPin size={16} /> Wilayas
            <span className="text-xs opacity-60">({wilayaList.length})</span>
          </button>
          <button
            onClick={() => setTab('communes')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              tab === 'communes'
                ? 'bg-primary-600/20 text-primary-600 border border-primary-500/20'
                : `t-muted border border-transparent ${isDark ? 'hover:text-dark-200 hover:bg-white/5' : 'hover:text-dark-900 hover:bg-black/5'}`
            }`}
          >
            <Building2 size={16} /> Communes
            <span className="text-xs opacity-60">({communeList.length})</span>
          </button>
        </div>
        <button onClick={tab === 'wilayas' ? openWilayaCreate : openCommuneCreate} className="btn-primary">
          <Plus size={16} /> Add {tab === 'wilayas' ? 'Wilaya' : 'Commune'}
        </button>
      </div>

      {tab === 'wilayas' && (
        <DataTable columns={wilayaColumns} data={wilayaList} searchKeys={['name_fr', 'name_en', 'code']} pageSize={10}
          actions={(row) => (
            <button onClick={(e) => { e.stopPropagation(); openWilayaEdit(row); }}
              className={`p-1.5 rounded-lg hover:text-primary-500 transition-colors t-faint ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`} title="Edit">
              <Pencil size={15} />
            </button>
          )}
        />
      )}

      {tab === 'communes' && (
        <DataTable columns={communeColumns} data={communeList} searchKeys={['name_fr', 'name_en', 'postalCode']} pageSize={10}
          actions={(row) => (
            <button onClick={(e) => { e.stopPropagation(); openCommuneEdit(row); }}
              className={`p-1.5 rounded-lg hover:text-primary-500 transition-colors t-faint ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`} title="Edit">
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
