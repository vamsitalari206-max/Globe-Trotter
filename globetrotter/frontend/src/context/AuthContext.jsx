import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('globetrotter_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const closeToast = () => setToast(null);

  // Check login status on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('globetrotter_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('globetrotter_user', JSON.stringify(data.user));
        }
      } catch (err) {
        console.warn('Authentication session expired or server unreachable');
        localStorage.removeItem('globetrotter_token');
        localStorage.removeItem('globetrotter_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('globetrotter_token', data.token);
        localStorage.setItem('globetrotter_user', JSON.stringify(data.user));
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}`, 'success');
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      if (data.success) {
        localStorage.setItem('globetrotter_token', data.token);
        localStorage.setItem('globetrotter_user', JSON.stringify(data.user));
        setUser(data.user);
        showToast(`Account created! Welcome to Globetrotter, ${data.user.name}`, 'success');
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('globetrotter_token');
      localStorage.removeItem('globetrotter_user');
      setUser(null);
      showToast('You have been logged out.', 'info');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/users/profile', profileData);
      if (data.success) {
        const updated = { ...user, ...data.user };
        setUser(updated);
        localStorage.setItem('globetrotter_user', JSON.stringify(updated));
        showToast('Profile updated successfully.', 'success');
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed.';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const toggleFavorite = async (destinationId) => {
    if (!user) {
      showToast('Please sign in to save favorite destinations.', 'warning');
      return false;
    }

    try {
      const { data } = await api.post(`/users/favorites/${destinationId}`);
      if (data.success) {
        const updatedSaved = data.savedDestinations;
        const updatedUser = { ...user, savedDestinations: updatedSaved };
        setUser(updatedUser);
        localStorage.setItem('globetrotter_user', JSON.stringify(updatedUser));
        showToast(data.message, 'success');
        return data.isFavorite;
      }
    } catch (err) {
      showToast('Could not update favorites.', 'error');
      return false;
    }
  };

  const isFavorite = (destinationId) => {
    if (!user || !user.savedDestinations) return false;
    return user.savedDestinations.some((d) => {
      const id = typeof d === 'object' ? d._id : d;
      return id === destinationId;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        toggleFavorite,
        isFavorite,
        showToast,
        toast,
        closeToast,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
