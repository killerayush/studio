"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { OutfitForm } from "@/components/outfit-form";
import { OutfitResults } from "@/components/outfit-results";
import { type GenerateOutfitOutput, type GenerateOutfitInput, generatePersonalizedOutfitSuggestions } from "@/ai/flows/generate-personalized-outfit-suggestions";
import { type StyleAnalysisOutput } from "@/ai/flows/style-analyzer-flow";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GeneratePage() {
  const [results, setResults] = useState<GenerateOutfitOutput | null>(null);
  const [lastInput, setLastInput] = useState<GenerateOutfitInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<StyleAnalysisOutput | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check session storage for analysis data when component mounts
    const storedData = sessionStorage.getItem('styleAnalysisData');
    if (storedData) {
      try {
        setAnalysisData(JSON.parse(storedData));
        // Clear the data so it's not reused on a normal visit to this page
        sessionStorage.removeItem('styleAnalysisData');
      } catch (error) {
        console.error("Failed to parse style analysis data from session storage:", error);
      }
    }
  }, []);

  const handleResults = (res: GenerateOutfitOutput, input: GenerateOutfitInput) => {
    setResults(res);
    setLastInput(input);
    // Smooth scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleStyleRetry = async (newStyle: GenerateOutfitInput['style']) => {
    if (!lastInput) return;
    setIsLoading(true);
    try {
      const payload: GenerateOutfitInput = {
        ...lastInput,
        style: newStyle,
      };
      const result = await generatePersonalizedOutfitSuggestions(payload);
      handleResults(result, payload);
    } catch (error) {
      console.error("Failed to generate new style:", error);
      toast({
        variant: "destructive",
        title: "AI Engine Error",
        description: "Could not generate a new style. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setResults(null);
    setAnalysisData(null); // Also clear analysis data if going back
  };


  return (
    <div className="min-h-screen pb-20 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
          <p className="mt-4 text-xl font-bold font-headline text-white">Cooking your drip... 🔥</p>
        </div>
      )}
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32">
        {!results ? (
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-headline font-bold">Build your profile.</h1>
              <p className="text-muted-foreground text-lg">
                more info = better drip
              </p>
            </div>
            <OutfitForm 
              onResults={handleResults} 
              setIsLoading={setIsLoading} 
              isLoading={isLoading} 
              initialAnalysisData={analysisData}
            />
          </div>
        ) : (
          <div className="space-y-8" ref={resultsRef}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={handleBackToForm}
                className="group hover:bg-transparent px-0 text-muted-foreground hover:text-primary font-bold uppercase tracking-widest text-xs"
              >
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Adjust your profile
              </Button>
            </div>
            <OutfitResults 
              results={results} 
              onRetry={() => {
                if (!lastInput) return;
                setIsLoading(true);
                generatePersonalizedOutfitSuggestions(lastInput)
                  .then(res => handleResults(res, lastInput))
                  .catch(err => console.error(err))
                  .finally(() => setIsLoading(false));
              }}
              onStyleRetry={handleStyleRetry}
            />
          </div>
        )}
      </main>
    </div>
  );
}
