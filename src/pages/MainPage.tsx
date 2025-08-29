import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { User, Post } from '../types';
import { Search, Users, FileText, LogOut, Eye, Mail, Phone, Building, RefreshCw } from 'lucide-react';

type DataType = 'users' | 'posts';

export function MainPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dataType, setDataType] = useState<DataType>('users');
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  const { 
    users, 
    posts, 
    loading, 
    error, 
    phone,
    setUsers, 
    setPosts, 
    setLoading, 
    setError,
    refreshData,
    logout 
  } = useAppContext();

  useEffect(() => {
    fetchData();
  }, [dataType]);

  // Auto-refresh when network is restored
  useEffect(() => {
    const handleNetworkRestore = () => {
      if (error) {
        fetchData();
      }
    };

    window.addEventListener('network-restored', handleNetworkRestore);
    return () => window.removeEventListener('network-restored', handleNetworkRestore);
  }, [error, dataType]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (dataType === 'users' && users.length === 0) {
        const usersData = await api.getUsers();
        setUsers(usersData);
      } else if (dataType === 'posts' && posts.length === 0) {
        const postsData = await api.getPosts();
        setPosts(postsData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    const data = dataType === 'users' ? users : posts;
    if (!searchTerm.trim()) return data;

    return data.filter((item) => {
      if (dataType === 'users') {
        const user = item as User;
        return (
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.company.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        const post = item as Post;
        return (
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.body.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    });
  }, [dataType, users, posts, searchTerm]);

  const handleItemClick = (id: number) => {
    navigate(`/detail/${dataType}/${id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading && (users.length === 0 && posts.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Demo App</h1>
              <span className="hidden sm:inline text-sm text-gray-500">|</span>
              <span className="hidden sm:inline text-sm text-gray-600">Welcome back!</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{phone}</span>
              <button
                onClick={refreshData}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Data Type Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setDataType('users')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  dataType === 'users'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Users ({users.length})
              </button>
              <button
                onClick={() => setDataType('posts')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  dataType === 'posts'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Posts ({posts.length})
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${dataType}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <div className={`${!isOnline ? 'opacity-75' : ''}`}>
              <ErrorMessage 
                message={`${error}${!isOnline ? ' (No internet connection)' : ''}`}
                onDismiss={() => setError(null)}
              />
            </div>
            <div className="mt-3 text-center">
              <button
                onClick={fetchData}
                disabled={!isOnline || loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                {loading ? 'Retrying...' : 'Try Again'}
              </button>
            </div>
          </div>
        )}

        {/* Data Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
            >
              {dataType === 'users' ? (
                <UserCard user={item as User} />
              ) : (
                <PostCard post={item as Post} />
              )}
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Click to view details
                </span>
                <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search terms or switch to {dataType === 'users' ? 'posts' : 'users'}.
            </p>
          </div>
        )}

        {/* Results Count */}
        {filteredData.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Showing {filteredData.length} of {dataType === 'users' ? users.length : posts.length} {dataType}
          </div>
        )}
      </main>
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-lg">
            {user.name.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <p className="text-gray-600 text-sm">@{user.username}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          {user.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {user.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Building className="w-4 h-4 mr-2" />
          {user.company.name}
        </div>
      </div>
    </>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
        {post.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
        {post.body}
      </p>
      <div className="text-xs text-gray-500">
        Post ID: {post.id} • User ID: {post.userId}
      </div>
    </>
  );
}