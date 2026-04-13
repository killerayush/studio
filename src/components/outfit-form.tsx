"use client";

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
import { generatePersonalizedOutfitSuggestions, type GenerateOutfitOutput, type GenerateOutfitInput } from "@/ai/flows/generate-personalized-outfit-suggestions";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().optional().nullable(),
  gender: z.enum(['Male', 'Female', 'Non-binary']),
  height: z.coerce.number().min(50).max(250),
  weight: z.coerce.number().min(20).max(300),
  style: z.enum(['Streetwear', 'Minimal', 'Desi', 'Formal', 'Gym']),
  occasion: z.string().min(1),
  budgetRange: z.enum(['Under ₹1500', 'Under ₹3000', 'Under ₹5000']),
  location: z.string().default("India"),
});

const occasionOptions = [
  { value: 'Campus', label: 'CAMPUS', emoji: '🎓', subtitle: '// LOUD FITS ONLY →', image: 'https://picsum.photos/seed/campus/400/400', imageHint: 'university campus' },
  { value: 'Concert', label: 'CONCERT', emoji: '🎤', subtitle: '// LOUD FITS ONLY →', image: 'https://picsum.photos/seed/concert/400/400', imageHint: 'music concert' },
  { value: 'Date Night', label: 'DATE NIGHT', emoji: '🌹', subtitle: '// CERTIFIED RIZZ →', image: 'https://picsum.photos/seed/datenight/400/400', imageHint: 'romantic evening' },
  { value: 'Casual', label: 'CASUAL', emoji: '☀️', image: 'https://picsum.photos/seed/casual/400/400', imageHint: 'city skyline' },
  { value: 'Festival', label: 'FESTIVAL', emoji: '🎡', image: 'https://picsum.photos/seed/festival/400/400', imageHint: 'music festival' },
  { value: 'Office', label: 'OFFICE', emoji: '💼', image: 'https://picsum.photos/seed/office/400/400', imageHint: 'modern office' },
  { value: 'Brunch', label: 'BRUNCH', emoji: '🍳', image: 'https://picsum.photos/seed/brunch/400/400', imageHint: 'brunch food' },
  { value: 'Wedding', label: 'WEDDING GUEST', emoji: '💒', image: 'https://picsum.photos/seed/wedding/400/400', imageHint: 'wedding celebration' },
];


interface OutfitFormProps {
  onResults: (results: GenerateOutfitOutput, input: GenerateOutfitInput) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export function OutfitForm({ onResults, isLoading, setIsLoading }: OutfitFormProps) {
  const { user } = useUser();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.displayName || "",
      gender: "Male",
      height: 175,
      weight: 70,
      style: "Streetwear",
      occasion: "Casual",
      budgetRange: "Under ₹3000",
      location: "India",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const payload: GenerateOutfitInput = {
        ...values,
        name: values.name || null,
        userId: user?.uid || null,
      };
      const result = await generatePersonalizedOutfitSuggestions(payload);
      onResults(result, payload);
    } catch (error) {
      console.error("Failed to generate outfit:", error);
      toast({
        variant: "destructive",
        title: "AI Engine Error",
        description: "Failed to generate your outfit. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 glass p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
          <Zap className="w-40 h-40 text-primary" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">01 // Identity</FormLabel>
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
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">02 // Height (cm)</FormLabel>
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
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">03 // Weight (kg)</FormLabel>
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
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">04 // Style Engine</FormLabel>
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
                <FormItem className="md:col-span-2">
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">05 // Context</FormLabel>
                    <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        {occasionOptions.map((option) => (
                            <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                                "relative aspect-square rounded-3xl overflow-hidden group transition-all duration-300",
                                field.value === option.value ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : "ring-2 ring-transparent hover:ring-primary/50"
                            )}
                            >
                            <Image src={option.image} alt={option.label} fill className="object-cover transition-transform duration-500 group-hover:scale-110" data-ai-hint={option.imageHint}/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                                <p className="text-3xl md:text-4xl">{option.emoji}</p>
                                <h4 className="text-white font-black text-lg md:text-xl uppercase tracking-tighter mt-1">{option.label}</h4>
                                {option.subtitle && (
                                <p className="text-primary text-[10px] font-bold uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{option.subtitle}</p>
                                )}
                            </div>
                            </button>
                        ))}
                        <div className="relative aspect-square rounded-3xl overflow-hidden group bg-card border-2 border-dashed border-muted flex flex-col items-center justify-center text-center p-2">
                            <Loader2 className="w-8 h-8 text-primary/50 animate-spin" />
                            <h4 className="text-muted-foreground font-black text-sm uppercase tracking-widest mt-4">ENGINE LOADING</h4>
                            <p className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-widest mt-1">CALCULATING DRIP...</p>
                        </div>
                        </div>
                    </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

          <FormField
            control={form.control}
            name="budgetRange"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">06 // Budget Tier</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-14 bg-white/5 border-white/10 text-lg rounded-xl">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="glass">
                    <SelectItem value="Under ₹1500">Budget Tier (Under ₹1500)</SelectItem>
                    <SelectItem value="Under ₹3000">Trendy Tier (Under ₹3000)</SelectItem>
                    <SelectItem value="Under ₹5000">Premium Tier (Under ₹5000)</SelectItem>
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
            disabled={isLoading}
            className="w-full h-20 bg-primary text-background font-black hover:bg-primary/90 text-2xl gap-3 rounded-2xl gold-glow transition-all active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin" />
                COOKING YOUR DRIP... 🔥
              </>
            ) : (
              <>
                <Sparkles className="w-7 h-7 fill-current" />
                VYXEN MY FIT
                <ArrowRight className="w-7 h-7 ml-auto" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
