'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const feedbackFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  feedback: z.string().min(10, { message: "Feedback must be at least 10 characters." }),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export default function FeedbackPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: '',
      email: '',
      feedback: '',
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsLoading(true);

    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Could not connect to the database. Please try again later.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const feedbackCollection = collection(firestore, 'feedback');
      await addDoc(feedbackCollection, {
        ...data,
        userId: user?.uid || 'anonymous',
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Feedback Sent! 🚀",
        description: "Thank you for helping us improve VYXEN.",
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <main className="container mx-auto px-4 pt-32">
        <div className="max-w-2xl mx-auto text-center">
             <h1 className="text-4xl md:text-6xl font-headline font-bold">Share Your Feedback</h1>
            <p className="text-muted-foreground text-lg mt-4">
                We're building VYXEN for you. Your thoughts and ideas are invaluable to us.
            </p>
        </div>

        <Card className="max-w-2xl mx-auto mt-12 glass p-4 md:p-8 rounded-[2rem] shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-headline font-bold text-center">Feedback Form</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Name (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} className="h-12 bg-black/20 border-muted text-base rounded-xl"/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your.email@example.com" {...field} className="h-12 bg-black/20 border-muted text-base rounded-xl"/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="feedback"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Your Feedback</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Tell us what you love, what's missing, or any ideas you have..."
                                    className="min-h-[150px] bg-black/20 border-muted text-base rounded-xl"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button 
                            type="submit" 
                            disabled={isLoading || !firestore}
                            className="w-full h-16 bg-primary text-background font-black hover:bg-primary/90 text-xl rounded-full shadow-2xl shadow-primary/30 gold-glow group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                <Send className="mr-3 w-6 h-6" />
                                SUBMIT FEEDBACK
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

