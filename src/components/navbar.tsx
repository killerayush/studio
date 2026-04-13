"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { AuthModal } from '@/components/auth-modal';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";


export function Navbar() {
  const { user, isUserLoading } = useUser();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pathname = usePathname();

   const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/generate', label: 'OUTFIT BUILDER' },
    { href: '/analyze',label: 'MIRROR AI' },
    { href: '/history', label: 'HISTORY' },
    { href: '/profile', label: 'PROFILE' },
  ];


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
         <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="font-black text-2xl text-background">V</span>
          </div>
          <span className="font-headline text-2xl text-white font-extrabold tracking-tighter">
            VYXEN
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-sm font-semibold tracking-widest uppercase">
           {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={cn(
                "transition-colors",
                pathname === link.href ? "text-primary font-bold" : "text-muted-foreground hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          {!isUserLoading && !user && (
             <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsAuthModalOpen(true)}
              className="text-muted-foreground hover:text-primary font-bold uppercase tracking-widest text-xs"
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
}
