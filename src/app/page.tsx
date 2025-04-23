"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { ArrowRight, CheckCircle, Sparkles, LightbulbIcon, Shield, BookOpen, Clock, Search, Plus } from "lucide-react";
import { type Feature } from "@/types/hero";

/**
 * Home page component showcasing the Resummarize application
 * 
 * @returns The landing page component with hero section, features, and CTA
 */
export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-background ">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className=" px-4 pt-16 pb-24 md:pt-24 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-5xl mx-auto text-center space-y-8"
          >
            {/* Floating badge */}
            <div className="flex justify-center">
              <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary inline-flex items-center gap-1.5 mb-2">
                <Sparkles size={14} className="animate-pulse" />
                New AI Summaries Available
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
              Transform your notes with 
              <span className="bg-gradient-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent"> empathy</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Get thoughtful, personalized summaries that capture what truly matters to you.
              Focus on thinking, let AI handle the organizing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                size="lg"
                onClick={() => router.push("/auth?mode=signup")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-md h-12 text-base"
              >
                Start for free <ArrowRight size={16} className="ml-2" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("#features")}
                className="border-primary/20 hover:bg-primary/5 rounded-md h-12 text-base"
              >
                See how it works
              </Button>
            </div>
          </motion.div>
        </section>
        
        {/* App Preview */}
        <section className="bg-gradient-to-b from-background to-muted/30 py-16 md:py-24">
          <div className=" px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="max-w-5xl mx-auto"
            >
              <DashboardMockup />
            </motion.div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className=" px-4 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Designed for clarity and focus</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform combines cutting-edge AI with thoughtful design to help you capture insights from your notes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="bg-muted/30 py-20">
          <div className=" px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">What people are saying</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of users who have transformed their note-taking experience.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={index} {...testimonial} />
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto text-center space-y-8 bg-gradient-to-b from-muted/0 via-primary/5 to-muted/0 p-8 md:p-12 rounded-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to transform your notes?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join now and get started. No credit card required.
            </p>
            
            <div className="pt-4">
              <Button
                size="lg"
                onClick={() => router.push("/auth?mode=signup")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-md h-12 text-base"
              >
                Get started <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <p className="flex items-center text-sm text-muted-foreground">
                <CheckCircle size={14} className="mr-1 text-green-500" /> Free to use
              </p>
              <p className="flex items-center text-sm text-muted-foreground">
                <CheckCircle size={14} className="mr-1 text-green-500" /> No credit card
              </p>
              <p className="flex items-center text-sm text-muted-foreground">
                <CheckCircle size={14} className="mr-1 text-green-500" /> Secure and private
              </p>
            </div>
          </motion.div>
        </section>
      </main>
      
      {/* Footer - Simplified */}
      <footer className="border-t border-border">
        <div className=" px-4 py-8">
          <div className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Resummarize — Powered by advanced AI technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Dashboard mockup component that shows a visual representation of the app
 */
function DashboardMockup() {
  return (
    <Card className="overflow-hidden border border-border/40 shadow-xl dark:shadow-primary/10 rounded-xl">
      <div className="p-3 border-b border-border/30 bg-muted/30 flex items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        <div className="mx-auto pr-6 text-xs font-medium text-muted-foreground">Resummarize Dashboard</div>
      </div>
      
      <CardContent className="p-0">
        <div className="bg-background p-6">
          {/* Metrics Row */}
          <div className="mb-6">
            <div className="h-6 w-1/4 bg-muted/70 rounded-md mb-5"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-border/60 rounded-lg p-5">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-muted/60 rounded"></div>
                      <div className="h-6 w-12 bg-muted/80 rounded"></div>
                      <div className="h-2 w-20 bg-muted/40 rounded"></div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {i === 0 && <BookOpen size={16} className="text-primary" />}
                      {i === 1 && <Clock size={16} className="text-amber-500" />}
                      {i === 2 && <Sparkles size={16} className="text-violet-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Notes Section */}
          <div className="border border-border/60 rounded-xl">
            {/* Header with search and new note */}
            <div className="p-5 border-b border-border/60 flex flex-wrap md:flex-nowrap justify-between gap-4">
              <div>
                <div className="h-5 w-24 bg-muted/80 rounded mb-1"></div>
                <div className="h-3 w-32 bg-muted/50 rounded"></div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-48">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <div className="h-9 bg-muted/20 border border-border/60 rounded-md pl-10"></div>
                </div>
                <div className="h-9 w-28 bg-primary rounded-md flex items-center justify-center">
                  <Plus size={14} className="mr-1 text-primary-foreground" />
                  <div className="h-3 w-16 bg-primary-foreground/80 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="px-5 border-b border-border/60">
              <div className="flex">
                {["All Notes", "Recent", "Starred"].map((tab, i) => (
                  <div 
                    key={i} 
                    className={`py-3 px-4 ${i === 0 ? 'border-b-2 border-primary bg-primary/5 text-primary' : 'text-muted-foreground'}`}
                  >
                    {tab}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Notes grid */}
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border border-border/60 rounded-lg p-4 hover:border-primary/40 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-4 w-32 bg-muted/80 rounded"></div>
                      <div className="h-6 w-6 rounded-md"></div>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <div className="h-3 w-full bg-muted/50 rounded"></div>
                      <div className="h-3 w-11/12 bg-muted/50 rounded"></div>
                      <div className="h-3 w-4/5 bg-muted/50 rounded"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-16 bg-muted/40 rounded"></div>
                      {i % 3 === 0 && (
                        <div className="flex items-center gap-1">
                          <Sparkles size={10} className="text-primary" />
                          <div className="h-2 w-12 bg-primary/40 rounded"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Floating AI Button */}
          <div className="flex justify-end mt-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Sparkles size={18} className="text-primary-foreground" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Feature card component
 */
function FeatureCard({ icon, title, description }: Feature) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-violet-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative p-6 rounded-xl border border-border/40 bg-background/80 backdrop-blur-sm hover:border-primary/20 transition-colors">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 text-primary">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

/**
 * Testimonial card component
 */
function TestimonialCard({ name, role, content }: {
  name: string;
  role: string;
  content: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="p-6 rounded-xl border border-border/40 bg-background/80"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="text-primary font-semibold">
            {name.charAt(0)}
          </div>
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{content}</p>
    </motion.div>
  );
}

// Features data
const features: Feature[] = [
  {
    icon: <LightbulbIcon className="w-6 h-6" />,
    title: "AI-Powered Insights",
    description: "Extract the essence of your notes with our advanced AI summarization technology that understands context and sentiment."
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Seamless Organization",
    description: "Keep thoughts organized with intuitive categorization and smart tagging that adapts to your personal workflow."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure by Default",
    description: "Your notes stay private with end-to-end encryption and secure authentication. We never sell your data."
  }
];

// Testimonials data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    content: "Resummarize has transformed how I capture meeting notes. The AI summaries help me identify action items I would have missed otherwise."
  },
  {
    name: "Alex Chen",
    role: "Software Engineer",
    content: "I use it for documenting complex technical decisions. The AI understands technical jargon and summarizes key points perfectly."
  },
  {
    name: "Maya Rodriguez",
    role: "Student",
    content: "Taking lecture notes used to be overwhelming. Now I can write freely and let Resummarize organize everything for easy review later."
  }
];