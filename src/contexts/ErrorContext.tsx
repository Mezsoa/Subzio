"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertCircle, X, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export interface ErrorNotification {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

interface ErrorContextType {
  notifications: ErrorNotification[];
  addNotification: (notification: Omit<ErrorNotification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showError: (message: string, title?: string, options?: Partial<ErrorNotification>) => string;
  showSuccess: (message: string, title?: string, options?: Partial<ErrorNotification>) => string;
  showWarning: (message: string, title?: string, options?: Partial<ErrorNotification>) => string;
  showInfo: (message: string, title?: string, options?: Partial<ErrorNotification>) => string;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useErrorNotifications = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorNotifications must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
  maxNotifications?: number;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ 
  children, 
  maxNotifications = 5 
}) => {
  const [notifications, setNotifications] = useState<ErrorNotification[]>([]);

  const addNotification = useCallback((notification: Omit<ErrorNotification, 'id'>) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: ErrorNotification = {
      id,
      duration: 5000, // Default 5 seconds
      ...notification,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Limit the number of notifications
      return updated.slice(0, maxNotifications);
    });

    // Auto-remove notification after duration (unless persistent)
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, [maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const showError = useCallback((message: string, title = 'Error', options = {}) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 7000, // Errors stay longer
      ...options,
    });
  }, [addNotification]);

  const showSuccess = useCallback((message: string, title = 'Success', options = {}) => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration: 3000, // Success messages are shorter
      ...options,
    });
  }, [addNotification]);

  const showWarning = useCallback((message: string, title = 'Warning', options = {}) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 5000,
      ...options,
    });
  }, [addNotification]);

  const showInfo = useCallback((message: string, title = 'Info', options = {}) => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration: 4000,
      ...options,
    });
  }, [addNotification]);

  const value: ErrorContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <ErrorNotificationContainer />
    </ErrorContext.Provider>
  );
};

// Notification container component
const ErrorNotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useErrorNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map(notification => (
        <ErrorNotification
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

// Individual notification component
interface ErrorNotificationProps {
  notification: ErrorNotification;
  onRemove: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ 
  notification, 
  onRemove 
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-amber-800';
      case 'info':
        return 'text-blue-800';
      case 'success':
        return 'text-green-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className={`${getBackgroundColor()} border rounded-lg p-4 shadow-lg animate-in slide-in-from-right-full duration-300`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${getTextColor()}`}>
            {notification.title}
          </h4>
          <p className={`text-sm mt-1 ${getTextColor()} opacity-90`}>
            {notification.message}
          </p>
          
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className={`mt-2 text-sm font-medium ${getTextColor()} hover:opacity-80 transition-opacity`}
            >
              {notification.action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={onRemove}
          className={`flex-shrink-0 ${getTextColor()} hover:opacity-70 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
