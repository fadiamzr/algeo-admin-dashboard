import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark } = useTheme();

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: isDark ? '#0A1220' : '#F2F6FA' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        <TopBar />
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
