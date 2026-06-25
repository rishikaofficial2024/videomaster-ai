"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Video, Play, Zap, Cpu, Crown, 
  ShieldCheck, Sparkles, Star, Globe, ArrowRight,
  Rocket, MousePointer2, Heart
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth, useFirestore } from "@/firebase";
import { signInAnonymously } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

/**
 * 🚀 PRODUCTION LANDING: VideoMaster AI Elite Gold Release.
 * Optimized for high-conversion and premium prestige branding.
 */
export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-bg");
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGuestEntry = async () => {
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        const guestData = {
          email: "guest@videomaster-ai.tech",
          displayName: "Guest Creator",
          isPremium: true,
          isAdmin: false,
          subscriptionPlan: "pro",
          credits: 999999,
          createdAt: new Date().toISOString(),
          isAnonymous: true
        };

        // 🛡️ PATTERN 1: Non-blocking mutation with contextual error emission
        setDoc(userRef, guestData, { merge: true })
          .catch(async (err) => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: userRef.path,
              operation: 'create',
              requestResourceData: guestData
            } satisfies SecurityRuleContext));
          });
      }

      toast({ title: "Prestige Access Activated", description: "Loading the Elite Studio Workspace..." });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Node Connection Failed", description: "Authentication link interrupted." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020202] selection:bg-primary/30 overflow-x-hidden">
      {/* HEADER */}
      <header className="px-6 lg:px-12 h-24 flex items-center fixed top-0 w-full bg-black/80 backdrop-blur-2xl z-50 border-b border-white/5">
        <Link className="flex items-center justify-center gap-4 group" href="/">
          <div className="bg-gradient-to-br from-primary to-secondary p-2.5 rounded-2xl shadow-glow group-hover:rotate-3 transition-all duration-500">
            <Video className="h-6 w-6 text-black" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter text-white uppercase">VideoMaster<span className="text-primary italic">AI</span></span>
        </Link>
        <nav className="ml-auto hidden lg:flex items-center gap-12">
          <Link href="#features" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all">Features</Link>
          <Link href="/templates" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all">Templates</Link>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-primary transition-all">Sign In</Link>
          <Button onClick={handleGuestEntry} disabled={loading} className="h-11 rounded-full bg-white text-black hover:bg-primary transition-all font-black text-[10px] uppercase tracking-widest px-8 shadow-2xl">
             Try For Free
          </Button>
        </nav>
      </header>
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-32 lg:pt-60 lg:pb-60 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-[250px] -z-10 animate-pulse" />
          
          <div className="container px-6 mx-auto relative">
            <div className="flex flex-col items-center text-center space-y-12 mb-32">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass-panel border-primary/20 backdrop-blur-xl text-primary text-[10px] font-black uppercase tracking-[0.5em] animate-in fade-in zoom-in duration-1000 shadow-glow">
                <Sparkles className="w-4 h-4" /> THE GOLD STANDARD IN PRODUCTION
              </div>
              
              <h1 className="text-7xl md:text-[11rem] font-bold tracking-tighter font-headline max-w-7xl leading-[0.85] uppercase text-white animate-in slide-in-from-bottom-10 duration-1000">
                Produce <span className="text-gradient italic">Gold.</span> <br/>
                <span className="text-white">With AI.</span>
              </h1>
              
              <p className="max-w-3xl text-muted-foreground text-xl md:text-3xl font-medium leading-relaxed italic opacity-60">
                Transform cinematic ideas into professional video assets in seconds. India's #1 Luxury AI Video Studio.
              </p>

              <div className="flex flex-col items-center gap-12 w-full max-w-4xl mx-auto pt-8">
                <div className="flex flex-col sm:flex-row gap-8 w-full justify-center">
                  <Button onClick={handleGuestEntry} disabled={loading} className="h-24 px-16 rounded-full text-2xl font-black uppercase tracking-tight shadow-glow hover:scale-105 active:scale-95 bg-primary text-black border-b-[8px] border-amber-800 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                    {loading ? <Sparkles className="animate-spin mr-4" /> : <Zap className="mr-4 w-8 h-8 fill-current" />}
                    Enter Elite Studio
                  </Button>
                  <Button variant="outline" className="h-24 px-12 rounded-full text-xl font-bold uppercase tracking-widest border-white/10 bg-white/5 text-white hover:bg-primary/10 transition-all backdrop-blur-xl">
                    <Play className="mr-4 fill-current text-primary" /> Watch Showreel
                  </Button>
                </div>

                <div className="flex items-center gap-10 opacity-30">
                  {[Globe, ShieldCheck, Cpu].map((Icon, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <Icon className="w-5 h-5 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Prestige Node</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PREVIEW IMAGE */}
            <div className="relative max-w-[95rem] mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-[5rem] blur opacity-10 group-hover:opacity-25 transition duration-1000" />
              <div className="premium-card overflow-hidden rounded-[5rem] relative group border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.9)]">
                {heroImg && (
                  <Image
                    alt="VideoMaster AI Studio"
                    className="w-full aspect-[21/9] object-cover opacity-40 group-hover:scale-105 transition-transform duration-[8s]"
                    height={1080}
                    src={heroImg.imageUrl}
                    width={1920}
                    priority
                    data-ai-hint="video editing studio"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                
                <div className="absolute bottom-16 left-16 right-16 flex flex-col md:flex-row items-end justify-between gap-10">
                   <div className="space-y-4 max-w-xl">
                      <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 w-fit backdrop-blur-xl">
                         <Star className="w-4 h-4 text-primary fill-current" />
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">Elite Master Tier</span>
                      </div>
                      <h3 className="text-4xl md:text-6xl font-headline font-bold text-white uppercase leading-none tracking-tighter">Designed for <br/> Viral Authority.</h3>
                   </div>
                   <div className="p-8 bg-black/80 backdrop-blur-3xl rounded-[3rem] border border-white/10 flex items-center gap-8 shadow-2xl">
                      <div className="flex flex-col">
                         <span className="text-4xl font-bold text-primary tracking-tighter">0.4s</span>
                         <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Logic Latency</span>
                      </div>
                      <div className="w-px h-12 bg-white/10" />
                      <div className="flex flex-col">
                         <span className="text-4xl font-bold text-primary tracking-tighter">100k+</span>
                         <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Active Assets</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-32 px-10 border-t border-white/5 glass-panel text-center space-y-16">
          <div className="flex flex-col items-center gap-6">
             <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-3xl shadow-glow">
                <Video className="w-10 h-10 text-black" />
             </div>
             <span className="text-5xl font-headline font-bold tracking-tighter text-white uppercase">VideoMaster<span className="text-primary italic">AI.</span></span>
          </div>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-24 opacity-30">
             {['Privacy', 'Terms', 'About', 'Help', 'Security'].map(link => (
               <Link key={link} href={`/${link.toLowerCase()}`} className="text-xs font-black uppercase tracking-[0.5em] hover:text-primary transition-colors">{link}</Link>
             ))}
          </div>
          <div className="space-y-6 max-w-2xl mx-auto">
             <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground font-black uppercase tracking-[0.8em] opacity-40">
                <span>© 2026 VideoMaster AI</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>Developed by Rinku Ganjawala</span>
             </div>
             <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[1em] opacity-10 uppercase">PRODUCTION HUB v5.0.0 • MASTER RELEASE</p>
             <div className="pt-8">
               <Heart className="w-8 h-8 text-primary mx-auto opacity-20 animate-pulse fill-primary" />
             </div>
          </div>
        </footer>
      </main>
    </div>
  );
}