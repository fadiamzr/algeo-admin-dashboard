import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function KPICard({ title, value, subtitle, icon: Icon, trend, trendLabel, color = 'primary' }) {
  const { isDark } = useTheme();

  const colorMap = {
    primary: { bg: 'from-teal-400/20 to-teal-500/10', icon: 'text-teal-300', border: 'border-teal-400/20' },
    success: { bg: 'from-emerald-500/20 to-emerald-600/10', icon: 'text-emerald-400', border: 'border-emerald-500/20' },
    warning: { bg: 'from-amber-500/20 to-amber-600/10', icon: 'text-amber-400', border: 'border-amber-500/20' },
    danger: { bg: 'from-red-500/20 to-red-600/10', icon: 'text-red-400', border: 'border-red-500/20' },
    info: { bg: 'from-blue-500/20 to-blue-600/10', icon: 'text-blue-400', border: 'border-blue-500/20' },
  };

  const lightColorMap = {
    primary: { bg: 'from-teal-50 to-teal-100/50', icon: 'text-teal-600', border: 'border-teal-200' },
    success: { bg: 'from-emerald-50 to-emerald-100/50', icon: 'text-emerald-600', border: 'border-emerald-200' },
    warning: { bg: 'from-amber-50 to-amber-100/50', icon: 'text-amber-600', border: 'border-amber-200' },
    danger: { bg: 'from-red-50 to-red-100/50', icon: 'text-red-600', border: 'border-red-200' },
    info: { bg: 'from-blue-50 to-blue-100/50', icon: 'text-blue-600', border: 'border-blue-200' },
  };

  const c = isDark ? (colorMap[color] || colorMap.primary) : (lightColorMap[color] || lightColorMap.primary);

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-red-500' : 't-muted';

  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${c.bg} border ${c.border} animate-slide-up`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium t-muted uppercase tracking-wider">{title}</p>
          <h3 className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-navy-900'}`}>{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/80'} ${c.icon}`}>
          {Icon && <Icon size={22} />}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={14} />
            {Math.abs(trend)}%
          </span>
        )}
        {(trendLabel || subtitle) && (
          <span className="text-xs t-faint">{trendLabel || subtitle}</span>
        )}
      </div>
    </div>
  );
}
