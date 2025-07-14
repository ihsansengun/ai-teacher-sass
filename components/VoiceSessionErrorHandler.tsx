'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Mic, MicOff } from 'lucide-react';

interface VoiceSessionError {
  type: 'permission' | 'network' | 'session' | 'unknown';
  message: string;
  code?: string;
  details?: any;
}

interface VoiceSessionErrorHandlerProps {
  error: VoiceSessionError;
  onRetry?: () => void;
  onCancel?: () => void;
}

export const VoiceSessionErrorHandler: React.FC<VoiceSessionErrorHandlerProps> = ({
  error,
  onRetry,
  onCancel,
}) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'permission':
        return <MicOff className="w-8 h-8 text-red-600" />;
      case 'network':
        return <AlertTriangle className="w-8 h-8 text-orange-600" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-red-600" />;
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'permission':
        return 'Microphone Permission Required';
      case 'network':
        return 'Connection Problem';
      case 'session':
        return 'Session Error';
      default:
        return 'Voice Session Error';
    }
  };

  const getErrorDescription = () => {
    switch (error.type) {
      case 'permission':
        return 'Please allow microphone access to start voice sessions. Check your browser settings and try again.';
      case 'network':
        return 'There was a problem connecting to the voice service. Please check your internet connection and try again.';
      case 'session':
        return 'The voice session encountered an error. This might be due to usage limits or a temporary service issue.';
      default:
        return error.message || 'An unexpected error occurred during the voice session.';
    }
  };

  const getActionButtons = () => {
    switch (error.type) {
      case 'permission':
        return (
          <>
            <button
              onClick={() => {
                // Request microphone permission
                navigator.mediaDevices?.getUserMedia({ audio: true })
                  .then(() => onRetry?.())
                  .catch(console.error);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mic className="w-4 h-4 mr-2" />
              Grant Permission
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
          </>
        );
      case 'network':
        return (
          <>
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection
              </button>
            )}
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
          </>
        );
      default:
        return (
          <>
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            )}
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
          </>
        );
    }
  };

  return (
    <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getErrorIcon()}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {getErrorTitle()}
          </h3>
          <p className="text-gray-600 mb-4">
            {getErrorDescription()}
          </p>
          
          {/* Technical Details (Development) */}
          {process.env.NODE_ENV === 'development' && error.details && (
            <details className="mb-4">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                Technical Details
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 font-mono overflow-auto max-h-32">
                <pre>{JSON.stringify(error.details, null, 2)}</pre>
              </div>
            </details>
          )}
          
          <div className="flex flex-wrap gap-3">
            {getActionButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to create voice session errors
export const createVoiceSessionError = (
  type: VoiceSessionError['type'],
  message: string,
  details?: any,
  code?: string
): VoiceSessionError => ({
  type,
  message,
  details,
  code,
});

// Hook for handling voice session errors
export const useVoiceSessionErrorHandler = () => {
  const [error, setError] = React.useState<VoiceSessionError | null>(null);

  const handleError = React.useCallback((
    type: VoiceSessionError['type'],
    message: string,
    details?: any,
    code?: string
  ) => {
    const errorObj = createVoiceSessionError(type, message, details, code);
    console.error('Voice session error:', errorObj);
    setError(errorObj);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const handlePermissionError = React.useCallback((details?: any) => {
    handleError(
      'permission',
      'Microphone permission is required for voice sessions',
      details
    );
  }, [handleError]);

  const handleNetworkError = React.useCallback((details?: any) => {
    handleError(
      'network',
      'Unable to connect to voice service',
      details
    );
  }, [handleError]);

  const handleSessionError = React.useCallback((message: string, details?: any) => {
    handleError(
      'session',
      message,
      details
    );
  }, [handleError]);

  return {
    error,
    clearError,
    handleError,
    handlePermissionError,
    handleNetworkError,
    handleSessionError,
  };
};