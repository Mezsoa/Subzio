import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

interface SecurityEvent {
  type: 'login' | 'logout' | 'failed_login' | 'data_access' | 'data_export' | 'data_deletion' | 'mfa_enabled' | 'mfa_disabled' | 'password_change' | 'account_locked';
  user_id?: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Get the authenticated user (if any)
    const { data: { user } } = await supabase.auth.getUser();
    
    const event: SecurityEvent = await request.json();
    
    // Validate required fields
    if (!event.type || !event.ip_address || !event.user_agent || !event.timestamp || !event.severity) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'Event must include type, ip_address, user_agent, timestamp, and severity'
      }, { status: 400 });
    }

    // Add user_id if authenticated
    if (user) {
      event.user_id = user.id;
    }

    // Log security event
    console.log(`[SECURITY] ${event.severity.toUpperCase()} - ${event.type}:`, {
      user_id: event.user_id,
      ip_address: event.ip_address,
      user_agent: event.user_agent,
      timestamp: event.timestamp,
      details: event.details
    });

    // For high/critical events, you might want to:
    // - Send alerts to security team
    // - Store in dedicated security monitoring system
    // - Trigger additional security measures
    
    if (event.severity === 'critical' || event.severity === 'high') {
      // Log to external security monitoring service
      console.log(`[SECURITY ALERT] High severity event detected: ${event.type}`);
      
      // You could integrate with services like:
      // - Sentry for error tracking
      // - DataDog for monitoring
      // - Custom security dashboard
      // - Email/SMS alerts
    }

    return NextResponse.json({ 
      success: true,
      message: 'Security event logged successfully'
    });

  } catch (error) {
    console.error("[SECURITY] Error logging security event:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Failed to log security event'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'You must be logged in to view security events'
      }, { status: 401 });
    }

    // In a real implementation, you would query your security events database
    // For now, we'll return a mock response
    const mockEvents = [
      {
        id: '1',
        type: 'login',
        user_id: user.id,
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0...',
        timestamp: new Date().toISOString(),
        severity: 'low'
      },
      {
        id: '2',
        type: 'data_access',
        user_id: user.id,
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        severity: 'medium'
      }
    ];

    return NextResponse.json({ 
      success: true,
      events: mockEvents,
      message: 'Security events retrieved successfully'
    });

  } catch (error) {
    console.error("[SECURITY] Error retrieving security events:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Failed to retrieve security events'
    }, { status: 500 });
  }
}
