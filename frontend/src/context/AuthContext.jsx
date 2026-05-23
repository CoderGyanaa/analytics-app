import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('iq_token');
    const savedUser = localStorage.getItem('iq_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('iq_token', data.token);
    localStorage.setItem('iq_user', JSON.stringify(data.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('iq_token');
    localStorage.removeItem('iq_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isAnalyst = user?.role === 'analyst' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isAnalyst }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
