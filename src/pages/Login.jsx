import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Hexagon, Mail, Lock, ArrowRight, Sun, Moon } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@algeo.dz');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise((r) => setTimeout(r, 800));

    const result = login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: isDark ? '#020617' : '#f4f6fb' }} />
      <div className={`absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[128px] ${isDark ? 'bg-primary-600/20' : 'bg-primary-400/20'}`} />
      <div className={`absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[128px] ${isDark ? 'bg-primary-500/15' : 'bg-primary-300/15'}`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] ${isDark ? 'bg-primary-700/10' : 'bg-primary-200/20'}`} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 z-10 p-2.5 rounded-xl transition-all duration-300 ${
          isDark ? 'hover:bg-white/5 text-dark-400 hover:text-amber-400' : 'hover:bg-black/5 text-dark-500 hover:text-primary-600'
        }`}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Login card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-xl shadow-primary-500/30">
            <Hexagon size={30} className="text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-dark-900'}`}>Algeo-Verify</h1>
            <p className="text-sm t-muted">Admin Dashboard</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-dark-900'}`}>Welcome back</h2>
            <p className="text-sm t-muted mt-1">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium t-secondary mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 t-faint" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10 py-3"
                  placeholder="admin@algeo.dz"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium t-secondary mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 t-faint" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 py-3"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-xs t-faint mt-6">
            Demo credentials are pre-filled. Just click Sign In.
          </p>
        </div>
      </div>
    </div>
  );
}
