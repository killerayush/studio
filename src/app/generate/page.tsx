
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { OutfitForm } from "@/components/outfit-form";
import { OutfitResults } from "@/components/outfit-results";
import { type GenerateOutfitOutput } from "@/ai/flows/generate-personalized-outfit-suggestions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GeneratePage() {
  const [results, setResults] = useState<GenerateOutfitOutput | null>(null);

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
            <OutfitForm onResults={(res) => setResults(res)} />
          </div>
        ) : (
          <div className="space-y-8">
            <Button 
              variant="ghost" 
              onClick={() => setResults(null)}
              className="group hover:bg-transparent px-0 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Adjust your profile
            </Button>
            <OutfitResults results={results} />
          </div>
        )}
      </main>
    </div>
  );
}
