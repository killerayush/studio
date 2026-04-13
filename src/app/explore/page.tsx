'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2, Compass } from 'lucide-react';
import { fetchTrendingOutfits, type FetchTrendingOutfitsOutput } from '@/ai/flows/fetch-trending-outfits-flow';

export default function ExplorePage() {
  const [trends, setTrends] = useState<FetchTrendingOutfitsOutput['trends']>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getTrends() {
      try {
        setIsLoading(true);
        const result = await fetchTrendingOutfits();
        setTrends(result.trends);
      } catch (error) {
        console.error("Failed to fetch trends:", error);
        // Handle error state if necessary
      } finally {
        setIsLoading(false);
      }
    }
    getTrends();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <main className="container mx-auto px-4 pt-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass text-primary text-xs font-bold uppercase tracking-widest mb-6 gold-glow">
            <Compass className="w-3 h-3 fill-current" />
            Style Radar
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4">Explore Trends</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover what's hot right now. Here are the top clothing trends curated by VYXEN AI.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trends.map(trend => (
              <Card key={trend.id} className="glass border-white/5 overflow-hidden shadow-2xl hover:border-primary/40 transition-all group rounded-2xl animate-fade-in-up">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <Image 
                    src={trend.imageUrl} 
                    alt={trend.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    data-ai-hint={trend.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 self-start mb-2 inline-block">
                      {trend.category}
                    </span>
                    <h3 className="text-2xl font-bold font-headline text-white">{trend.name}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">{trend.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
