"use client";

import { GenerateOutfitOutput } from "@/ai/flows/generate-personalized-outfit-suggestions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingBag, Lightbulb, ArrowRight, Info } from "lucide-react";
import Image from "next/image";

interface OutfitResultsProps {
  results: GenerateOutfitOutput;
}

export function OutfitResults({ results }: OutfitResultsProps) {
  return (
    <div className="space-y-16 animate-fade-in-up pb-20">
      <div className="text-center space-y-6">
        <h2 className="text-5xl md:text-7xl font-headline font-black text-primary tracking-tighter uppercase">The Vyxen Drops</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-xl font-medium">
          Our AI engine just calculated your perfect looks. Secure the fit immediately.
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
              <div className="absolute top-6 left-6">
                <span className="bg-primary text-background px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest gold-glow">
                  {outfit.type}
                </span>
              </div>
            </div>
            
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-3xl font-headline text-primary font-black">
                {outfit.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium flex items-start gap-3 pt-3">
                <Info className="w-5 h-5 shrink-0 text-primary mt-1" />
                <span className="italic leading-relaxed">"{outfit.styleTip}"</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8 flex-1 space-y-6">
              <div className="space-y-4">
                {outfit.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4 hover:bg-white/[0.05] transition-colors">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-bold text-white">{item.name}</h4>
                      <span className="text-primary font-black tracking-tight">{item.price}</span>
                    </div>
                    
                    {/* Multi-store Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {item.links.meesho && <PlatformButton href={item.links.meesho} label="Meesho" />}
                      {item.links.amazon && <PlatformButton href={item.links.amazon} label="Amazon" />}
                      {item.links.flipkart && <PlatformButton href={item.links.flipkart} label="Flipkart" />}
                      {item.links.snapdeal && <PlatformButton href={item.links.snapdeal} label="Snapdeal" />}
                      {item.links.vMart && <PlatformButton href={item.links.vMart} label="V-Mart" />}
                      {item.links.bata && <PlatformButton href={item.links.bata} label="Bata" />}
                      {item.links.myntra && <PlatformButton href={item.links.myntra} label="Myntra" />}
                      {item.links.ajio && <PlatformButton href={item.links.ajio} label="Ajio" />}
                      {item.links.zara && <PlatformButton href={item.links.zara} label="Zara" />}
                      {item.links.hm && <PlatformButton href={item.links.hm} label="H&M" />}
                      {item.links.nykaa && <PlatformButton href={item.links.nykaa} label="Nykaa" />}
                      {item.links.tataCliq && <PlatformButton href={item.links.tataCliq} label="Tata Cliq" />}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium pt-1">
                      <Lightbulb className="w-4 h-4 text-primary fill-primary/20" />
                      {item.itemTip}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <div className="p-8 border-t border-white/5 bg-white/[0.03] mt-auto">
              <div className="flex justify-between items-center mb-6">
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Total Fit Value</span>
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
    </div>
  );
}

function PlatformButton({ href, label }: { href: string; label: string }) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      asChild 
      className="h-9 px-4 bg-white/5 border-white/10 hover:bg-primary/10 hover:border-primary/50 text-white hover:text-primary rounded-full text-xs font-bold transition-all group"
    >
      <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
        {label}
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </a>
    </Button>
  );
}