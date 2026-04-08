import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RefreshCw, MapPin, Loader2, AlertTriangle, X } from 'lucide-react';
import { getDeliveryMapData } from '../api';
import { useTheme } from '../contexts/ThemeContext';

// ── Fix Leaflet default icon bug in Vite builds ────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ── Status config ──────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:     { color: '#EAB308', label: 'Pending',     bg: 'bg-yellow-100 text-yellow-800' },
  in_progress: { color: '#3B82F6', label: 'In Progress', bg: 'bg-blue-100 text-blue-800' },
  delivered:   { color: '#22C55E', label: 'Delivered',   bg: 'bg-green-100 text-green-800' },
  cancelled:   { color: '#EF4444', label: 'Cancelled',   bg: 'bg-red-100 text-red-800' },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

// Algeria center
const ALGERIA_CENTER = [28.0339, 1.6596];
const DEFAULT_ZOOM = 5;
const POLL_INTERVAL_MS = 30_000;

export default function DeliveryMap() {
  const { isDark } = useTheme();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeStatuses, setActiveStatuses] = useState(new Set(ALL_STATUSES));
  const [refreshing, setRefreshing] = useState(false);

  const intervalRef = useRef(null);

  // ── Fetch data ─────────────────────────────────────────────────────────
  const fetchData = useCallback(async (showRefreshSpin = false) => {
    try {
      if (showRefreshSpin) setRefreshing(true);
      const data = await getDeliveryMapData();
      // data is expected to be an array of delivery objects
      setDeliveries(Array.isArray(data) ? data : data.deliveries ?? []);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch map data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(() => fetchData(), POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  // ── Filter deliveries by active statuses ───────────────────────────────
  const visible = deliveries.filter(
    (d) => activeStatuses.has(d.status) && d.latitude != null && d.longitude != null
  );

  const toggleStatus = (status) => {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      next.has(status) ? next.delete(status) : next.add(status);
      return next;
    });
  };

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-teal-400" />
          <p className="text-sm t-muted">Loading delivery map…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height: 'calc(100vh - 80px)' }}>

      {/* ── Error banner ────────────────────────────────────────────────── */}
      {error && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/90 text-white text-sm shadow-lg backdrop-blur-sm">
          <AlertTriangle size={16} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-1 hover:opacity-70">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Controls panel (top-right) ───────────────────────────────────── */}
      <div
        className="absolute top-4 right-4 z-[1000] rounded-2xl shadow-2xl p-4 w-56 space-y-3"
        style={{
          background: isDark ? 'rgba(15,26,46,0.95)' : 'rgba(255,255,255,0.97)',
          border: `1px solid ${isDark ? 'rgba(90,119,153,0.2)' : 'rgba(0,0,0,0.08)'}`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-teal-400" />
            <span className="text-xs font-bold t-primary uppercase tracking-wide">Live Map</span>
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="p-1.5 rounded-lg transition-colors hover:text-teal-400 text-teal-300 disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Delivery count */}
        <p className="text-xs t-muted">
          <span className="font-semibold t-primary text-sm">{visible.length}</span> deliveries on map
        </p>

        {/* Status filters */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold t-faint uppercase tracking-wider">Filter by status</p>
          {ALL_STATUSES.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const count = deliveries.filter((d) => d.status === s && d.latitude != null).length;
            return (
              <label key={s} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={activeStatuses.has(s)}
                  onChange={() => toggleStatus(s)}
                  className="sr-only"
                />
                <span
                  className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
                  style={{
                    background: activeStatuses.has(s) ? cfg.color : 'transparent',
                    border: `2px solid ${cfg.color}`,
                  }}
                >
                  {activeStatuses.has(s) && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-xs t-secondary group-hover:t-primary transition-colors flex-1">{cfg.label}</span>
                <span className="text-[10px] t-faint">{count}</span>
              </label>
            );
          })}
        </div>

        {/* Last updated */}
        {lastUpdated && (
          <p className="text-[10px] t-faint border-t pt-2" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)' }}>
            Updated {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* ── Legend (bottom-left) ─────────────────────────────────────────── */}
      <div
        className="absolute bottom-6 left-4 z-[1000] rounded-xl shadow-lg px-3 py-2.5 space-y-1.5"
        style={{
          background: isDark ? 'rgba(15,26,46,0.92)' : 'rgba(255,255,255,0.94)',
          border: `1px solid ${isDark ? 'rgba(90,119,153,0.18)' : 'rgba(0,0,0,0.07)'}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <p className="text-[10px] font-semibold t-faint uppercase tracking-wider mb-1">Legend</p>
        {ALL_STATUSES.map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: STATUS_CONFIG[s].color }} />
            <span className="text-[11px] t-secondary">{STATUS_CONFIG[s].label}</span>
          </div>
        ))}
      </div>

      {/* ── Map ─────────────────────────────────────────────────────────── */}
      <MapContainer
        center={ALGERIA_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {visible.map((delivery) => {
          const cfg = STATUS_CONFIG[delivery.status] ?? STATUS_CONFIG.pending;
          const score = delivery.confidence_score ?? delivery.confidenceScore;
          const scoreDisplay = score != null ? `${(score * 100).toFixed(0)}%` : '—';
          const address = delivery.normalized_address ?? delivery.address ?? '—';
          const geocodeQuality = delivery.geocoding_quality ?? delivery.geocodingQuality ?? '—';
          const scheduledDate = delivery.scheduled_date ?? delivery.scheduledDate ?? '—';

          return (
            <CircleMarker
              key={delivery.id}
              center={[delivery.latitude, delivery.longitude]}
              radius={8}
              pathOptions={{
                color: cfg.color,
                fillColor: cfg.color,
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup minWidth={220} maxWidth={280}>
                <div className="space-y-2 text-sm font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {/* Header */}
                  <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                    <span className="font-semibold text-gray-800 text-xs">Delivery</span>
                    <span className="font-mono text-[10px] text-gray-400">#{delivery.id}</span>
                  </div>

                  {/* Address */}
                  <p className="text-gray-700 text-xs leading-snug">{address}</p>

                  {/* Status badge */}
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg}`}>
                    {cfg.label}
                  </span>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                    <span className="text-gray-400">Confidence</span>
                    <span className="font-medium text-gray-700">{scoreDisplay}</span>
                    <span className="text-gray-400">Geocode quality</span>
                    <span className="font-medium text-gray-700 capitalize">{geocodeQuality}</span>
                    <span className="text-gray-400">Scheduled</span>
                    <span className="font-medium text-gray-700">{scheduledDate}</span>
                  </div>

                  {/* Link */}
                  <Link
                    to={`/deliveries/${delivery.id}`}
                    className="block text-center text-[11px] font-semibold text-teal-600 hover:text-teal-700 mt-1 pt-1 border-t border-gray-100"
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
