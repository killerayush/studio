'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Camera, ArrowLeft } from 'lucide-react';
import { analyzeStyleFromImage, type StyleAnalysisOutput, type StyleAnalysisInput } from '@/ai/flows/style-analyzer-flow';
import { StyleAnalysisResults } from '@/components/style-analysis-results';

type PageState = 'upload' | 'loading' | 'result';

export default function AnalyzePage() {
  const [pageState, setPageState] = useState<PageState>('upload');
  const [analysisResult, setAnalysisResult] = useState<StyleAnalysisOutput | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const performAnalysis = async (imageDataUri: string) => {
    setUploadedImage(imageDataUri);
    setPageState('loading');
    try {
      const input: StyleAnalysisInput = { imageDataUri };
      const result = await analyzeStyleFromImage(input);
      setAnalysisResult(result);
      setPageState('result');
    } catch (error) {
      console.error("Style analysis failed:", error);
      toast({
        variant: "destructive",
        title: "AI Analysis Error",
        description: "Could not analyze your style. Please try a different image.",
      });
      setPageState('upload'); // Go back to upload screen on error
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
        toast({
          variant: 'destructive',
          title: 'Image Too Large',
          description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUri = e.target?.result as string;
        await performAnalysis(imageDataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetry = async () => {
    if (uploadedImage) {
      await performAnalysis(uploadedImage);
    }
  };

  const resetState = () => {
    setPageState('upload');
    setAnalysisResult(null);
    setUploadedImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleGenerateFromAnalysis = () => {
    if (analysisResult) {
      sessionStorage.setItem('styleAnalysisData', JSON.stringify(analysisResult));
      router.push('/generate');
    }
  };

  const renderContent = () => {
    switch (pageState) {
      case 'loading':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-white">Analyzing your style... 🔥</h1>
            <p className="text-muted-foreground text-lg">The VYXEN AI is assessing your look...</p>
          </div>
        );
      case 'result':
        return (
            <>
                <div className="max-w-7xl mx-auto flex items-center justify-between mb-8">
                    <Button 
                        variant="ghost" 
                        onClick={resetState}
                        className="group hover:bg-transparent px-0 text-muted-foreground hover:text-primary font-bold uppercase tracking-widest text-xs"
                    >
                        <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        ANALYZE ANOTHER
                    </Button>
                </div>
                {analysisResult && uploadedImage && (
                    <StyleAnalysisResults 
                      results={analysisResult} 
                      userImage={uploadedImage} 
                      onRetry={handleRetry}
                      onGenerate={handleGenerateFromAnalysis}
                    />
                )}
            </>
        );
      case 'upload':
      default:
        return (
          <div className="max-w-3xl mx-auto space-y-12 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-headline font-bold">AI Personal Style Analyzer</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Upload a photo to get a detailed analysis of your body type, color compatibility, and personalized outfit recommendations.
              </p>
            </div>
            <div className="glass p-8 md:p-12 rounded-[2rem] shadow-2xl border-dashed border-2 border-muted hover:border-primary transition-all">
                <div className="space-y-6">
                    <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Camera className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold font-headline">Upload Your Photo</h2>
                    <ul className="text-muted-foreground list-disc list-inside text-left max-w-sm mx-auto space-y-2">
                        <li>Use good, natural lighting ☀️</li>
                        <li>Ensure your full body is visible 🧍</li>
                        <li>A plain background works best</li>
                    </ul>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        size="lg"
                        className="h-16 px-10 w-full bg-primary text-background font-black hover:bg-primary/90 text-xl rounded-full shadow-2xl shadow-primary/30 gold-glow group"
                    >
                        <Upload className="mr-3 w-6 h-6" />
                        SELECT IMAGE
                    </Button>
                </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <main className="container mx-auto px-4 pt-32">
        {renderContent()}
      </main>
    </div>
  );
}
