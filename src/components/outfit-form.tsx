"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, ArrowRight, Loader2, Zap } from "lucide-react";
import { generatePersonalizedOutfitSuggestions, type GenerateOutfitOutput } from "@/ai/flows/generate-personalized-outfit-suggestions";
import { useUser } from "@/firebase";

const formSchema = z.object({
  name: z.string().optional().nullable(),
  gender: z.enum(['Male', 'Female', 'Non-binary']),
  height: z.coerce.number().min(50).max(250),
  weight: z.coerce.number().min(20).max(300),
  style: z.enum(['Streetwear', 'Minimal', 'Desi', 'Formal', 'Gym']),
  occasion: z.string().min(1),
  budgetRange: z.string().min(1),
  location: z.string().default("India"),
});

interface OutfitFormProps {
  onResults: (results: GenerateOutfitOutput) => void;
}

export function OutfitForm({ onResults }: OutfitFormProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.displayName || "",
      gender: "Male",
      height: 175,
      weight: 70,
      style: "Streetwear",
      occasion: "College",
      budgetRange: "Under ₹3000",
      location: "India",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      // Ensure nullable fields are correctly passed as null if empty
      const payload = {
        ...values,
        name: values.name || null,
        city: null, // Placeholder for future city detection
        userId: user?.uid || null,
        preferredTopStyles: [],
        preferredFootwear: [],
      };
      const result = await generatePersonalizedOutfitSuggestions(payload as any);
      onResults(result);
    } catch (error) {
      console.error("Failed to generate outfit:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 glass p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
          <Zap className="w-40 h-40 text-primary" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Identity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-14 bg-white/5 border-white/10 text-lg rounded-xl">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="glass">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Non-binary">Non-binary</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Height (cm)</FormLabel>
                <FormControl>
                  <Input placeholder="175" className="h-14 bg-white/5 border-white/10 text-lg rounded-xl focus:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Weight (kg)</FormLabel>
                <FormControl>
                  <Input placeholder="70" className="h-14 bg-white/5 border-white/10 text-lg rounded-xl focus:ring-primary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Style Vibe</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-14 bg-white/5 border-white/10 text-lg rounded-xl">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="glass">
                    <SelectItem value="Streetwear">Streetwear</SelectItem>
                    <SelectItem value="Minimal">Minimalist</SelectItem>
                    <SelectItem value="Desi">Desi / Traditional</SelectItem>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Gym">Gym / Athletic</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occasion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-widest text-xs">The Occasion</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-14 bg-white/5 border-white/10 text-lg rounded-xl">
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="glass">
                    <SelectItem value="College">College / Campus</SelectItem>
                    <SelectItem value="Work">Office / Work</SelectItem>
                    <SelectItem value="Party">Party / Clubbing</SelectItem>
                    <SelectItem value="Wedding">Wedding</SelectItem>
                    <SelectItem value="Date">Date Night</SelectItem>
                    <SelectItem value="Gym">Gym</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="budgetRange"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Budget Range</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-14 bg-white/5 border-white/10 text-lg rounded-xl">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="glass">
                    <SelectItem value="Under ₹1500">Budget Fit (Under ₹1500)</SelectItem>
                    <SelectItem value="Under ₹3000">Trendy Fit (Under ₹3000)</SelectItem>
                    <SelectItem value="Under ₹5000">Premium Fit (Under ₹5000)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-6">
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-16 bg-primary text-background font-black hover:bg-primary/90 text-xl gap-3 rounded-2xl gold-glow transition-all active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                COOKING YOUR DRIP...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 fill-current" />
                VYXEN MY FIT
                <ArrowRight className="w-6 h-6 ml-auto" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}