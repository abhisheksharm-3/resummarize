import { createClient } from '@/services/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Authentication callback handler for processing OAuth code exchanges
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const next = url.searchParams.get('next') ?? '/dashboard'
    
    // If no code is provided, redirect to error page
    if (!code) {
      return createRedirectResponse(`${getBaseUrl(request)}/auth/auth-code-error`)
    }

    // Exchange the code for a session
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    // If exchange failed, redirect to error page
    if (error) {
      console.error('Auth code exchange error:', error.message)
      return createRedirectResponse(`${getBaseUrl(request)}/auth/auth-code-error`)
    }

    // Authentication successful, redirect to the specified path
    return createRedirectResponse(`${getBaseUrl(request)}${next}`)
  } catch (error) {
    console.error('Unexpected error during auth callback:', error)
    return createRedirectResponse(`${getBaseUrl(request)}/auth/auth-code-error`)
  }
}

/**
 * Gets the correct base URL for redirects, considering all environment variables
 * and request headers
 */
function getBaseUrl(request: Request): string {
  // Check for explicit production URL override (recommended solution)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  
  // Check for common header variations
  const forwardedHost = 
    request.headers.get('x-forwarded-host') || 
    request.headers.get('x-forwarded-server') ||
    request.headers.get('host')
    
  const protocol = 
    request.headers.get('x-forwarded-proto') === 'http' ? 'http' : 'https'

  if (forwardedHost) {
    return `${protocol}://${forwardedHost}`
  }
  
  // Last resort - use the request's URL origin
  // (Note: this might still be incorrect in production)
  return new URL(request.url).origin
}

/**
 * Creates a redirect response with the appropriate headers
 */
function createRedirectResponse(url: string): NextResponse {
  console.log('Redirecting to:', url) // Add logging to debug redirects
  return NextResponse.redirect(url, {
    status: 302,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}