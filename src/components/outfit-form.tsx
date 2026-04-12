
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
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { generatePersonalizedOutfitSuggestions, type GenerateOutfitOutput } from "@/ai/flows/generate-personalized-outfit-suggestions";

const formSchema = z.object({
  height: z.coerce.number().min(50).max(250),
  weight: z.coerce.number().min(20).max(300),
  genderStyle: z.string().min(1),
  occasion: z.string().min(1),
  budget: z.coerce.number().min(500),
  location: z.string().default("India"),
  bodyType: z.string().optional(),
  preferredColors: z.string().optional(), // We'll split this by comma
  fitType: z.string().optional(),
});

interface OutfitFormProps {
  onResults: (results: GenerateOutfitOutput) => void;
}

export function OutfitForm({ onResults }: OutfitFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: 175,
      weight: 70,
      genderStyle: "Male, streetwear",
      occasion: "College",
      budget: 5000,
      location: "India",
      fitType: "Regular",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const colors = values.preferredColors ? values.preferredColors.split(",").map(c => c.trim()) : [];
      const result = await generatePersonalizedOutfitSuggestions({
        ...values,
        preferredColors: colors.length > 0 ? colors : undefined,
      });
      onResults(result);
    } catch (error) {
      console.error("Failed to generate outfit:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card border border-white/5 p-6 md:p-10 rounded-2xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input placeholder="175" {...field} />
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
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input placeholder="70" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="genderStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Style Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male, streetwear">Male, Streetwear</SelectItem>
                    <SelectItem value="Male, formal">Male, Formal</SelectItem>
                    <SelectItem value="Female, casual">Female, Casual</SelectItem>
                    <SelectItem value="Female, chic">Female, Chic</SelectItem>
                    <SelectItem value="Non-binary, aesthetic">Non-binary, Aesthetic</SelectItem>
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
                <FormLabel>The Occasion</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="College">College / Campus</SelectItem>
                    <SelectItem value="Work">Office / Work</SelectItem>
                    <SelectItem value="Party">Party / Clubbing</SelectItem>
                    <SelectItem value="Wedding">Wedding / Traditional</SelectItem>
                    <SelectItem value="Date">Date Night</SelectItem>
                    <SelectItem value="Gym">Gym / Workout</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fit Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Fit type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Regular">Regular Fit</SelectItem>
                    <SelectItem value="Slim">Slim Fit</SelectItem>
                    <SelectItem value="Oversized">Oversized</SelectItem>
                    <SelectItem value="Relaxed">Relaxed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-primary text-background font-bold hover:bg-primary/90 text-lg gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Cooking your drip...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Get My Drip
                <ArrowRight className="w-5 h-5 ml-auto" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
