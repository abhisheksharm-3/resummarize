import { createClient } from '@/services/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Authentication callback handler for processing OAuth code exchanges
 * 
 * @description Handles the OAuth callback by exchanging the authorization code
 * for a session through Supabase auth. After successful authentication,
 * redirects the user to the specified page or dashboard by default.
 * 
 * @param request - Incoming request object containing the auth code
 * @returns A redirect response to either the target page or an error page
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const next = url.searchParams.get('next') ?? '/dashboard'
    const origin = url.origin

    // If no code is provided, redirect to error page
    if (!code) {
      return createRedirectResponse(`${origin}/auth/auth-code-error`)
    }

    // Exchange the code for a session
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    // If exchange failed, redirect to error page
    if (error) {
      console.error('Auth code exchange error:', error.message)
      return createRedirectResponse(`${origin}/auth/auth-code-error`)
    }

    // Authentication successful, determine the correct redirect URL
    return createRedirectResponse(determineRedirectUrl(request, origin, next))
  } catch (error) {
    console.error('Unexpected error during auth callback:', error)
    return createRedirectResponse(`${new URL(request.url).origin}/auth/auth-code-error`)
  }
}

/**
 * Determines the appropriate redirect URL based on environment and request headers
 * 
 * @param request - The original request object
 * @param origin - The origin of the request
 * @param path - The path to redirect to
 * @returns The complete redirect URL
 */
function determineRedirectUrl(request: Request, origin: string, path: string): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  if (isLocalEnv) {
    // Local environment: use original origin
    return `${origin}${path}`
  } 
  
  if (forwardedHost) {
    // Production behind load balancer: use forwarded host
    return `https://${forwardedHost}${path}`
  }
  
  // Default case: use original origin
  return `${origin}${path}`
}

/**
 * Creates a redirect response with the appropriate headers
 * 
 * @param url - The URL to redirect to
 * @returns A configured NextResponse object
 */
function createRedirectResponse(url: string): NextResponse {
  return NextResponse.redirect(url, {
    status: 302, // Temporary redirect
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}