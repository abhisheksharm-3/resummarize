"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";

/**
 * Authentication Error Page
 * 
 * @description Displays when an OAuth authentication flow fails with detailed explanations
 * and recovery options for users
 */
export default function AuthCodeErrorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRetry = () => {
    setIsLoading(true);
    // Redirect to login page after short delay
    setTimeout(() => {
      router.push("/auth?mode=login");
    }, 500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/60 shadow-md">
            <CardHeader className="pb-4 flex flex-col items-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-center">Authentication Error</h1>
            </CardHeader>
            
            <CardContent className="space-y-4 text-center pb-6">
              <p className="text-muted-foreground">
                There was a problem with your authentication process. This could be due to:
              </p>
              
              <ul className="text-sm text-left space-y-2 pl-6 pt-2">
                <li className="list-disc text-muted-foreground">An expired authentication session</li>
                <li className="list-disc text-muted-foreground">Invalid or missing authentication tokens</li>
                <li className="list-disc text-muted-foreground">A third-party authentication service issue</li>
                <li className="list-disc text-muted-foreground">Network connectivity problems</li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-border/40">
                <p className="text-sm text-muted-foreground">
                  Error occurred at:<br />
                  <span className="font-mono bg-muted/30 px-2 py-0.5 rounded text-xs">2025-04-23 13:19:02 UTC</span>
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Reference ID: abhisheksharm-3auth-code-error
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              
              <Button
                className="w-full sm:w-auto"
                onClick={handleRetry}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Need help? <Link href="/support" className="text-primary hover:underline">Contact Support</Link>
          </p>
        </motion.div>
      </main>
      
      <footer className="border-t border-border">
        <div className="container px-4 py-8">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Resummarize — Powered by advanced AI technology
          </p>
        </div>
      </footer>
    </div>
  );
}