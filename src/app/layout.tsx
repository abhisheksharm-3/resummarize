import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/react-query/QueryProvider";
import { ThemeProvider } from "./theme-provider";
import "./globals.css";

/**
 * Font configuration for Geist Sans and Geist Mono
 * Using display: 'swap' for better performance during font loading
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Application metadata for SEO and social sharing
 */
export const metadata: Metadata = {
  title: "Resummarize | Transform Your Notes with Empathy",
  description: 
    "Transform your notes into thoughtful, personalized summaries that capture what truly matters to you. " +
    "Resummarize helps you distill information with warmth and understanding.",
  keywords: [
    "summarization", 
    "notes", 
    "personal assistant", 
    "AI summary", 
    "empathetic summaries", 
    "thoughtful insights",
    "note taking"
  ],
  authors: [{ name: "Resummarize team" }],
  creator: "Resummarize",
  publisher: "Resummarize",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Resummarize | Transform Your Notes with Empathy",
    description: "Transform your notes into thoughtful, personalized summaries that capture what truly matters to you.",
    url: "https://re-summarize.vercel.app",
    siteName: "Resummarize",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://re-summarize.vercel.app/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Resummarize Logo"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resummarize | Transform Your Notes with Empathy",
    description: "Transform your notes into thoughtful, personalized summaries that capture what truly matters to you.",
    images: ["https://re-summarize.vercel.app/og-image.png"],
  },
  metadataBase: new URL("https://re-summarize.vercel.app"),
};

/**
 * Viewport configuration for better mobile rendering
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" }
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * Root layout component that wraps the entire application
 * Provides theme context, query client, and font variables
 * 
 * @param props - Component properties
 * @param props.children - Child components to render within the layout
 * @returns The root layout structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}