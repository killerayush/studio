
"use client";

import { GenerateOutfitOutput } from "@/ai/flows/generate-personalized-outfit-suggestions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart, Tag, Info, ShoppingBag } from "lucide-react";
import Image from "next/image";

interface OutfitResultsProps {
  results: GenerateOutfitOutput;
}

export function OutfitResults({ results }: OutfitResultsProps) {
  return (
    <div className="space-y-16 animate-fade-in-up pb-20">
      <div className="text-center space-y-6">
        <h2 className="text-5xl md:text-7xl font-headline font-black text-primary tracking-tighter">THE VYXEN DROPS</h2>
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
            
            <CardHeader className="p-8">
              <CardTitle className="text-3xl font-headline text-primary font-black">
                {outfit.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium flex items-start gap-3 pt-3">
                <Info className="w-5 h-5 shrink-0 text-primary mt-1" />
                <span className="italic leading-relaxed">"{outfit.styleTip}"</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8 flex-1 space-y-8">
              <div className="space-y-6">
                {outfit.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="border-t border-white/5 pt-6 first:border-0 first:pt-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-black mb-1">{item.type}</p>
                        <h4 className="text-lg font-bold">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-2 text-sm font-bold text-muted-foreground">
                           <Tag className="w-4 h-4 text-primary" />
                           {item.price}
                        </div>
                      </div>
                    </div>
                    
                    {/* Multi-store Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {item.links.amazon && (
                        <Button variant="outline" size="sm" asChild className="h-8 text-[10px] glass rounded-full font-bold px-3">
                          <a href={item.links.amazon} target="_blank" rel="noopener noreferrer">Amazon</a>
                        </Button>
                      )}
                      {item.links.myntra && (
                        <Button variant="outline" size="sm" asChild className="h-8 text-[10px] glass rounded-full font-bold px-3">
                          <a href={item.links.myntra} target="_blank" rel="noopener noreferrer">Myntra</a>
                        </Button>
                      )}
                      {item.links.ajio && (
                        <Button variant="outline" size="sm" asChild className="h-8 text-[10px] glass rounded-full font-bold px-3">
                          <a href={item.links.ajio} target="_blank" rel="noopener noreferrer">Ajio</a>
                        </Button>
                      )}
                      {item.links.flipkart && (
                        <Button variant="outline" size="sm" asChild className="h-8 text-[10px] glass rounded-full font-bold px-3">
                          <a href={item.links.flipkart} target="_blank" rel="noopener noreferrer">Flipkart</a>
                        </Button>
                      )}
                      {item.links.zara && (
                        <Button variant="outline" size="sm" asChild className="h-8 text-[10px] glass rounded-full font-bold px-3">
                          <a href={item.links.zara} target="_blank" rel="noopener noreferrer">Zara</a>
                        </Button>
                      )}
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
