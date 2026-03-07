import { Search, Bell, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard Overview',
  '/verifications': 'Verification Records',
  '/deliveries': 'Deliveries Monitoring',
  '/agents': 'Agent Management',
  '/geographic': 'Geographic Data',
  '/analytics': 'Analytics',
  '/logs': 'System Logs',
};

export default function TopBar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-8 py-4 backdrop-blur-xl"
      style={{
        background: isDark ? 'rgba(2, 6, 23, 0.7)' : 'rgba(255, 255, 255, 0.85)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
      }}
    >
      {/* Left: Page title */}
      <div>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-dark-900'}`}>{title}</h2>
        <p className="text-xs t-faint mt-0.5">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}</p>
      </div>

      {/* Right: Search, theme, notifications, user */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 t-faint" />
          <input
            type="text"
            placeholder="Search..."
            className="input-field pl-9 pr-4 py-2 w-64 text-sm"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl transition-all duration-300 ${
            isDark
              ? 'hover:bg-white/5 text-dark-400 hover:text-amber-400'
              : 'hover:bg-black/5 text-dark-500 hover:text-primary-600'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun size={20} className="transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon size={20} className="transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        {/* Notifications */}
        <button className={`relative p-2 rounded-xl transition-colors ${
          isDark ? 'hover:bg-white/5 text-dark-400 hover:text-dark-200' : 'hover:bg-black/5 text-dark-500 hover:text-dark-700'
        }`}>
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
        </button>

        {/* User avatar + logout */}
        <div className="flex items-center gap-3 pl-4" style={{ borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className={`text-sm font-medium ${isDark ? 'text-dark-100' : 'text-dark-800'}`}>{user?.name || 'Admin'}</p>
            <p className="text-xs t-faint">{user?.role || 'admin'}</p>
          </div>
          <button
            onClick={logout}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-red-500/10 text-dark-500 hover:text-red-400' : 'hover:bg-red-50 text-dark-400 hover:text-red-500'
            }`}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
