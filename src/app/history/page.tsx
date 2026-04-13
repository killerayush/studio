import { Navbar } from '@/components/navbar';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20 text-center">
        <h1 className="text-4xl font-headline font-bold">Build History</h1>
        <p className="text-muted-foreground mt-4">Your past outfit generations will appear here.</p>
      </main>
    </div>
  );
}
