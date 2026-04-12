
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, User, ShoppingBag } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-6 h-6 text-background" />
          </div>
          <span className="font-headline text-2xl text-primary font-extrabold tracking-tighter">
            VYXEN
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-sm font-semibold tracking-wide uppercase">
          <Link href="/generate" className="hover:text-primary transition-colors">Style Me</Link>
          <Link href="/trends" className="hover:text-primary transition-colors">Drip Feed</Link>
          <Link href="/about" className="hover:text-primary transition-colors">The Engine</Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-muted-foreground hover:text-primary">
            <User className="w-4 h-4" />
            Login
          </Button>
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-bold h-10 gold-glow">
            <Sparkles className="w-4 h-4 fill-current" />
            GET FIT
          </Button>
        </div>
      </div>
    </nav>
  );
}
