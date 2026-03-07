import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const { isDark } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm animate-fade-in"
        style={{ background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)' }}
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={`relative w-full ${sizeClasses[size]} glass-card shadow-2xl animate-slide-up`}
        style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}` }}
        >
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-dark-900'}`}>{title}</h3>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5 text-dark-400 hover:text-dark-200' : 'hover:bg-black/5 text-dark-500 hover:text-dark-700'}`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
