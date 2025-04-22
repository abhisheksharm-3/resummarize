"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Feature, FeatureCardProps } from "@/types/hero";

const fadeInUpAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const scaleInAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay: 0.3, duration: 0.7 }
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="text-center p-6 rounded-xl border border-border/40 bg-background/50 hover:bg-muted/20 transition-colors">
    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);



export default function Home() {
  const router = useRouter();

  const features: Feature[] = [
    {
      icon: (
        <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI-Powered Insights",
      description: "Extract the essence of your notes with our advanced AI summarization technology"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: "Seamless Organization",
      description: "Keep thoughts organized with intuitive categorization and smart tagging"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Secure by Default",
      description: "Your notes stay private with end-to-end encryption and secure authentication"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20 lg:py-28">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <motion.div {...fadeInUpAnimation} className="space-y-8 text-center">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary">Introducing Resummarize</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent pb-2">
                Turn Chaos into Clarity
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered note-taking that automatically distills your thoughts into clear, 
              actionable summaries. Focus on thinking, let AI handle the organizing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                size="lg"
                onClick={() => router.push("/auth?mode=signup")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-md"
              >
                Get Started
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("#features")}
                className="border-primary/20 hover:bg-primary/5 rounded-md"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
          
          {/* App Preview */}
          <motion.div {...scaleInAnimation} className="mt-16 md:mt-24 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-indigo-300/10 to-primary/5 rounded-2xl transform rotate-1 blur-md dark:opacity-20"></div>
            <Card className="relative overflow-hidden border border-border/40 shadow-lg dark:shadow-primary/5 rounded-xl">
              <div className="p-3 border-b border-border/30 bg-muted/30 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="mx-auto pr-6 text-xs font-medium text-muted-foreground">Resummarize</div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 p-8">
                {/* Input Side */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-muted/70 rounded-md"></div>
                    <div className="h-4 w-full bg-muted/50 rounded-md"></div>
                    <div className="h-4 w-5/6 bg-muted/50 rounded-md"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted/50 rounded-md"></div>
                    <div className="h-4 w-4/5 bg-muted/50 rounded-md"></div>
                    <div className="h-4 w-full bg-muted/50 rounded-md"></div>
                  </div>
                  
                  <div className="h-24 bg-muted/30 border border-border/40 rounded-lg p-3">
                    <div className="h-4 w-1/3 bg-muted/50 rounded-md mb-2"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-muted/40 rounded-md"></div>
                      <div className="h-3 w-5/6 bg-muted/40 rounded-md"></div>
                    </div>
                  </div>
                </div>
                
                {/* Output Side */}
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium shrink-0 mt-1">AI</div>
                    <div className="grow p-4 bg-muted/20 border border-primary/10 rounded-lg">
                      <p className="text-xs font-medium text-primary mb-1">Smart Summary</p>
                      <div className="space-y-1.5">
                        <div className="h-3 w-full bg-muted/50 rounded-sm"></div>
                        <div className="h-3 w-11/12 bg-muted/50 rounded-sm"></div>
                        <div className="h-3 w-4/5 bg-muted/50 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { color: "green", width: "1/2" },
                      { color: "indigo", width: "3/5" },
                      { color: "amber", width: "2/3" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full bg-${item.color}-500/20 flex items-center justify-center`}>
                          <div className={`w-2 h-2 rounded-full bg-${item.color}-500`}></div>
                        </div>
                        <div className={`h-4 w-${item.width} bg-muted/50 rounded-md`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Features Section */}
          <motion.div
            {...fadeInUpAnimation}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-20 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8"
            id="features"
          >
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </motion.div>
          
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              Resummarize — Powered by advanced AI technology
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}