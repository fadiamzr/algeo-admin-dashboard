import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('algeo_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('algeo_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('algeo_user');
    }
  }, [user]);

  const login = (email, password) => {
    // Mock authentication
    if (email && password) {
      const mockUser = {
        id: 'u1',
        name: 'Yacine Benmoussa',
        email: email,
        role: 'admin',
        createdAt: '2025-01-15',
      };
      setUser(mockUser);
      return { success: true, user: mockUser };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
  };

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
