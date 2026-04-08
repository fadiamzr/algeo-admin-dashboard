import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Truck,
  Users,
  MapPin,
  Map,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/verifications', icon: ShieldCheck, label: 'Verifications' },
  { path: '/deliveries', icon: Truck, label: 'Deliveries' },
  { path: '/map', icon: Map, label: 'Delivery Map' },
  { path: '/agents', icon: Users, label: 'Agents' },
  { path: '/geographic', icon: MapPin, label: 'Geographic Data' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/logs', icon: FileText, label: 'System Logs' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const { isDark } = useTheme();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #0F1A2E 0%, #1B2B4A 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #E4ECF4 100%)',
        borderRight: `1px solid ${isDark ? 'rgba(90, 119, 153, 0.12)' : 'rgba(27, 43, 74, 0.08)'}`,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}` }}>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shrink-0">
          <img
            src={isDark ? '/logo-dark.svg' : '/logo-light.svg'}
            alt="Algeo Verify"
            className="w-10 h-10 object-cover"
          />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <h1 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-navy-900'}`}>Algeo-Verify</h1>
            <p className="text-[11px] t-faint font-medium">Admin Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-teal-400/15 text-teal-400'
                  : isDark
                    ? 'text-navy-400 hover:text-navy-200 hover:bg-white/5'
                    : 'text-navy-500 hover:text-navy-800 hover:bg-black/5'
              }`}
              style={isActive ? { color: isDark ? '#6BC7B2' : '#3D9C85' } : {}}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-teal-400 rounded-r-full" />
              )}
              <item.icon
                size={20}
                className={`shrink-0 ${isActive
                  ? (isDark ? 'text-teal-300' : 'text-teal-500')
                  : isDark
                    ? 'text-navy-500 group-hover:text-navy-300'
                    : 'text-navy-400 group-hover:text-navy-600'
                }`}
              />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}` }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 text-sm ${
            isDark ? 'text-navy-500 hover:text-navy-300 hover:bg-white/5' : 'text-navy-400 hover:text-navy-700 hover:bg-black/5'
          }`}
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
