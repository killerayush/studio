
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, User, ShoppingBag } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-background" />
          </div>
          <span className="font-headline text-xl text-primary font-bold tracking-tighter">
            DRIPADVISOR
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/generate" className="hover:text-primary transition-colors">Generate Fit</Link>
          <Link href="/trends" className="hover:text-primary transition-colors">Trends</Link>
          <Link href="/about" className="hover:text-primary transition-colors">How it Works</Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
            <User className="w-4 h-4" />
            Login
          </Button>
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5">
            <Sparkles className="w-4 h-4" />
            Get My Drip
          </Button>
        </div>
      </div>
    </nav>
  );
}
