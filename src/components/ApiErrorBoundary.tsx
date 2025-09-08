"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOnline: boolean;
  retryCount: number;
}

class ApiErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private retryTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ApiErrorBoundary caught an error:', error, errorInfo);
    
    // Check if it's a network-related error
    const isNetworkError = this.isNetworkError(error);
    
    if (isNetworkError) {
      this.handleNetworkError();
    }
  }

  componentDidMount() {
    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
    
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private isNetworkError = (error: Error): boolean => {
    const networkErrorMessages = [
      'fetch',
      'network',
      'connection',
      'timeout',
      'offline',
      'failed to fetch',
      'network error',
    ];
    
    const errorMessage = error.message.toLowerCase();
    return networkErrorMessages.some(msg => errorMessage.includes(msg));
  };

  private handleNetworkError = () => {
    this.setState({ isOnline: false });
  };

  private handleOnline = () => {
    this.setState({ isOnline: true });
    // Auto-retry when coming back online
    if (this.state.hasError && this.state.retryCount < this.maxRetries) {
      this.handleRetry();
    }
  };

  private handleOffline = () => {
    this.setState({ isOnline: false });
  };

  private handleRetry = () => {
    if (this.state.retryCount >= this.maxRetries) {
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      retryCount: prevState.retryCount + 1,
    }));

    // Call custom retry handler if provided
    this.props.onRetry?.();
  };

  private handleManualRetry = () => {
    this.handleRetry();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, isOnline, retryCount } = this.state;
      const canRetry = retryCount < this.maxRetries;
      const isNetworkError = error ? this.isNetworkError(error) : false;

      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {isOnline ? (
              <AlertCircle className="w-6 h-6 text-red-600" />
            ) : (
              <WifiOff className="w-6 h-6 text-red-600" />
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            {isOnline ? 'Connection Error' : 'You\'re Offline'}
          </h3>
          
          <p className="text-red-700 mb-4">
            {isOnline 
              ? 'There was a problem connecting to our servers. Please try again.'
              : 'Please check your internet connection and try again.'
            }
          </p>

          {isNetworkError && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-red-800 text-sm">
                <Wifi className="w-4 h-4" />
                <span>Network issue detected</span>
              </div>
            </div>
          )}

          {canRetry && this.props.showRetryButton !== false && (
            <button
              onClick={this.handleManualRetry}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again ({this.maxRetries - retryCount} attempts left)
            </button>
          )}

          {!canRetry && (
            <div className="text-red-600 text-sm">
              Maximum retry attempts reached. Please refresh the page or contact support.
            </div>
          )}

          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm font-medium text-red-800">
                Error Details (Development)
              </summary>
              <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded text-xs font-mono text-red-800">
                {error.message}
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ApiErrorBoundary;
