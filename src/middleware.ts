import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
  maxApiRequests: 200, // 200 API requests per window
  maxAuthRequests: 10, // 10 auth requests per window
};

function getRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return `${ip}-${userAgent}`;
}

function checkRateLimit(request: NextRequest, maxRequests: number): boolean {
  const key = getRateLimitKey(request);
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;
  
  const current = rateLimitStore.get(key);
  
  if (!current || current.resetTime < windowStart) {
    rateLimitStore.set(key, { count: 1, resetTime: now });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  rateLimitStore.set(key, current);
  return true;
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/');
}

function isAuthRoute(pathname: string): boolean {
  // Only apply restrictive rate limiting to API auth routes, not public auth pages
  return pathname.startsWith('/api/auth/');
}

function isSensitiveRoute(pathname: string): boolean {
  const sensitiveRoutes = [
    '/api/user/',
    '/api/plaid/',
    '/api/bankid/',
    '/dashboard',
    '/account',
    '/export'
  ];
  
  // Only include specific Stripe routes that need protection, not the callback
  if (pathname.startsWith('/api/stripe/')) {
    // Only protect these specific Stripe routes, not the callback
    const protectedStripeRoutes = [
      '/api/stripe/connect',
      '/api/stripe/status',
      '/api/stripe/disconnect',
      '/api/stripe/create-checkout',
      '/api/stripe/cancel-subscription'
    ];
    return protectedStripeRoutes.some(route => pathname.startsWith(route));
  }
  
  return sensitiveRoutes.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rate limiting
  let maxRequests = RATE_LIMIT.maxRequests;
  if (isApiRoute(pathname)) {
    maxRequests = RATE_LIMIT.maxApiRequests;
  }
  if (isAuthRoute(pathname)) {
    maxRequests = RATE_LIMIT.maxAuthRequests;
  }
  
  if (!checkRateLimit(request, maxRequests)) {
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT.windowMs).toISOString(),
      }
    });
  }

  // Authentication check for protected routes
  const protectedRoutes = ['/dashboard', '/analytics', '/export', '/account', '/alerts', '/cancel-service', '/cancellation-requests', '/onboarding'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    try {
      const supabase = await supabaseServer();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        // Redirect to signin if not authenticated
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
    } catch (error) {
      // If there's an error checking auth, redirect to signin
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  // Request validation for sensitive routes
  if (isSensitiveRoute(pathname)) {
    // Validate request method
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    if (!allowedMethods.includes(request.method)) {
      return new NextResponse('Method Not Allowed', { status: 405 });
    }
    
    // Validate content type for POST/PUT requests
    if (['POST', 'PUT'].includes(request.method)) {
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return new NextResponse('Invalid Content Type', { status: 400 });
      }
    }
    
    // Validate request size (max 1MB for API routes)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1024 * 1024) {
      return new NextResponse('Request Too Large', { status: 413 });
    }
  }

  // Create response
  const response = NextResponse.next()

  // Security Headers for Plaid Compliance
  const securityHeaders = {
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live https://vitals.vercel-insights.com https://js.stripe.com https://cdn.plaid.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://api.plaid.com https://api.tink.com https://api.stripe.com https://www.google-analytics.com https://vitals.vercel-insights.com https://region1.google-analytics.com https://va.vercel-scripts.com",
      "frame-src 'self' https://js.stripe.com https://cdn.plaid.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; '),
    
    // HTTP Strict Transport Security
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // XSS Protection
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    
    // Remove server information
    'Server': '',
  }

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
