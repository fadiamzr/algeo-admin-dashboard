import { useTheme } from '../../contexts/ThemeContext';

export default function ChartCard({ title, subtitle, children, className = '' }) {
  const { isDark } = useTheme();

  return (
    <div className={`glass-card p-5 animate-slide-up ${className}`}>
      <div className="mb-4">
        <h3 className={`text-sm font-semibold ${isDark ? 'text-dark-100' : 'text-dark-800'}`}>{title}</h3>
        {subtitle && <p className="text-xs t-faint mt-0.5">{subtitle}</p>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
