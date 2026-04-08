import { useState, useEffect } from 'react';
import DataTable from '../components/tables/DataTable';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Building2, Pencil } from 'lucide-react';
import { apiGetWilayas, apiGetCommunes } from '../api';

export default function GeographicData() {
  const [tab, setTab] = useState('wilayas');
  const [wilayaList, setWilayaList] = useState([]);
  const [communeList, setCommuneList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    Promise.all([apiGetWilayas(), apiGetCommunes()])
      .then(([w, c]) => { setWilayaList(w); setCommuneList(c); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const wilayaColumns = [
    { key: 'id', label: 'ID', render: (v) => <span className="t-faint font-mono text-xs">{v}</span> },
    { key: 'code', label: 'Code', render: (v) => <span className="px-2 py-0.5 rounded-md bg-teal-400/10 text-teal-400 text-xs font-mono font-medium">{v}</span> },
    { key: 'name_fr', label: 'Name (FR)', render: (v) => <span className="font-medium t-primary">{v}</span> },
    { key: 'name_ar', label: 'Name (AR)', render: (v) => <span className="t-secondary">{v}</span> },
  ];

  const communeColumns = [
    { key: 'id', label: 'ID', render: (v) => <span className="t-faint font-mono text-xs">{v}</span> },
    { key: 'name_fr', label: 'Name (FR)', render: (v) => <span className="font-medium t-primary">{v}</span> },
    { key: 'name_ar', label: 'Name (AR)', render: (v) => <span className="t-secondary">{v}</span> },
    { key: 'postal_code', label: 'Postal Code', render: (v) => <span className="font-mono t-secondary text-sm">{v || '—'}</span> },
    { key: 'wilaya_id', label: 'Wilaya ID', render: (v) => <span className="font-mono t-secondary text-sm">{v}</span> },
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
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTab('wilayas')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${tab === 'wilayas'
              ? 'bg-teal-400/15 text-teal-400 border border-teal-400/20'
              : `t-muted border border-transparent ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`
            }`}
        >
          <MapPin size={16} /> Wilayas
          <span className="text-xs opacity-60">({wilayaList.length})</span>
        </button>
        <button
          onClick={() => setTab('communes')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${tab === 'communes'
              ? 'bg-teal-400/15 text-teal-400 border border-teal-400/20'
              : `t-muted border border-transparent ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`
            }`}
        >
          <Building2 size={16} /> Communes
          <span className="text-xs opacity-60">({communeList.length})</span>
        </button>
      </div>

      {tab === 'wilayas' && (
        <DataTable
          columns={wilayaColumns}
          data={wilayaList}
          searchKeys={['name_fr', 'code']}
          pageSize={10}
        />
      )}

      {tab === 'communes' && (
        <DataTable
          columns={communeColumns}
          data={communeList}
          searchKeys={['name_fr', 'postal_code']}
          pageSize={10}
        />
      )}
    </div>
  );
}