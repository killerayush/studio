import { Navbar } from '@/components/navbar';
import { HardHat } from 'lucide-react';

export default function WardrobePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20 text-center flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
            <HardHat className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-headline font-bold">Coming Soon: Your Digital Wardrobe</h1>
        <p className="text-muted-foreground mt-4 max-w-xl">
          Soon, you'll be able to upload your own clothes and get personalized mix-and-match suggestions from our AI.
        </p>
      </main>
    </div>
  );
}
