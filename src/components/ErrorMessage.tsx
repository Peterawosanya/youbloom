import React from 'react';
import { AlertCircle, X, Wifi } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
  showNetworkHint?: boolean;
}

export function ErrorMessage({ 
  message, 
  onDismiss, 
  className = '',
  showNetworkHint = false 
}: ErrorMessageProps) {
  const isNetworkError = message.toLowerCase().includes('network') || 
                        message.toLowerCase().includes('timeout') ||
                        message.toLowerCase().includes('connection');

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        {isNetworkError ? (
          <Wifi className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className="text-red-800 text-sm font-medium">
            {isNetworkError ? 'Connection Error' : 'Error'}
          </p>
          <p className="text-red-700 text-sm mt-1">{message}</p>
          {isNetworkError && (
            <p className="text-red-600 text-xs mt-2">
              💡 This usually resolves automatically. Check your internet connection or try refreshing.
            </p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}