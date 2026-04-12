
"use client";

import { GenerateOutfitOutput } from "@/ai/flows/generate-personalized-outfit-suggestions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart, Tag, Info } from "lucide-react";
import Image from "next/image";

interface OutfitResultsProps {
  results: GenerateOutfitOutput;
}

export function OutfitResults({ results }: OutfitResultsProps) {
  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-headline text-primary">Your Curated Drip</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We've styled 3 distinct looks based on your vibe. Pick your favorite and secure the fit.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {results.outfits.map((outfit, idx) => (
          <Card key={idx} className="bg-card border-white/5 overflow-hidden flex flex-col h-full shadow-xl hover:shadow-primary/5 transition-shadow">
            <div className="relative h-48 bg-muted overflow-hidden">
               <Image 
                src={`https://picsum.photos/seed/outfit-${idx}/600/400`} 
                alt="Outfit Preview" 
                fill 
                className="object-cover opacity-60 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="bg-primary text-background px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Look #{idx + 1}
                </span>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-primary leading-tight">
                {outfit.description}
              </CardTitle>
              <CardDescription className="text-muted-foreground italic flex items-start gap-2 pt-2">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                "{outfit.styleTips}"
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-6">
              <div className="space-y-4">
                {outfit.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="border-t border-white/5 pt-4 first:border-0 first:pt-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-primary/70 font-bold">{item.type}</p>
                        <h4 className="text-sm font-semibold">{item.name}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Tag className="w-3 h-3" />
                          Est. {item.priceRange}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <Button variant="outline" size="sm" asChild className="text-[10px] h-8 border-white/10 hover:border-primary/50">
                        <a href={item.amazonLink} target="_blank" rel="noopener noreferrer">
                          Amazon
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="text-[10px] h-8 border-white/10 hover:border-primary/50">
                        <a href={item.myntraLink} target="_blank" rel="noopener noreferrer">
                          Myntra
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="text-[10px] h-8 border-white/10 hover:border-primary/50">
                        <a href={item.ajioLink} target="_blank" rel="noopener noreferrer">
                          Ajio
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
              <Button className="w-full bg-accent hover:bg-accent/90 text-white gap-2">
                <ShoppingCart className="w-4 h-4" />
                Buy Full Outfit
                <ExternalLink className="w-4 h-4 ml-auto" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
