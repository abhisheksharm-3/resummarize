"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  MoonIcon, 
  SunIcon,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * User avatar component displayed in navigation
 * 
 * @param props Component props
 * @param props.email User's email address
 * @param props.size Size of avatar (default or small)
 * @returns React component
 */
const UserAvatar = ({ 
  email, 
  size = "default" 
}: { 
  email?: string | null; 
  size?: "default" | "small"; 
}) => {
  const initial = email?.[0]?.toUpperCase() || "U";
  
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium",
        size === "default" ? "h-10 w-10" : "h-8 w-8 text-sm"
      )}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
};

/**
 * Theme toggle button component
 * 
 * @param props Component props
 * @param props.className Additional CSS classes
 * @param props.size Button size variant
 * @returns React component
 */
const ThemeToggle = ({ 
  className, 
  size = "default" 
}: { 
  className?: string;
  size?: "default" | "small";
}) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size={size === "default" ? "icon" : "sm"}
      aria-label="Toggle theme"
      className={cn(
        size === "default" ? "size-10 rounded-md" : "size-9",
        className
      )}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="size-[18px] rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-[18px] rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle between dark and light mode</span>
    </Button>
  );
};

/**
 * Navigation link component
 * 
 * @param props Component props
 * @param props.href Link destination
 * @param props.children Link content
 * @param props.isActive Whether this link is active
 * @param props.onClick Optional click handler
 * @returns React component
 */
const NavLink = ({ 
  href, 
  children, 
  isActive, 
  onClick 
}: { 
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}) => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(href);
    if (onClick) onClick();
  };
  
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      onClick={handleClick}
      className="text-sm font-medium"
    >
      {children}
    </Button>
  );
};

/**
 * Main navigation bar component for the application.
 * Handles user authentication state, navigation, and theme switching.
 * Provides different views for mobile and desktop.
 * 
 * @returns React component
 */
export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Checks if the given path matches the current pathname
   * 
   * @param path The path to check
   * @returns True if current path matches
   */
  const isActive = (path: string): boolean => pathname === path;

  /**
   * Navigate to a path and close mobile menu
   * 
   * @param path The path to navigate to
   */
  const navigateTo = (path: string): void => {
    router.push(path);
    setIsOpen(false);
  };

  /**
   * Handle user logout
   */
  const handleSignOut = (): void => {
    signOut();
    setIsOpen(false);
  };

  // Current timestamp and user info for debugging (hidden in UI)
  const currentDateTime = "2025-04-23 13:44:29";
  const currentUser = "abhisheksharm-3";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex h-16 md:h-18 items-center justify-between py-2 md:py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            aria-label="Resummarize homepage"
          >
            <span className="text-xl font-semibold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
              Resummarize
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          {user ? (
            <div className="flex items-center gap-5">
              <div className="flex items-center space-x-2">
                <NavLink 
                  href="/dashboard" 
                  isActive={isActive("/dashboard")}
                >
                  Dashboard
                </NavLink>
              </div>

              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary" 
                    className="rounded-full size-10 p-0 focus-visible:ring-primary focus-visible:ring-offset-2"
                    aria-label="Open user menu"
                  >
                    <span className="sr-only">Open user menu</span>
                    <UserAvatar email={user.email} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-border/60 bg-card">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col">
                      <span className="font-medium">My Account</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-accent gap-2"
                    onClick={() => router.push("/dashboard")}
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              <Button
                variant="default"
                onClick={() => router.push("/auth?mode=login")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md px-6"
              >
                Get Started
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle size="small" className="mr-1" />
          
          {!user && (
            <Button
              variant="default"
              onClick={() => router.push("/auth?mode=login")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground mr-1"
              size="sm"
            >
              Get Started
            </Button>
          )}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="size-9 border-border/40"
                aria-label="Open mobile menu"
              >
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[80%] sm:w-[350px] border-l border-border/40 p-6"
            >
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                  Resummarize
                </SheetTitle>
              </SheetHeader>
              
              {user ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                    <UserAvatar email={user.email} />
                    <div className="truncate">
                      <p className="text-sm font-medium">Account</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <nav className="space-y-1">
                    <SheetClose asChild>
                      <Button
                        variant={isActive("/dashboard") ? "secondary" : "ghost"} 
                        onClick={() => navigateTo("/dashboard")}
                        className="w-full justify-start text-base h-12 gap-3"
                      >
                        <LayoutDashboard className="size-5" />
                        Dashboard
                      </Button>
                    </SheetClose>
                  </nav>
                  
                  <div className="pt-4 border-t border-border/40">
                    <SheetClose asChild>
                      <Button
                        variant="destructive"
                        onClick={handleSignOut}
                        className="w-full gap-2"
                      >
                        <LogOut className="size-4" />
                        Log out
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <p className="text-sm text-muted-foreground">
                    Experience the power of AI summarization and note taking
                  </p>
                  
                  <nav className="space-y-3 pt-2">
                    <SheetClose asChild>
                      <Button
                        variant="default"
                        onClick={() => navigateTo("/auth?mode=login")}
                        className="w-full bg-primary h-12"
                      >
                        Log in
                      </Button>
                    </SheetClose>
                    
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        onClick={() => navigateTo("/auth?mode=signup")}
                        className="w-full h-12 border-border"
                      >
                        Sign up
                      </Button>
                    </SheetClose>
                  </nav>
                </div>
              )}
              
              {/* Debug info - hidden */}
              <div className="text-[8px] text-muted-foreground/30 absolute bottom-2 left-3 hidden">
                {currentDateTime} - {currentUser}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};