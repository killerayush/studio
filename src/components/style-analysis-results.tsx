'use client';

import Image from 'next/image';
import { type StyleAnalysisOutput } from '@/ai/flows/style-analyzer-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ShoppingBag, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from "@/lib/utils";

interface StyleAnalysisResultsProps {
  results: StyleAnalysisOutput;
  userImage: string;
  onRetry?: () => void;
}

const ResultCard = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <Card className={cn("glass border-white/5 shadow-lg", className)}>
        <CardHeader>
            <CardTitle className="text-lg font-bold text-primary uppercase tracking-widest">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

const ColorPill = ({ color, valid }: { color: string, valid: boolean }) => (
    <div className="flex items-center gap-2">
        {valid ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-500" />}
        <span className="font-semibold text-white">{color}</span>
    </div>
);

export function StyleAnalysisResults({ results, userImage, onRetry }: StyleAnalysisResultsProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in-up">
        {results.isFallback && onRetry && (
            <div className="glass border-primary/20 bg-primary/5 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 gold-glow">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                <p className="font-bold text-white text-sm">VYXEN High Demand Mode</p>
                <p className="text-muted-foreground text-xs font-medium">Showing a sample studio analysis due to high traffic.</p>
                </div>
            </div>
            <Button 
                onClick={onRetry} 
                variant="outline" 
                className="h-10 border-primary/30 hover:bg-primary/10 text-primary font-bold gap-2 text-xs uppercase tracking-widest"
            >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry AI Analysis
            </Button>
            </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Image + Score */}
            <div className="lg:col-span-1 space-y-10">
                 <Card className="glass border-white/5 overflow-hidden shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-primary uppercase tracking-widest">Your Submission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
                             <Image src={userImage} alt="User submission" fill className="object-cover" />
                        </div>
                    </CardContent>
                 </Card>
                 <ResultCard title="Style Score">
                     <div className="text-center">
                        <p className="text-7xl font-headline font-black text-primary gold-glow">{results.styleScore.toFixed(1)}<span className="text-3xl text-muted-foreground">/10</span></p>
                     </div>
                 </ResultCard>
            </div>

            {/* Right Column: Analysis Details */}
            <div className="lg:col-span-2 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <ResultCard title="Body Type">
                        <h3 className="text-2xl font-bold text-white mb-2">{results.bodyType}</h3>
                        <p className="text-sm text-muted-foreground font-semibold">Best Fit: <span className="text-white">{results.bestFit}</span></p>
                        <p className="text-sm text-muted-foreground font-semibold">Avoid: <span className="text-white">{results.avoidFit}</span></p>
                    </ResultCard>

                    <ResultCard title="Color Analysis">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-bold text-green-400 mb-3">Best Colors</h4>
                                <div className="space-y-2">
                                    {results.bestColors.map(color => <ColorPill key={color} color={color} valid />)}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-red-500 mb-3">Colors to Avoid</h4>
                                <div className="space-y-2">
                                     {results.avoidColors.map(color => <ColorPill key={color} color={color} valid={false} />)}
                                </div>
                            </div>
                        </div>
                    </ResultCard>
                </div>
                
                <ResultCard title="Current Outfit Feedback">
                    <div className="space-y-4">
                         <div>
                            <h4 className="font-bold text-green-400 mb-2">What's Good ✔</h4>
                            <ul className="list-disc list-inside space-y-1 text-white">
                                {results.outfitFeedback.good.map(fb => <li key={fb}>{fb}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-orange-400 mb-2">Areas to Improve ✖</h4>
                             <ul className="list-disc list-inside space-y-1 text-white">
                                {results.outfitFeedback.improve.map(fb => <li key={fb}>{fb}</li>)}
                            </ul>
                        </div>
                    </div>
                </ResultCard>

                <ResultCard title="Recommended Outfit" className="border-primary/50 gold-glow">
                    <div className="space-y-4">
                        {results.recommendedOutfit.map(item => (
                            <div key={item.type} className="bg-white/5 p-4 rounded-lg flex justify-between items-center">
                                <span className="font-bold text-primary">{item.type}</span>
                                <p className="text-white font-medium">{item.description}</p>
                            </div>
                        ))}
                    </div>
                     <div className="mt-6">
                        <Button className="w-full h-14 bg-secondary hover:bg-secondary/80 text-white font-black rounded-xl gap-3 text-lg neon-glow">
                            <ShoppingBag className="w-6 h-6" />
                            SHOP THIS LOOK
                            <ArrowRight className="w-5 h-5 ml-auto" />
                        </Button>
                    </div>
                </ResultCard>

                <ResultCard title="Best Clothes For You">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                             <h4 className="font-bold text-white mb-2">Tops</h4>
                            <ul className="list-disc list-inside text-muted-foreground">
                                {results.clothesSuggestions.tops.map(i => <li key={i}>{i}</li>)}
                            </ul>
                        </div>
                         <div>
                             <h4 className="font-bold text-white mb-2">Bottoms</h4>
                            <ul className="list-disc list-inside text-muted-foreground">
                                {results.clothesSuggestions.bottoms.map(i => <li key={i}>{i}</li>)}
                            </ul>
                        </div>
                         <div>
                             <h4 className="font-bold text-white mb-2">Shoes</h4>
                            <ul className="list-disc list-inside text-muted-foreground">
                                {results.clothesSuggestions.shoes.map(i => <li key={i}>{i}</li>)}
                            </ul>
                        </div>
                     </div>
                     <div className="mt-6 border-t border-white/10 pt-4">
                         <h4 className="font-bold text-red-500 mb-2">Consider Avoiding</h4>
                        <p className="text-muted-foreground text-sm">{results.clothesSuggestions.avoid.join(', ')}</p>
                     </div>
                </ResultCard>
                 <div className="text-center text-muted-foreground text-xs p-4">
                    <p>This analysis is generated by AI. Your image is processed for this analysis and is not stored or used for any other purpose.</p>
                    <button className="underline hover:text-primary mt-1">Delete this analysis and image</button>
                </div>
            </div>
        </div>
    </div>
  );
}
