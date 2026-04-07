import { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiGetMe, setToken, removeToken, getToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On startup, check if token exists and fetch current user
  useEffect(() => {
    const token = getToken();
    if (token) {
      apiGetMe()
        .then((me) => setUser(me))
        .catch(() => {
          removeToken();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      setToken(data.access_token);
      const me = await apiGetMe();
      setUser(me);
      return { success: true, user: me };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
