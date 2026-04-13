"use client";

import { GenerateOutfitOutput, GenerateOutfitInput } from "@/ai/flows/generate-personalized-outfit-suggestions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingBag, Lightbulb, ArrowRight, Info, AlertCircle, RefreshCw, Zap, Sparkles } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OutfitResultsProps {
  results: GenerateOutfitOutput;
  onRetry?: () => void;
  onStyleRetry: (style: GenerateOutfitInput['style']) => void;
}

export function OutfitResults({ results, onRetry, onStyleRetry }: OutfitResultsProps) {
  
  const platformOrder = ['amazon', 'myntra', 'ajio', 'flipkart', 'meesho', 'hm', 'zara', 'nykaa', 'tataCliq', 'snapdeal', 'vMart', 'bata'];
  
  return (
    <div className="space-y-16 animate-fade-in-up pb-20">
      {/* Smart Status Bar */}
      {results.isFallback && (
        <div className="max-w-4xl mx-auto glass border-primary/20 bg-primary/5 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 gold-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">VYXEN High Demand Mode</p>
              <p className="text-muted-foreground text-xs font-medium">Showing curated studio favorites for your vibe.</p>
            </div>
          </div>
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="h-10 border-primary/30 hover:bg-primary/10 text-primary font-bold gap-2 text-xs uppercase tracking-widest"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry AI Fit
          </Button>
        </div>
      )}

      {!results.isFallback && (
        <div className="max-w-4xl mx-auto glass border-secondary/20 bg-secondary/5 p-4 rounded-2xl flex items-center gap-3 neon-glow">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-secondary animate-pulse" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">AI Success Mode</p>
            <p className="text-muted-foreground text-xs font-medium">Your 1-of-1 personalized drips have been generated.</p>
          </div>
        </div>
      )}

      <div className="text-center space-y-6">
        <h2 className="text-5xl md:text-7xl font-headline font-black text-primary tracking-tighter uppercase">The Vyxen Drops</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-xl font-medium">
          {results.isFallback ? "Hand-picked studio essentials based on your style." : "Our AI engine just calculated your perfect look."}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {results.outfits.map((outfit, idx) => (
          <Card key={idx} className="glass border-white/5 overflow-hidden flex flex-col h-full shadow-2xl hover:border-primary/40 transition-all group rounded-[2.5rem]">
            {/* Full Outfit Image Visual */}
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
               <Image 
                src={outfit.imageUrl || `https://picsum.photos/seed/outfit-${idx}/800/1000`} 
                alt={outfit.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="bg-primary text-background px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest gold-glow self-start">
                  {outfit.type}
                </span>
                {!results.isFallback && (
                  <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/10 self-start">
                    AI Generated
                  </span>
                )}
              </div>
            </div>
            
            <CardHeader className="p-8 pb-4">
              <div className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase mb-2">✦ Studio Curated</div>
              <CardTitle className="text-3xl font-headline text-primary font-black">
                {outfit.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium flex items-start gap-3 pt-3">
                <Info className="w-5 h-5 shrink-0 text-primary mt-1" />
                <span className="italic leading-relaxed text-sm">"{outfit.styleTip}"</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8 flex-1 space-y-6">
              <div className="space-y-4">
                {outfit.items.map((item, itemIdx) => {
                  const availableLinks = platformOrder.filter(p => item.links[p as keyof typeof item.links]);
                  return (
                    <div key={itemIdx} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-4 hover:bg-white/[0.05] transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-1 block">{item.type}</span>
                          <h4 className="text-lg font-bold text-white leading-tight">{item.name}</h4>
                        </div>
                        <span className="text-primary font-black tracking-tight shrink-0">{item.price}</span>
                      </div>
                      
                      {/* Multi-store Buttons - Horizontal Scroll */}
                      {availableLinks.length > 0 && (
                        <div className="flex overflow-x-auto gap-2 pb-1 -mx-1 px-1 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                          {availableLinks.map(platform => (
                            <PlatformButton key={platform} href={item.links[platform as keyof typeof item.links]!} label={platform} />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium pt-2 mt-2 border-t border-white/5">
                        <Lightbulb className="w-3.5 h-3.5 text-primary" />
                        {item.itemTip}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            
            <div className="p-8 border-t border-white/5 bg-white/[0.03] mt-auto">
              <div className="flex justify-between items-center mb-6">
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Total Fit Value</span>
                <span className="text-2xl font-headline font-black text-primary">{outfit.totalPrice}</span>
              </div>
              <Button className="w-full h-14 bg-secondary hover:bg-secondary/80 text-white font-black rounded-2xl gap-3 text-lg neon-glow">
                <ShoppingBag className="w-6 h-6" />
                SECURE FULL FIT
                <ExternalLink className="w-5 h-5 ml-auto" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto pt-16 text-center space-y-6">
        <h3 className="text-xl font-headline font-bold uppercase tracking-widest text-muted-foreground">Not the vibe?</h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button onClick={() => onStyleRetry('Minimal')} variant="outline" className="glass h-12 rounded-xl text-base font-bold">Try a Minimal Fit</Button>
          <Button onClick={() => onStyleRetry('Streetwear')} variant="outline" className="glass h-12 rounded-xl text-base font-bold">Try a Streetwear Fit</Button>
          <Button onClick={() => onStyleRetry('Formal')} variant="outline" className="glass h-12 rounded-xl text-base font-bold">Try a Formal Fit</Button>
        </div>
      </div>

    </div>
  );
}

function PlatformButton({ href, label }: { href: string; label: string }) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      asChild 
      className="h-8 px-4 bg-white/5 border-white/10 hover:bg-primary/10 hover:border-primary/50 text-white hover:text-primary rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shrink-0"
    >
      <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
        {label}
        <ArrowRight className="w-2.5 h-2.5" />
      </a>
    </Button>
  );
}
