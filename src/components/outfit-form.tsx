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
import { Sparkles, ArrowRight, Loader2, Flame, Wallet, Gem, GraduationCap, Briefcase, PartyPopper, Dumbbell, Home, Info } from "lucide-react";
import { generatePersonalizedOutfitSuggestions, type GenerateOutfitOutput, type GenerateOutfitInput } from "@/ai/flows/generate-personalized-outfit-suggestions";
import { type StyleAnalysisOutput } from "@/ai/flows/style-analyzer-flow";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const formSchema = z.object({
  name: z.string().optional().nullable(),
  height: z.coerce.number({invalid_type_error: "Please enter a valid number."}).min(50).max(250),
  weight: z.coerce.number({invalid_type_error: "Please enter a valid number."}).min(20).max(300),
  gender: z.enum(['Male', 'Female', 'Non-binary']),
  budgetRange: z.enum(['Under ₹1,500', 'Under ₹3,000', 'Under ₹5,000']),
  occasion: z.string().min(1, { message: "Please select an occasion." }),
  
  // Style Details
  style: z.enum(['Streetwear', 'Classic / Preppy', 'Minimal', 'Desi / Ethnic', 'Bold Prints', 'Techwear']),
  shoeSize: z.coerce.number({invalid_type_error: "Please enter a valid number."}).min(30).max(50).optional(),
  
  preferredTopStyles: z.array(z.string()).optional(),
  preferredFootwear: z.array(z.string()).optional(),
  
  chest: z.coerce.number({invalid_type_error: "Please enter a valid number."}).optional(),
  waist: z.coerce.number({invalid_type_error: "Please enter a valid number."}).optional(),
  hips: z.coerce.number({invalid_type_error: "Please enter a valid number."}).optional(),
  inseam: z.coerce.number({invalid_type_error: "Please enter a valid number."}).optional(),

  city: z.string().optional().nullable(),
  climate: z.enum(['Hot', 'Moderate', 'Cold']).optional(),
  lifestyle: z.string().optional(),

  location: z.string().default("India"),
  styleAnalysis: z.string().optional(),
});


interface OutfitFormProps {
  onResults: (results: GenerateOutfitOutput, input: GenerateOutfitInput) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  initialAnalysisData?: StyleAnalysisOutput | null;
}

const occasionOptions = [
    { value: 'Work', label: 'Work', icon: <Briefcase className="w-8 h-8" />, image: 'https://picsum.photos/seed/work/400/500' },
    { value: 'Party', label: 'Party', icon: <PartyPopper className="w-8 h-8" />, image: 'https://picsum.photos/seed/party/400/500' },
    { value: 'College', label: 'College', icon: <GraduationCap className="w-8 h-8" />, image: 'https://picsum.photos/seed/college/400/500' },
    { value: 'Gym', label: 'Gym', icon: <Dumbbell className="w-8 h-8" />, image: 'https://picsum.photos/seed/gym/400/500' },
    { value: 'Home', label: 'Home', icon: <Home className="w-8 h-8" />, image: 'https://picsum.photos/seed/home/400/500' },
];

const budgetOptions = [
    { value: "Under ₹1,500", title: "Budget Drip", icon: <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"><Wallet className="w-6 h-6 text-green-400" /></div>, price: "Under ₹1,500", brands: "Meesho · Flipkart · Glowroad", tagline: "// look fly, spend less" },
    { value: "Under ₹3,000", title: "Mid-range", icon: <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center"><Flame className="w-6 h-6 text-orange-400" /></div>, price: "Under ₹3,000", brands: "Myntra · Ajio · H&M · Newme", tagline: "// sweet spot · most picks here" },
    { value: "Under ₹5,000", title: "Premium", icon: <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center"><Gem className="w-6 h-6 text-purple-400" /></div>, price: "Under ₹5,000", brands: "Zara · Mango · Nike · Snitch", tagline: "// quality fits · long wear" }
];

const StyleCheckboxButton = ({ field, value, label, icon }: { field: any, value: string, label: string, icon: string }) => {
    const isChecked = field.value?.includes(value);
    return (
        <FormItem 
             onClick={() => {
                const newValue = isChecked
                    ? field.value.filter((v: string) => v !== value)
                    : [...(field.value || []), value];
                field.onChange(newValue);
            }}
             className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border-2 transition-all text-sm font-semibold",
                isChecked ? "border-primary bg-primary/10" : "border-muted/50 bg-black/20 hover:border-primary/50"
            )}
        >
            <FormControl>
                <Checkbox
                    checked={isChecked}
                    className="hidden"
                />
            </FormControl>
            <span className="text-lg">{icon}</span>
            <FormLabel className="!m-0 cursor-pointer">{label}</FormLabel>
        </FormItem>
    );
};


export function OutfitForm({ onResults, isLoading, setIsLoading, initialAnalysisData }: OutfitFormProps) {
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
      budgetRange: "Under ₹3,000",
      occasion: "College",
      style: "Streetwear",
      location: "India",
      shoeSize: 42,
      preferredTopStyles: [],
      preferredFootwear: [],
      chest: 38,
      waist: 32,
      hips: 36,
      inseam: 30,
      city: "",
      lifestyle: "Student",
      styleAnalysis: "",
    },
  });

  useEffect(() => {
    if (initialAnalysisData) {
      form.setValue('styleAnalysis', JSON.stringify(initialAnalysisData));
    }
  }, [initialAnalysisData, form]);

  const gender = form.watch('gender');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const payload: GenerateOutfitInput = {
        ...values,
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
        
        {initialAnalysisData && (
          <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-xl flex items-center gap-3">
            <Info className="w-5 h-5 shrink-0"/>
            <p className="text-sm font-semibold">Using your Style Analysis to generate enhanced recommendations! ✨</p>
          </div>
        )}

        <div className="space-y-4">
            <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">THE BASICS</FormLabel>
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">YOUR NAME (optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Alex" className="h-14 bg-black/20 border-muted text-lg rounded-xl focus:ring-primary" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">HEIGHT <span className="text-muted-foreground/50">CM</span></FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="e.g. 175" className="h-14 bg-black/20 border-muted text-lg rounded-xl focus:ring-primary" {...field} />
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
                        <Input type="number" placeholder="e.g. 70" className="h-14 bg-black/20 border-muted text-lg rounded-xl focus:ring-primary" {...field} />
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
                  value={field.value}
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
            name="occasion"
            render={({ field }) => (
                <FormItem className="space-y-4">
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">STUDIO CONTEXT</FormLabel>
                <FormControl>
                    <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                    >
                        {occasionOptions.map(option => (
                        <FormItem key={option.value}>
                            <FormControl>
                                <RadioGroupItem value={option.value} className="sr-only" />
                            </FormControl>
                            <FormLabel className={cn(
                                "relative flex flex-col items-center justify-end p-4 rounded-2xl cursor-pointer border-2 h-40 transition-all overflow-hidden",
                                field.value === option.value ? "border-primary gold-glow" : "border-muted/50 bg-black/20 hover:border-primary/50"
                            )}>
                                <Image src={option.image} alt={option.label} fill className="object-cover z-0 opacity-30 group-hover:opacity-40 transition-opacity"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                <div className="relative z-20 text-center text-white">
                                    <div className="mb-2">{option.icon}</div>
                                    <p className="font-bold text-lg">{option.label}</p>
                                    <p className="text-xs text-primary font-bold">Vyxen</p>
                                </div>
                            </FormLabel>
                        </FormItem>
                        ))}
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
                        value={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        {budgetOptions.map((option) => (
                            <FormItem key={option.value}>
                                <FormControl>
                                    <RadioGroupItem value={option.value} className="sr-only" />
                                </FormControl>
                                <FormLabel className={cn(
                                    "relative block p-6 rounded-2xl border-2 bg-black/20 transition-all cursor-pointer h-full",
                                    field.value === option.value ? "border-primary gold-glow" : "border-muted/50 hover:border-primary/50"
                                )}>
                                    <div className="flex flex-col items-center text-center space-y-3">
                                        {option.icon}
                                        <h3 className="font-bold text-lg text-white">{option.title}</h3>
                                        <p className="font-semibold text-muted-foreground">{option.price}</p>
                                        <p className="text-xs text-muted-foreground">{option.brands}</p>
                                        <p className="text-xs text-primary font-mono pt-2 mt-2 border-t border-muted/20 w-full">{option.tagline}</p>
                                    </div>
                                </FormLabel>
                            </FormItem>
                        ))}
                    </RadioGroup>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
        />
        
        <div className="space-y-4 rounded-xl border-2 border-muted/50 p-6">
            <div className="flex items-center justify-between">
                <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">STYLE DETAILS - {gender.toUpperCase()}</FormLabel>
                <button type="button" onClick={() => setShowStyleDetails(!showStyleDetails)} className="flex items-center gap-2 px-4 py-1 border border-primary rounded-full text-primary text-xs font-bold">{showStyleDetails ? 'Hide Options' : 'Show Options'} <span className="bg-primary text-background rounded-full px-2 py-0.5 ml-1">BETTER FITS</span></button>
            </div>
            {showStyleDetails && (
                <div className="space-y-8 pt-6 animate-accordion-down">
                     <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">YOUR VIBE</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
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
                    
                    <FormField
                        control={form.control}
                        name="preferredTopStyles"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">TOP STYLE I GO FOR</FormLabel>
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <StyleCheckboxButton field={field} value="T-Shirts" label="T-Shirts" icon="👕" />
                                    <StyleCheckboxButton field={field} value="Shirts" label="Shirts" icon="👔" />
                                    <StyleCheckboxButton field={field} value="Hoodies" label="Hoodies" icon="🧥" />
                                    <StyleCheckboxButton field={field} value="Polo" label="Polo" icon="👕" />
                                    <StyleCheckboxButton field={field} value="Kurta" label="Kurta" icon="👘" />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="preferredFootwear"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">FOOTWEAR I LIVE IN</FormLabel>
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <StyleCheckboxButton field={field} value="Sneakers" label="Sneakers" icon="👟" />
                                        <StyleCheckboxButton field={field} value="Loafers" label="Loafers" icon="👞" />
                                        <StyleCheckboxButton field={field} value="Boots" label="Boots" icon="👢" />
                                        <StyleCheckboxButton field={field} value="Chappals" label="Chappals" icon="🩴" />
                                        <StyleCheckboxButton field={field} value="Formal Shoes" label="Formal Shoes" icon="👞" />
                                    </div>
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
                                <Input type="number" placeholder="e.g. 42" className="h-14 bg-black/20 border-muted text-lg rounded-xl focus:ring-primary" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">MEASUREMENTS</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <FormField control={form.control} name="chest" render={({ field }) => (
                                <FormItem><FormLabel className="text-muted-foreground/80 text-xs">CHEST <span className="text-muted-foreground/50">IN</span></FormLabel><FormControl><Input type="number" placeholder="e.g. 38" className="h-12 bg-black/20 border-muted text-md rounded-xl focus:ring-primary" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="waist" render={({ field }) => (
                                <FormItem><FormLabel className="text-muted-foreground/80 text-xs">WAIST <span className="text-muted-foreground/50">IN</span></FormLabel><FormControl><Input type="number" placeholder="e.g. 32" className="h-12 bg-black/20 border-muted text-md rounded-xl focus:ring-primary" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="hips" render={({ field }) => (
                                <FormItem><FormLabel className="text-muted-foreground/80 text-xs">HIPS <span className="text-muted-foreground/50">IN</span></FormLabel><FormControl><Input type="number" placeholder="e.g. 36" className="h-12 bg-black/20 border-muted text-md rounded-xl focus:ring-primary" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="inseam" render={({ field }) => (
                                <FormItem><FormLabel className="text-muted-foreground/80 text-xs">INSEAM <span className="text-muted-foreground/50">IN</span></FormLabel><FormControl><Input type="number" placeholder="e.g. 30" className="h-12 bg-black/20 border-muted text-md rounded-xl focus:ring-primary" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                         <FormLabel className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">LOCATION & LIFESTYLE</FormLabel>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField control={form.control} name="city" render={({ field }) => (
                                <FormItem><FormLabel className="text-muted-foreground/80 text-xs">CITY</FormLabel><FormControl><Input placeholder="e.g. Mumbai, Delhi..." className="h-12 bg-black/20 border-muted text-md rounded-xl focus:ring-primary" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                             )} />
                             <FormField control={form.control} name="climate" render={({ field }) => (
                                <FormItem><FormLabel className="text-muted-foreground/80 text-xs">CLIMATE</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl>
                                    <SelectTrigger className="h-12 bg-black/20 border-muted text-md rounded-xl focus:ring-primary"><SelectValue placeholder="Select..." /></SelectTrigger>
                                </FormControl><SelectContent>
                                    <SelectItem value="Hot">Hot</SelectItem>
                                    <SelectItem value="Moderate">Moderate</SelectItem>
                                    <SelectItem value="Cold">Cold</SelectItem>
                                </SelectContent></Select><FormMessage /></FormItem>
                             )}/>
                         </div>
                         <FormField control={form.control} name="lifestyle" render={({ field }) => (
                            <FormItem><FormLabel className="text-muted-foreground/80 text-xs">LIFESTYLE</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-2 pt-2">
                                    {['Student', 'Working Professional', 'Freelancer / WFH', 'Fitness Enthusiast', 'Social / Party-goer'].map(item => (
                                    <FormItem key={item}>
                                        <FormControl><RadioGroupItem value={item} className="sr-only" /></FormControl>
                                        <FormLabel className={cn("flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer border-2 transition-all text-sm font-semibold", field.value === item ? "border-primary bg-primary/10" : "border-muted/50 bg-black/20 hover:border-primary/50")}>
                                            {item}
                                        </FormLabel>
                                    </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage /></FormItem>
                         )}/>
                    </div>

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
