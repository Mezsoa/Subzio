"use client";
import { useState, useEffect } from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import SidebarNav from '@/components/SidebarNav';
import { useSidebar } from '@/contexts/SidebarContext';
import { authedFetch } from '@/lib/authedFetch';
import AppProviders from '@/components/AppProviders';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  UserX,
  Calendar,
  FileText
} from 'lucide-react';

interface CancellationRequest {
  id: string;
  subscription_name: string;
  subscription_details: any;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  notes?: string;
  assigned_to?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export default function CancellationRequestsPage() {
  const [requests, setRequests] = useState<CancellationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await authedFetch('/api/cancellation/request');
      
      if (!response.ok) {
        throw new Error('Failed to fetch cancellation requests');
      }
      
      const { requests } = await response.json();
      setRequests(requests);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <RequireAuth>
        <AppProviders>
          <div className={`min-h-screen bg-background-light transition-all duration-300 ${
            isCollapsed ? 'ml-16' : 'ml-64'
          }`}>
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
          <SidebarNav />
        </AppProviders>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <AppProviders>
      <div className={`min-h-screen bg-background-light transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header */}
        <header className="border-b border-border-light bg-background-light/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground-black">Cancellation Requests</h1>
                <p className="text-sm text-muted-light mt-1">Track your cancel-for-me service requests</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserX className="w-8 h-8 text-muted-light" />
              </div>
              <h3 className="text-lg font-medium text-foreground-black mb-2">No Cancellation Requests</h3>
              <p className="text-muted-light mb-6">You haven't submitted any cancellation requests yet.</p>
              <p className="text-sm text-muted-light">
                Use the "Cancel For Me" button on any subscription in your dashboard to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <h3 className="font-semibold text-foreground-black">
                          {request.subscription_name}
                        </h3>
                        <p className="text-sm text-muted-light">
                          Requested {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-light">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {new Date(request.created_at).toLocaleString()}</span>
                    </div>
                    
                    {request.completed_at && (
                      <div className="flex items-center space-x-2 text-sm text-muted-light">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed: {new Date(request.completed_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {request.notes && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-muted-light" />
                        <span className="text-sm font-medium text-foreground-black">Notes</span>
                      </div>
                      <p className="text-sm text-muted-light bg-background-light-mid/50 rounded-lg p-3">
                        {request.notes}
                      </p>
                    </div>
                  )}

                  {request.assigned_to && (
                    <div className="text-sm text-muted-light">
                      <span className="font-medium">Assigned to:</span> {request.assigned_to}
                    </div>
                  )}

                  {/* Status-specific messages */}
                  {request.status === 'pending' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-700">
                        Your request is in queue. Our team will start working on it within the next few hours.
                      </p>
                    </div>
                  )}

                  {request.status === 'in_progress' && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Our team is actively working on canceling your subscription. You'll receive an update soon.
                      </p>
                    </div>
                  )}

                  {request.status === 'completed' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        ✅ Successfully canceled! You should receive a confirmation email from the service provider.
                      </p>
                    </div>
                  )}

                  {request.status === 'failed' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">
                        We encountered issues canceling this subscription. Our team has sent you an email with next steps.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <SidebarNav />
      </AppProviders>
    </RequireAuth>
  );
}
