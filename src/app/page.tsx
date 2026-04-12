
"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingBag, ArrowRight, Zap, Globe, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 md:pt-56 md:pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[140px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass text-primary text-xs font-bold uppercase tracking-widest mb-10 animate-fade-in-up gold-glow">
            <Zap className="w-3 h-3 fill-current" />
            Next-Gen AI Stylist
          </div>
          
          <h1 className="text-6xl md:text-[120px] font-headline font-extrabold leading-[0.9] mb-8 animate-fade-in-up [animation-delay:100ms] tracking-tighter">
            Bhai, no fit? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary italic">Vyxen it.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-fade-in-up [animation-delay:200ms] font-medium">
            AI builds your perfect outfit based on your vibe, body & occasion — instantly. Built different. Styled smarter.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up [animation-delay:300ms]">
            <Button asChild size="lg" className="h-16 px-10 bg-primary text-background font-black hover:bg-primary/90 text-xl rounded-full shadow-2xl shadow-primary/30 gold-glow group">
              <Link href="/generate" className="flex items-center">
                GET MY FIT <Rocket className="ml-3 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-10 border-white/10 hover:bg-white/5 rounded-full text-lg glass font-bold">
              Explore Trends
            </Button>
          </div>

          <div className="mt-24 flex flex-wrap justify-center gap-4 animate-fade-in-up [animation-delay:400ms]">
            {['Streetwear', 'Minimal', 'Desi', 'Formal', 'Gym'].map((style) => (
              <span key={style} className="px-6 py-3 rounded-full glass text-sm font-bold border-white/5 hover:border-primary/50 transition-all cursor-pointer hover:scale-105">
                #{style}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 container mx-auto px-4 border-t border-white/5">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-headline font-bold mb-6">Why VYXEN Wins?</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">Stop guessing. Start dressing. The ultimate AI engine for the modern wardrobe.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <Sparkles className="w-8 h-8 text-primary" />,
              title: "AI Visualizer",
              desc: "Don't just read about it. See your fit come to life with realistic AI-generated outfit previews.",
              color: "primary"
            },
            {
              icon: <ShoppingBag className="w-8 h-8 text-secondary" />,
              title: "Multi-Store Checkout",
              desc: "Instant links to Amazon, Myntra, Ajio, Flipkart, and more. Shop the exact vibe in one click.",
              color: "secondary"
            },
            {
              icon: <Globe className="w-8 h-8 text-primary" />,
              title: "Budget Engine",
              desc: "From budget-friendly bangers to premium drip, our AI calculates the total fit cost in real-time.",
              color: "primary"
            }
          ].map((feature, i) => (
            <div key={i} className="p-10 rounded-3xl glass hover:border-primary/40 transition-all group hover:-translate-y-2">
              <div className={`w-16 h-16 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-auto py-16 border-t border-white/5 bg-black">
        <div className="container mx-auto px-4 flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-background" />
            </div>
            <span className="font-headline font-black text-2xl tracking-tighter">VYXEN AI</span>
          </div>
          <p className="text-muted-foreground font-medium">© 2024 VYXEN. No fit left behind.</p>
          <div className="flex gap-10 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
