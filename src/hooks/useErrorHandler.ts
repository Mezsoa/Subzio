"use client";

import { useCallback, useState } from 'react';
import { AuthError } from '@/lib/authedFetch';

export interface ErrorState {
  error: string | null;
  hasError: boolean;
}

export interface UseErrorHandlerReturn {
  error: string | null;
  hasError: boolean;
  setError: (error: string | Error | null) => void;
  clearError: () => void;
  handleError: (error: unknown, fallbackMessage?: string) => void;
  handleApiError: (error: unknown, context?: string) => void;
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    hasError: false,
  });

  const setError = useCallback((error: string | Error | null) => {
    if (error === null) {
      setErrorState({ error: null, hasError: false });
    } else {
      const errorMessage = typeof error === 'string' ? error : error.message;
      setErrorState({ error: errorMessage, hasError: true });
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState({ error: null, hasError: false });
  }, []);

  const handleError = useCallback((error: unknown, fallbackMessage = 'An unexpected error occurred') => {
    console.error('Error handled by useErrorHandler:', error);
    
    if (error instanceof Error) {
      setError(error.message);
    } else if (typeof error === 'string') {
      setError(error);
    } else {
      setError(fallbackMessage);
    }
  }, [setError]);

  const handleApiError = useCallback((error: unknown, context = 'API request') => {
    console.error(`API Error in ${context}:`, error);
    
    // Handle specific error types
    if (error instanceof AuthError) {
      setError('Authentication failed. Please sign in again.');
      // Redirect to sign in page
      setTimeout(() => {
        window.location.href = '/auth/signin';
      }, 2000);
      return;
    }
    
    if (error instanceof Error) {
      // Handle network errors
      if (error.message.includes('fetch') || error.message.includes('network')) {
        setError('Network error. Please check your connection and try again.');
        return;
      }
      
      // Handle timeout errors
      if (error.message.includes('timeout')) {
        setError('Request timed out. Please try again.');
        return;
      }
      
      // Handle rate limiting
      if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
        setError('Too many requests. Please wait a moment and try again.');
        return;
      }
      
      // Handle server errors
      if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
        setError('Server error. Please try again later.');
        return;
      }
      
      // Handle not found errors
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        setError('The requested resource was not found.');
        return;
      }
      
      // Handle forbidden errors
      if (error.message.includes('403') || error.message.includes('Forbidden')) {
        setError('You don\'t have permission to perform this action.');
        return;
      }
      
      // Handle unauthorized errors
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        setError('Please sign in to continue.');
        return;
      }
      
      // Default to the error message
      setError(error.message);
    } else if (typeof error === 'string') {
      setError(error);
    } else {
      setError(`${context} failed. Please try again.`);
    }
  }, [setError]);

  return {
    error: errorState.error,
    hasError: errorState.hasError,
    setError,
    clearError,
    handleError,
    handleApiError,
  };
}

// Hook for handling async operations with error handling
export function useAsyncErrorHandler() {
  const errorHandler = useErrorHandler();
  
  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      errorHandler.clearError();
      return await asyncFn();
    } catch (error) {
      errorHandler.handleApiError(error, context);
      return null;
    }
  }, [errorHandler]);
  
  return {
    ...errorHandler,
    executeAsync,
  };
}
