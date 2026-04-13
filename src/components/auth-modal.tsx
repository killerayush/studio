
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth, initiateGoogleSignIn } from "@/firebase";
import { ShoppingBag, Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await initiateGoogleSignIn(auth);
      onClose();
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === 'auth/operation-not-allowed') {
        toast({
          variant: "destructive",
          title: "Identity Engine Offline",
          description: "Google Login is not enabled in the Firebase Console. Please enable it to continue.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: error.message || "Failed to sign in with Google.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass border-white/10 bg-black/90 backdrop-blur-2xl rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
        
        <DialogHeader className="p-10 pb-6 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 gold-glow mb-4">
            <ShoppingBag className="w-8 h-8 text-background" />
          </div>
          <DialogTitle className="text-4xl font-headline font-black tracking-tighter text-white">
            VYXEN IDENTITY
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-lg font-medium leading-relaxed">
            Secure your style profile and save your high-fidelity drips.
          </DialogDescription>
        </DialogHeader>

        <div className="px-10 pb-12 space-y-6">
          <Button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="w-full h-16 bg-white text-black hover:bg-white/90 rounded-2xl text-lg font-black gap-3 transition-all active:scale-95 shadow-xl"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                CONTINUE WITH GOOGLE
              </>
            )}
          </Button>

          <Button 
            variant="outline"
            className="w-full h-16 border-white/10 bg-white/5 hover:bg-white/10 rounded-2xl text-lg font-black gap-3 text-white transition-all active:scale-95"
          >
            <Mail className="w-6 h-6" />
            EMAIL / PASS
          </Button>

          <p className="text-center text-xs text-muted-foreground uppercase tracking-widest font-bold pt-4">
            By entering the studio, you agree to the Vyxen Terms.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
