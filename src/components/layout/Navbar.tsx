"use client";

import React from "react";
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

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const isActive = (path: string) => pathname === path;

  const navigateTo = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex h-16 md:h-18 items-center justify-between py-2 md:py-4 ">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
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
                <Button
                  variant={isActive("/dashboard") ? "secondary" : "ghost"}
                  onClick={() => router.push("/dashboard")}
                  className="text-sm font-medium"
                >
                  Dashboard
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                className="size-10 rounded-md"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <SunIcon className="size-[18px] rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute size-[18px] rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary" 
                    className="rounded-full size-10 p-0 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div
                      className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary font-medium"
                    >
                      {user.email?.[0].toUpperCase() || "U"}
                    </div>
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
                    className="cursor-pointer focus:bg-accent"
                    onClick={() => router.push("/dashboard")}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={() => {
                      signOut();
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                className="size-10 rounded-md"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <SunIcon className="size-[18px] rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute size-[18px] rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              
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
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="size-9 mr-1"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="size-[18px] rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute size-[18px] rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
          </Button>
          
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
              <Button variant="outline" size="icon" className="size-9 border-border/40">
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px] border-l border-border/40 p-6">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                  Resummarize
                </SheetTitle>
              </SheetHeader>
              
              {user ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium shrink-0"
                    >
                      {user.email?.[0].toUpperCase() || "U"}
                    </div>
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
                        className="w-full justify-start text-base h-12"
                      >
                        Dashboard
                      </Button>
                    </SheetClose>
                  </nav>
                  
                  <div className="pt-4 border-t border-border/40">
                    <SheetClose asChild>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          signOut();
                        }}
                        className="w-full"
                      >
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};