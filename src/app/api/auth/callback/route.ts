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
      return createRedirectResponse(`${getBaseUrl()}/auth/auth-code-error`)
    }

    // Exchange the code for a session
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    // If exchange failed, redirect to error page
    if (error) {
      console.error('Auth code exchange error:', error.message)
      return createRedirectResponse(`${getBaseUrl()}/auth/auth-code-error`)
    }

    // Authentication successful, redirect to the specified path
    return createRedirectResponse(`${getBaseUrl()}${next}`)
  } catch (error) {
    console.error('Unexpected error during auth callback:', error)
    return createRedirectResponse(`${getBaseUrl()}/auth/auth-code-error`)
  }
}

/**
 * Gets the base URL from environment variables only
 */
function getBaseUrl(): string {
  // Use environment variable or fallback to a default
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
                  'http://localhost:3000'
                  
  // Remove trailing slash if present
  return baseUrl.replace(/\/$/, '')
}

/**
 * Creates a redirect response with the appropriate headers
 */
function createRedirectResponse(url: string): NextResponse {
  return NextResponse.redirect(url, {
    status: 302,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}