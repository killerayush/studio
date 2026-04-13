
"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, User, ShoppingBag, LogOut } from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { AuthModal } from "@/components/auth-modal";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-6 h-6 text-background" />
          </div>
          <span className="font-headline text-2xl text-primary font-extrabold tracking-tighter">
            VYXEN
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-sm font-semibold tracking-wide uppercase">
          <Link href="/generate" className="hover:text-primary transition-colors">Style Me</Link>
          <Link href="/trends" className="hover:text-primary transition-colors">Drip Feed</Link>
          <Link href="/about" className="hover:text-primary transition-colors">The Engine</Link>
        </div>

        <div className="flex items-center gap-4">
          {!isUserLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-black">
                          {user.displayName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass border-white/10 min-w-[150px]">
                    <DropdownMenuItem className="text-muted-foreground font-bold text-xs uppercase p-3">
                      {user.displayName || "Vyxen User"}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => signOut(auth)}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10 font-bold gap-2 p-3 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      SIGN OUT
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden sm:flex gap-2 text-muted-foreground hover:text-primary font-bold uppercase tracking-widest text-xs"
                >
                  <User className="w-4 h-4" />
                  IDENTITY
                </Button>
              )}
            </>
          )}
          
          <Button asChild size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-bold h-10 gold-glow">
            <Link href="/generate">
              <Sparkles className="w-4 h-4 fill-current" />
              GET FIT
            </Link>
          </Button>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
}
