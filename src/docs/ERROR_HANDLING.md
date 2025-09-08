# Error Handling System Documentation

## Overview

KillSub now has a comprehensive error handling system that provides graceful error recovery, user-friendly error messages, and proper error tracking. The system consists of multiple layers:

1. **Error Boundaries** - Catch React component errors
2. **Error Context** - Global error notification system
3. **Error Hooks** - Reusable error handling logic
4. **API Error Handling** - Specialized handling for API errors

## Components

### 1. ErrorBoundary

The main error boundary that catches JavaScript errors anywhere in the component tree.

**Features:**
- Catches and displays React component errors
- Provides retry functionality
- Shows error details in development
- Generates unique error IDs for tracking
- Reports errors to external services (configurable)

**Usage:**
```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 2. ApiErrorBoundary

Specialized error boundary for API-related errors with network detection.

**Features:**
- Detects network errors automatically
- Auto-retries when connection is restored
- Shows different UI for online/offline states
- Limits retry attempts
- Handles rate limiting and timeout errors

**Usage:**
```tsx
import ApiErrorBoundary from '@/components/ApiErrorBoundary';

<ApiErrorBoundary>
  <ApiComponent />
</ApiErrorBoundary>
```

### 3. Error Context & Notifications

Global error notification system with toast-style notifications.

**Features:**
- Toast notifications for errors, success, warnings, and info
- Auto-dismiss with configurable duration
- Action buttons for retry functionality
- Persistent notifications for critical errors
- Maximum notification limit

**Usage:**
```tsx
import { useErrorNotifications } from '@/contexts/ErrorContext';

const { showError, showSuccess, showWarning, showInfo } = useErrorNotifications();

// Show notifications
showError("Something went wrong", "Error Title");
showSuccess("Operation completed successfully");
showWarning("Please check your input");
showInfo("New feature available");
```

### 4. Error Hooks

Reusable hooks for consistent error handling across components.

**useErrorHandler:**
```tsx
import { useErrorHandler } from '@/hooks/useErrorHandler';

const { error, hasError, setError, clearError, handleError, handleApiError } = useErrorHandler();

// Handle any error
handleError(someError, "Fallback message");

// Handle API errors with specific logic
handleApiError(apiError, "API context");
```

**useAsyncErrorHandler:**
```tsx
import { useAsyncErrorHandler } from '@/hooks/useErrorHandler';

const { executeAsync, ...errorHandler } = useAsyncErrorHandler();

// Execute async operations with automatic error handling
const result = await executeAsync(
  () => fetch('/api/data'),
  "Data fetching"
);
```

## Implementation Examples

### 1. Form with Error Handling

```tsx
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useErrorNotifications } from '@/contexts/ErrorContext';

function MyForm() {
  const { handleApiError, clearError } = useErrorHandler();
  const { showSuccess, showError } = useErrorNotifications();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Submission failed');
      }
      
      showSuccess('Form submitted successfully!');
    } catch (error) {
      handleApiError(error, 'Form submission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### 2. Component with Error Boundary

```tsx
import { withErrorBoundary } from '@/components/withErrorBoundary';

function MyComponent() {
  // Component logic
}

// Wrap with error boundary
export default withErrorBoundary(MyComponent, {
  fallback: ({ error, retry }) => (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={retry}>Try Again</button>
    </div>
  )
});
```

### 3. API Component with Specialized Error Handling

```tsx
import { withApiErrorBoundary } from '@/components/withErrorBoundary';

function ApiComponent() {
  // API logic
}

// Wrap with API error boundary
export default withApiErrorBoundary(ApiComponent, {
  onRetry: () => {
    // Custom retry logic
  }
});
```

## Error Types and Handling

### Network Errors
- Automatically detected and handled
- Shows offline/online status
- Auto-retries when connection restored

### Authentication Errors
- Redirects to sign-in page
- Shows appropriate error message
- Clears invalid session data

### Rate Limiting
- Shows user-friendly message
- Suggests waiting before retry
- Tracks retry attempts

### Server Errors (5xx)
- Shows generic server error message
- Logs detailed error for debugging
- Provides retry option

### Client Errors (4xx)
- Shows specific error messages
- Handles 401, 403, 404 appropriately
- Provides actionable feedback

## Configuration

### Error Reporting
Configure error reporting in production by updating the `reportError` method in `ErrorBoundary.tsx`:

```tsx
private reportError = (error: Error, errorInfo: ErrorInfo) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to Sentry, LogRocket, etc.
    Sentry.captureException(error, { extra: errorInfo });
  }
};
```

### Notification Settings
Configure notification behavior in `ErrorContext.tsx`:

```tsx
<ErrorProvider maxNotifications={5}>
  <App />
</ErrorProvider>
```

## Best Practices

1. **Use Error Boundaries** - Wrap major sections of your app
2. **Handle Errors Locally** - Use hooks for component-level error handling
3. **Show User-Friendly Messages** - Avoid technical jargon
4. **Provide Recovery Options** - Always offer retry or alternative actions
5. **Log Errors Properly** - Include context and user actions
6. **Test Error Scenarios** - Simulate network failures and API errors

## Migration Guide

To migrate existing error handling:

1. **Replace try-catch blocks** with `useErrorHandler` hook
2. **Add Error Boundaries** around major components
3. **Replace alert() calls** with notification system
4. **Update error messages** to be user-friendly
5. **Add retry mechanisms** where appropriate

## Testing

Test error handling by:

1. **Network failures** - Disable network in dev tools
2. **API errors** - Mock failing API responses
3. **Component errors** - Throw errors in components
4. **Authentication failures** - Expire tokens
5. **Rate limiting** - Make rapid API calls

## Monitoring

Monitor error handling effectiveness:

1. **Error rates** - Track error frequency
2. **Recovery rates** - How often users retry successfully
3. **User feedback** - Are error messages helpful?
4. **Performance impact** - Does error handling slow the app?

This error handling system provides a robust foundation for production-ready error management in KillSub.
