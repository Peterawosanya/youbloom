import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, User, Post } from '../types';
import { api } from '../services/api';

interface AppContextType extends AppState {
  login: (phone: string) => void;
  logout: () => void;
  setUsers: (users: User[]) => void;
  setPosts: (posts: Post[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshData: () => Promise<void>;
}

type AppAction =
  | { type: 'LOGIN'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  isLoggedIn: false,
  phone: null,
  users: [],
  posts: [],
  loading: false,
  error: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        phone: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        phone: null,
      };
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      };
    case 'SET_POSTS':
      return {
        ...state,
        posts: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist login state
  useEffect(() => {
    const savedPhone = localStorage.getItem('userPhone');
    if (savedPhone) {
      dispatch({ type: 'LOGIN', payload: savedPhone });
    }
  }, []);

  const login = (phone: string) => {
    localStorage.setItem('userPhone', phone);
    dispatch({ type: 'LOGIN', payload: phone });
  };

  const logout = () => {
    localStorage.removeItem('userPhone');
    dispatch({ type: 'LOGOUT' });
  };

  const setUsers = (users: User[]) => {
    dispatch({ type: 'SET_USERS', payload: users });
  };

  const setPosts = (posts: Post[]) => {
    dispatch({ type: 'SET_POSTS', payload: posts });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Clear cache and fetch fresh data
      api.clearCache();
      
      const [usersData, postsData] = await Promise.all([
        api.getUsers(),
        api.getPosts()
      ]);
      
      setUsers(usersData);
      setPosts(postsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AppContextType = {
    ...state,
    login,
    logout,
    setUsers,
    setPosts,
    setLoading,
    setError,
    refreshData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}