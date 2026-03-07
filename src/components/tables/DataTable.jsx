import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DataTable({
  columns,
  data,
  searchable = true,
  searchKeys = [],
  pageSize = 10,
  actions,
  onRowClick,
  emptyMessage = 'No records found',
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const { isDark } = useTheme();

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const term = search.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => {
        const value = row[key];
        return value && String(value).toLowerCase().includes(term);
      })
    );
  }, [data, search, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const comparison = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="t-faint" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-primary-400" /> : <ArrowDown size={14} className="text-primary-400" />;
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Search bar */}
      {searchable && (
        <div className="p-4" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}` }}>
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 t-faint" />
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}` }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold t-muted uppercase tracking-wider cursor-pointer transition-colors"
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable !== false && <SortIcon columnKey={col.key} />}
                  </div>
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-left text-xs font-semibold t-muted uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center t-faint text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={`transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  style={{
                    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}`,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm t-secondary">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}` }}>
          <p className="text-xs t-faint">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sortedData.length)} of {sortedData.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1} className={`p-1.5 rounded-lg t-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
              <ChevronsLeft size={16} />
            </button>
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className={`p-1.5 rounded-lg t-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 text-xs t-secondary font-medium">
              {page} / {totalPages}
            </span>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className={`p-1.5 rounded-lg t-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className={`p-1.5 rounded-lg t-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
