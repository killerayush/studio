'use client';

import { Navbar } from '@/components/navbar';
import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, History, Heart, LogOut, Ruler, Sparkles, Shirt, ScanLine } from 'lucide-react';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { cn } from '@/lib/utils';


export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  // Dummy data for now - will be replaced with Firestore data
  const profileData = {
    height: user ? 175 : null,
    weight: user ? 70 : null,
    totalFits: user ? 12 : 0,
    lastAnalysisScore: user ? 7.8 : null,
    lastAnalysisDate: user ? '2 DAYS AGO' : null,
  };

  const NavItem = ({ icon, label, href, active = false }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) => (
    <Link href={href} className={cn(
        "flex items-center gap-4 p-4 rounded-lg transition-colors font-bold text-sm",
        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-white'
    )}>
      {icon}
      <span>{label}</span>
    </Link>
  );

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-primary animate-pulse">Loading Identity...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            <Card className="glass p-6 text-center border-white/10">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
                {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'}/>}
                <AvatarFallback className="bg-muted text-4xl text-muted-foreground">
                  <User />
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold font-headline">{user ? user.displayName : 'GUEST'}</h2>
            </Card>

            <Card className="glass p-2 border-white/10">
              <nav className="space-y-1">
                <NavItem icon={<User className="w-5 h-5"/>} label="PROFILE DETAILS" href="/profile" active />
                <NavItem icon={<History className="w-5 h-5"/>} label="BUILD HISTORY" href="/history" />
                <NavItem icon={<Heart className="w-5 h-5"/>} label="SAVED FITS" href="#" />
                {user && (
                    <button
                    onClick={() => signOut(auth)}
                    className="flex items-center gap-4 p-4 rounded-lg transition-colors font-bold text-sm text-destructive hover:bg-destructive/10 w-full mt-2"
                    >
                    <LogOut className="w-5 h-5" />
                    <span>LOG OUT</span>
                    </button>
                )}
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-headline font-bold">STYLE PROFILE</h1>
               {user && <Button variant="outline" className="gold-glow border-primary text-primary hover:bg-primary/10 hover:text-primary font-bold">
                EDIT INFO
              </Button>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass p-6 border-white/10">
                <h3 className="text-xs font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2 tracking-widest"><Ruler className="w-4 h-4"/>PHYSICAL STATS</h3>
                <div className="flex justify-around text-center mt-6">
                  <div>
                    <p className="text-3xl font-bold font-headline text-primary">{profileData.height || '--'}</p>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">HEIGHT (cm)</p>
                  </div>
                   <div>
                    <p className="text-3xl font-bold font-headline text-primary">{profileData.weight || '--'}</p>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">WEIGHT (kg)</p>
                  </div>
                </div>
              </Card>
              <Card className="glass p-6 border-white/10">
                 <h3 className="text-xs font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2 tracking-widest"><Sparkles className="w-4 h-4"/>STYLE PREFERENCES</h3>
                 <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground text-center text-sm">No preferences set yet.</p>
                 </div>
              </Card>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4 tracking-widest">ACCOUNT ACTIVITY</h3>
              <div className="space-y-4">
                 <Card className="glass p-6 flex justify-between items-center border-white/10">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-purple-500/10 flex items-center justify-center rounded-lg border border-purple-500/20">
                            <Shirt className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg">TOTAL FITS BUILT</h4>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">ACROSS ALL TIME</p>
                        </div>
                    </div>
                    <p className="text-4xl font-headline font-black text-white">{profileData.totalFits}</p>
                 </Card>
                 <Card className="glass p-6 flex justify-between items-center border-white/10">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-cyan-500/10 flex items-center justify-center rounded-lg border border-cyan-500/20">
                            <ScanLine className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg">LAST ANALYSIS</h4>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">{profileData.lastAnalysisDate || 'N/A'}</p>
                        </div>
                    </div>
                    {profileData.lastAnalysisScore && <p className="text-xl font-headline font-bold bg-primary/10 text-primary px-4 py-1 rounded-full">{profileData.lastAnalysisScore} Score</p>}
                 </Card>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
