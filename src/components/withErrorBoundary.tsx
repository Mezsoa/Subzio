"use client";

import React, { ComponentType } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ApiErrorBoundary from './ApiErrorBoundary';

interface WithErrorBoundaryOptions {
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
  apiErrorBoundary?: boolean;
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) {
  const {
    fallback,
    onError,
    resetOnPropsChange,
    resetKeys,
    apiErrorBoundary = false,
  } = options;

  const ComponentWithErrorBoundary = (props: P) => {
    const ErrorBoundaryComponent = apiErrorBoundary ? ApiErrorBoundary : ErrorBoundary;
    
    return (
      <ErrorBoundaryComponent
        fallback={fallback ? (error: Error, retry: () => void) => React.createElement(fallback, { error, retry }) : undefined}
        onError={onError}
        resetOnPropsChange={resetOnPropsChange}
        resetKeys={resetKeys}
      >
        <WrappedComponent {...props} />
      </ErrorBoundaryComponent>
    );
  };

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return ComponentWithErrorBoundary;
}

// Specific HOCs for common use cases
export const withApiErrorBoundary = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options: Omit<WithErrorBoundaryOptions, 'apiErrorBoundary'> = {}
) => {
  return withErrorBoundary(WrappedComponent, { ...options, apiErrorBoundary: true });
};

export const withDashboardErrorBoundary = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  return withErrorBoundary(WrappedComponent, {
    resetOnPropsChange: true,
    onError: (error, errorInfo) => {
      console.error('Dashboard Error:', error, errorInfo);
      // Could send to analytics service
    },
  });
};

export const withFormErrorBoundary = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  return withErrorBoundary(WrappedComponent, {
    resetKeys: ['formData', 'isSubmitting'],
    onError: (error, errorInfo) => {
      console.error('Form Error:', error, errorInfo);
    },
  });
};
