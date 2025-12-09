import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute

// In-memory store for rate limiting (use Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Bot detection patterns
const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python-requests',
  'scrapy', 'selenium', 'phantomjs', 'headless'
];

// Suspicious patterns
const SUSPICIOUS_PATTERNS = [
  /\.\.|\/\.\./g, // Path traversal
  /<script|javascript:|onerror=/i, // XSS attempts
  /union.*select|select.*from/i, // SQL injection
];

/**
 * Check if user agent is a known bot
 */
function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(pattern => ua.includes(pattern));
}

/**
 * Check if request contains suspicious patterns
 */
function hasSuspiciousPattern(url: string): boolean {
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(url));
}

/**
 * Rate limiting logic
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    // New window
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }

  record.count++;
  return true;
}

/**
 * Clean up old entries periodically
 */
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [ip, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(ip);
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }

  // 1. Bot Detection
  if (isBot(userAgent)) {
    // Allow legitimate search engine bots
    const legitimateBots = ['googlebot', 'bingbot', 'slurp', 'duckduckbot'];
    const isLegitimate = legitimateBots.some(bot => 
      userAgent.toLowerCase().includes(bot)
    );

    if (!isLegitimate) {
      console.warn(`Blocked suspicious bot: ${userAgent} from ${ip}`);
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // 2. Suspicious Pattern Detection
  const fullUrl = pathname + search;
  if (hasSuspiciousPattern(fullUrl)) {
    console.warn(`Blocked suspicious request: ${fullUrl} from ${ip}`);
    return new NextResponse('Bad Request', { status: 400 });
  }

  // 3. Rate Limiting
  if (!checkRateLimit(ip)) {
    console.warn(`Rate limit exceeded for ${ip}`);
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '60',
      },
    });
  }

  // 4. Add security headers to response
  const response = NextResponse.next();
  
  // Additional runtime security headers
  response.headers.set('X-Request-ID', crypto.randomUUID());
  
  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
