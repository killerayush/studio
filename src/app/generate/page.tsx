"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { OutfitForm } from "@/components/outfit-form";
import { OutfitResults } from "@/components/outfit-results";
import { type GenerateOutfitOutput, type GenerateOutfitInput } from "@/ai/flows/generate-personalized-outfit-suggestions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GeneratePage() {
  const [results, setResults] = useState<GenerateOutfitOutput | null>(null);
  const [lastInput, setLastInput] = useState<GenerateOutfitInput | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleResults = (res: GenerateOutfitOutput, input: GenerateOutfitInput) => {
    setResults(res);
    setLastInput(input);
    // Smooth scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32">
        {!results ? (
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-headline font-bold">Define Your Look</h1>
              <p className="text-muted-foreground text-lg">
                Tell us about yourself, and we'll handle the styling.
              </p>
            </div>
            <OutfitForm onResults={handleResults} />
          </div>
        ) : (
          <div className="space-y-8" ref={resultsRef}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setResults(null)}
                className="group hover:bg-transparent px-0 text-muted-foreground hover:text-primary font-bold uppercase tracking-widest text-xs"
              >
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Adjust your profile
              </Button>
            </div>
            <OutfitResults 
              results={results} 
              onRetry={() => {
                setResults(null);
                // The form will be shown again, user can just click button
              }} 
            />
          </div>
        )}
      </main>
    </div>
  );
}
