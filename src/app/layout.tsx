import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/react-query/QueryProvider";
import { ThemeProvider } from "./theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resummarize | Transform Your Notes with Empathy",
  description: "Transform your notes into thoughtful, personalized summaries that capture what truly matters to you. Resummarize helps you distill information with warmth and understanding.",
  keywords: ["summarization", "notes", "personal assistant", "AI summary", "empathetic summaries", "thoughtful insights"],
  authors: [{ name: "Resummarize team" }],
  openGraph: {
    title: "resummarize | Transform Your Notes with Empathy",
    description: "Transform your notes into thoughtful, personalized summaries that capture what truly matters to you.",
    url: "https://re-summarize.vercel.app",
    siteName: "resummarize",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "resummarize | Transform Your Notes with Empathy",
    description: "Transform your notes into thoughtful, personalized summaries that capture what truly matters to you.",
  },
  metadataBase: new URL("https://re-summarize.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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