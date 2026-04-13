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
import { Sparkles, ArrowRight, Loader2, Flame, Wallet, Gem } from "lucide-react";
import { generatePersonalizedOutfitSuggestions, type GenerateOutfitOutput, type GenerateOutfitInput } from "@/ai/flows/generate-personalized-outfit-suggestions";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  name: z.string().optional().nullable(),
  height: z.coerce.number().min(50).max(250),
  weight: z.coerce.number().min(20).max(300),
  shoeSize: z.coerce.number().min(30).max(50).optional(),
  gender: z.enum(['Male', 'Female', 'Non-binary']),
  budgetRange: z.enum(['Under ₹1,500', 'Under ₹3,000', 'Under ₹5,000']),
  style: z.enum(['Streetwear', 'Classic / Preppy', 'Minimal', 'Desi / Ethnic', 'Bold Prints', 'Techwear']),
  location: z.string().default("India"),
});

interface OutfitFormProps {
  onResults: (results: GenerateOutfitOutput, input: GenerateOutfitInput) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const BudgetCard = ({ field, value, title, icon, price, brands, tagline, selectedValue }: { field: any, value: string, title: string, icon: React.ReactNode, price: string, brands: string, tagline: string, selectedValue: string }) => (
    <div
        onClick={() => field.onChange(value)}
        className={cn(
            "relative p-6 rounded-2xl border-2 bg-black/20 transition-all cursor-pointer",
            selectedValue === value ? "border-primary gold-glow" : "border-muted/50 hover:border-primary/50"
        )}
    >
        <div className="flex flex-col items-center text-center space-y-3">
            {icon}
            <h3 className="font-bold text-lg text-white">{title}</h3>
            <p className="font-semibold text-muted-foreground">{price}</p>
            <p className="text-xs text-muted-foreground">{brands}</p>
            <p className="text-xs text-primary font-mono pt-2 mt-2 border-t border-muted/20 w-full">{tagline}</p>
        </div>
    </div>
);


export function OutfitForm({ onResults, isLoading, setIsLoading }: OutfitFormProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [showStyleDetails, setShowStyleDetails] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.displayName || "",
      gender: "Male",
      height: 175,
      weight: 70,
      shoeSize: 42,
      budgetRange: "Under ₹3,000",
      style: "Streetwear",
      location: "India",
    },
  });

  const gender = form.watch('gender');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const payload: GenerateOutfitInput = {
        ...values,
        name: values.name || null,
        userId: user?.uid || null,
        shoeSize: values.shoeSize || undefined,
        occasion: "Casual", // Pass a default occasion
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
        
        <div className="space-y-4">
            <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">THE BASICS</FormLabel>
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">YOUR NAME (optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Alex" className="h-14 bg-black/20 border-muted text-lg rounded-xl focus:ring-primary" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">HEIGHT <span className="text-muted-foreground/50">CM</span></FormLabel>
                        <FormControl>
                        <Input placeholder="e.g. 175" className="h-14 bg-black/20 border-muted text-lg rounded-xl focus:ring-primary" {...field} />
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
                        <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">WEIGHT <span className="text-muted-foreground/50">KG</span></FormLabel>
                        <FormControl>
                        <Input placeholder="e.g. 70" className="h-14 bg-black/20 border-muted text-lg rounded-xl focus:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="shoeSize"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">SHOE SIZE <span className="text-muted-foreground/50">EU/IN</span></FormLabel>
                        <FormControl>
                        <Input placeholder="e.g. 42" className="h-14 bg-black/20 border-muted text-lg rounded-xl focus:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
        </div>
        
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">GENDER / STYLE PREFERENCE</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value="Male" className="sr-only" />
                    </FormControl>
                    <FormLabel className={cn("flex font-semibold items-center justify-center p-4 rounded-xl cursor-pointer border-2 transition-all", field.value === "Male" ? "border-primary bg-primary/10" : "border-muted/50 bg-black/20 hover:border-primary/50")}>
                      Male / Masc
                    </FormLabel>
                  </FormItem>
                   <FormItem>
                    <FormControl>
                      <RadioGroupItem value="Female" className="sr-only" />
                    </FormControl>
                    <FormLabel className={cn("flex font-semibold items-center justify-center p-4 rounded-xl cursor-pointer border-2 transition-all", field.value === "Female" ? "border-primary bg-primary/10" : "border-muted/50 bg-black/20 hover:border-primary/50")}>
                      Female / Femme ✨
                    </FormLabel>
                  </FormItem>
                   <FormItem>
                    <FormControl>
                      <RadioGroupItem value="Non-binary" className="sr-only" />
                    </FormControl>
                    <FormLabel className={cn("flex font-semibold items-center justify-center p-4 rounded-xl cursor-pointer border-2 transition-all", field.value === "Non-binary" ? "border-primary bg-primary/10" : "border-muted/50 bg-black/20 hover:border-primary/50")}>
                      Non-binary / Flex ♦
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
         <FormField
          control={form.control}
          name="budgetRange"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">BUDGET RANGE</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <BudgetCard field={field} value="Under ₹1,500" title="Budget Drip" icon={<div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"><Wallet className="w-6 h-6 text-green-400" /></div>} price="Under ₹1,500" brands="Meesho · Flipkart · Glowroad" tagline="// look fly, spend less" selectedValue={field.value} />
                    <BudgetCard field={field} value="Under ₹3,000" title="Mid-range" icon={<div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center"><Flame className="w-6 h-6 text-orange-400" /></div>} price="Under ₹3,000" brands="Myntra · Ajio · H&M · Newme" tagline="// sweet spot · most picks here" selectedValue={field.value} />
                    <BudgetCard field={field} value="Under ₹5,000" title="Premium" icon={<div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center"><Gem className="w-6 h-6 text-purple-400" /></div>} price="Under ₹5,000" brands="Zara · Mango · Nike · Snitch" tagline="// quality fits · long wear" selectedValue={field.value} />
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4 rounded-xl border-2 border-muted/50 p-4">
            <div className="flex items-center justify-between">
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">STYLE DETAILS - {gender.toUpperCase()}</FormLabel>
                <button type="button" onClick={() => setShowStyleDetails(!showStyleDetails)} className="flex items-center gap-2 px-4 py-1 border border-primary rounded-full text-primary text-xs font-bold">{showStyleDetails ? 'Hide Options' : 'Show Options'} <span className="bg-primary text-background rounded-full px-2 py-0.5 ml-1">BETTER FITS</span></button>
            </div>
            {showStyleDetails && (
                <div className="space-y-4 pt-4 animate-accordion-down">
                    <Button type="button" variant="outline" size="sm" className="bg-black/20 border-muted/50 hover:bg-black/40 w-full" onClick={() => form.setValue('style', 'Streetwear')}>X RESET SELECTIONS</Button>
                     <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">YOUR VIBE</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-wrap gap-2"
                                    >
                                        {['Streetwear', 'Classic / Preppy', 'Minimal', 'Desi / Ethnic', 'Bold Prints', 'Techwear'].map((vibe) => (
                                             <FormItem key={vibe}>
                                                <FormControl>
                                                <RadioGroupItem value={vibe} className="sr-only" />
                                                </FormControl>
                                                <FormLabel className={cn("flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer border-2 transition-all text-sm font-semibold", field.value === vibe ? "border-primary bg-primary/10" : "border-muted/50 bg-black/20 hover:border-primary/50")}>
                                                {vibe}
                                                </FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}
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
