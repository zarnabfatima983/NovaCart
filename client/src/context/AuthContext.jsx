import { createContext, useContext, useEffect, useReducer } from 'react';
import { authAPI } from '../services/api';
import { storage } from '../utils/helpers';

const AuthContext = createContext();

const initialState = {
  user: storage.get('nova_user'),
  token: localStorage.getItem('nova_token'),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('nova_token'),
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':   return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      localStorage.setItem('nova_token', action.payload.token);
      storage.set('nova_user', action.payload.user);
      return { ...state, loading: false, user: action.payload.user, token: action.payload.token, isAuthenticated: true, error: null };
    case 'AUTH_FAILURE': return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('nova_token');
      localStorage.removeItem('nova_user');
      return { ...state, user: null, token: null, isAuthenticated: false, loading: false };
    case 'UPDATE_USER':  storage.set('nova_user', action.payload); return { ...state, user: action.payload };
    case 'CLEAR_ERROR':  return { ...state, error: null };
    default: return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (state.token) {
        try {
          const res = await authAPI.getMe();
          dispatch({ type: 'UPDATE_USER', payload: res.user });
        } catch {
          dispatch({ type: 'LOGOUT' });
        }
      }
    };
    verifyToken();
  }, []); // eslint-disable-line

  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const res = await authAPI.login(credentials);
      dispatch({ type: 'AUTH_SUCCESS', payload: res });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'AUTH_FAILURE', payload: err.message });
      return { success: false, error: err.message };
    }
  };

  const register = async (data) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const res = await authAPI.register(data);
      dispatch({ type: 'AUTH_SUCCESS', payload: res });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'AUTH_FAILURE', payload: err.message });
      return { success: false, error: err.message };
    }
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  const updateUser = async (data) => {
    try {
      const res = await authAPI.updateProfile(data);
      dispatch({ type: 'UPDATE_USER', payload: res.user });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
