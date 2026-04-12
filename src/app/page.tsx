
"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in-up">
            <Zap className="w-3 h-3 fill-current" />
            AI-Powered Fashion Stylist
          </div>
          
          <h1 className="text-5xl md:text-8xl font-headline font-bold leading-tight mb-6 animate-fade-in-up [animation-delay:100ms]">
            Bhai, no fit? <br />
            <span className="text-primary italic">We got you.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up [animation-delay:200ms]">
            Stop stressing about what to wear. DripAdvisor AI crafts the perfect look for your body, budget, and vibe in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms]">
            <Button asChild size="lg" className="h-14 px-8 bg-primary text-background font-bold hover:bg-primary/90 text-lg rounded-full shadow-lg shadow-primary/20">
              <Link href="/generate">
                Get My Drip <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 border-white/10 hover:bg-white/5 rounded-full">
              Explore Trends
            </Button>
          </div>

          {/* Quick Occasion Tags */}
          <div className="mt-16 flex flex-wrap justify-center gap-3 animate-fade-in-up [animation-delay:400ms]">
            {['College', 'Date Night', 'Gym', 'Wedding', 'Office', 'Clubbing'].map((occ) => (
              <span key={occ} className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-sm hover:border-primary/50 transition-colors cursor-pointer">
                #{occ}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-headline text-primary">50K+</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Fits Styled</p>
            </div>
            <div>
              <p className="text-3xl font-headline text-primary">4.9/5</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">User Rating</p>
            </div>
            <div>
              <p className="text-3xl font-headline text-primary">100+</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Brands</p>
            </div>
            <div>
              <p className="text-3xl font-headline text-primary">Secs</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Time to Drip</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-headline mb-4">Why DripAdvisor?</h2>
          <p className="text-muted-foreground">The ultimate tool for the modern wardrobe.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Stylist</h3>
            <p className="text-muted-foreground leading-relaxed">Personalized suggestions tailored to your height, weight, and style preference.</p>
          </div>
          
          <div className="p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
              <ShoppingBag className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Shop</h3>
            <p className="text-muted-foreground leading-relaxed">Direct links to Amazon, Myntra, and Ajio so you can secure the look immediately.</p>
          </div>
          
          <div className="p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Indian Brands</h3>
            <p className="text-muted-foreground leading-relaxed">Focused on local trends and brands that ship to your doorstep in India.</p>
          </div>
        </div>
      </section>

      <footer className="mt-auto py-12 border-t border-white/5">
        <div className="container mx-auto px-4 flex flex-col md:row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-background" />
            </div>
            <span className="font-headline font-bold text-lg">DRIPADVISOR AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 DripAdvisor. No fit left behind.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
