import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { User, Post } from '../types';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Building, 
  User as UserIcon,
  FileText,
  Calendar
} from 'lucide-react';

type DetailType = 'users' | 'posts';

export function DetailPage() {
  const { type, id } = useParams<{ type: DetailType; id: string }>();
  const navigate = useNavigate();
  const { users, posts } = useAppContext();
  const [item, setItem] = useState<User | Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id) {
      setError('Invalid URL parameters');
      return;
    }

    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      setError('Invalid ID parameter');
      return;
    }

    // Try to find item in existing data first
    let existingItem = null;
    if (type === 'users') {
      existingItem = users.find(u => u.id === itemId);
    } else if (type === 'posts') {
      existingItem = posts.find(p => p.id === itemId);
    }

    if (existingItem) {
      setItem(existingItem);
    } else {
      fetchItem(type, itemId);
    }
  }, [type, id, users, posts]);

  const fetchItem = async (itemType: DetailType, itemId: number) => {
    setLoading(true);
    setError(null);

    try {
      let data;
      if (itemType === 'users') {
        data = await api.getUser(itemId);
      } else {
        data = await api.getPost(itemId);
      }
      setItem(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch item';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/main');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <button
            onClick={handleBack}
            className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Main
          </button>
          <div>
            <ErrorMessage message={error} />
            <div className="mt-4 text-center">
              <button
                onClick={() => fetchItem(type!, parseInt(id!, 10))}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <button
            onClick={handleBack}
            className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Main
          </button>
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Item not found</h3>
            <p className="mt-2 text-gray-500">
              The requested {type?.slice(0, -1)} could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Main
        </button>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {type === 'users' ? (
            <UserDetail user={item as User} />
          ) : (
            <PostDetail post={item as Post} />
          )}
        </div>
      </div>
    </div>
  );
}

function UserDetail({ user }: { user: User }) {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-blue-100 text-lg">@{user.username}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-8">
        {/* Contact Information */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserIcon className="w-5 h-5 mr-2" />
            Contact Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <a 
                  href={`mailto:${user.email}`}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {user.email}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Phone</p>
                <a 
                  href={`tel:${user.phone}`}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {user.phone}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Website</p>
                <a 
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {user.website}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Address */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Address
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <address className="not-italic text-gray-700">
              {user.address.suite} {user.address.street}<br />
              {user.address.city}, {user.address.zipcode}
            </address>
            <p className="text-sm text-gray-500 mt-2">
              Coordinates: {user.address.geo.lat}, {user.address.geo.lng}
            </p>
          </div>
        </section>

        {/* Company */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Company
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 text-lg">{user.company.name}</h3>
            <p className="text-gray-700 italic mt-1">"{user.company.catchPhrase}"</p>
            <p className="text-gray-600 text-sm mt-2">{user.company.bs}</p>
          </div>
        </section>
      </div>
    </>
  );
}

function PostDetail({ post }: { post: Post }) {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                Post #{post.id}
              </span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                By User #{post.userId}
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight">{post.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Content
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              {post.body}
            </p>
          </div>
        </section>

        {/* Metadata */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Post ID: {post.id}
              </span>
              <span className="flex items-center">
                <UserIcon className="w-4 h-4 mr-1" />
                Author ID: {post.userId}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}