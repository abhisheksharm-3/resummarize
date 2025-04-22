import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './src/services/supabase/middleware'

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth',
  '/',
];

export async function middleware(request: NextRequest) {
  // Check if the requested path matches any public route
  const { pathname } = request.nextUrl;
  
  // If the path is a public route, skip session update
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // For protected routes, update the session
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (svg, png, jpg, jpeg, gif, webp)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}