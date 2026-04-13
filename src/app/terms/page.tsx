import { Navbar } from '@/components/navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
         <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-headline font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-invert lg:prose-xl text-muted-foreground space-y-4">
            <p>By accessing or using VYXEN, you agree to be bound by these terms.</p>
            <h2 className="text-2xl font-bold text-white">1. Use of Service</h2>
            <p>VYXEN provides a personalized AI fashion styling service. You agree to use our service for its intended purpose and in compliance with all applicable laws.</p>
            <h2 className="text-2xl font-bold text-white">2. User Accounts</h2>
            <p>You may be required to create an account to access certain features. You are responsible for safeguarding your account and for all activities that occur under it.</p>
            <h2 className="text-2xl font-bold text-white">3. Content</h2>
            <p>Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.</p>
            <h2 className="text-2xl font-bold text-white">4. Limitation of Liability</h2>
            <p>In no event shall VYXEN, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
             <h2 className="text-2xl font-bold text-white">5. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
