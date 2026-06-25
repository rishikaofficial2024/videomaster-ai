"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Video, ArrowRight, Play, Zap, Cpu, Crown, Check, 
  ShieldCheck, Sparkles, Image as ImageIcon
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth, useFirestore } from "@/firebase";
import { signInAnonymously } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
        await setDoc(userRef, {
          email: "guest@videomaster-ai.tech",
          displayName: "Guest Creator",
          isPremium: true,
          isAdmin: false,
          subscriptionPlan: "pro",
          credits: 999999,
          createdAt: new Date().toISOString(),
          isAnonymous: true
        }, { merge: true });
      }

      toast({ title: "Welcome Guest!", description: "100% Free Pro Access Active." });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Entry Failed", description: "Could not initialize Gemini Fast AI link." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#05070a] hero-gradient selection:bg-primary/30">
      <header className="px-6 lg:px-12 h-24 flex items-center fixed top-0 w-full bg-[#05070a]/80 backdrop-blur-3xl z-50 border-b border-white/5">
        <Link className="flex items-center justify-center gap-4 group" href="/">
          <div className="bg-primary p-2.5 rounded-2xl shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
            <Video className="h-6 w-6 text-white" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter">VideoMaster<span className="text-primary italic">AI</span></span>
        </Link>
        <nav className="ml-auto hidden lg:flex items-center gap-10">
          <Link href="#features" className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all">Features</Link>
          <Link href="#pricing" className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all">Pricing</Link>
          <Button asChild variant="outline" className="h-10 rounded-xl bg-white/5 border-white/10 hover:bg-primary/20 transition-all font-bold text-xs uppercase tracking-widest px-6">
             <Link href="/login">Sign In</Link>
          </Button>
        </nav>
      </header>
      
      <main className="flex-1 mt-24">
        <section className="w-full py-24 lg:py-40 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10" />
          
          <div className="container px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-12 mb-28">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.4em]">
                <Sparkles className="w-4 h-4" /> 100% FREE PRO ACCESS FOR EVERYONE
              </div>
              
              <h1 className="text-6xl md:text-[10rem] font-bold tracking-tighter font-headline max-w-7xl leading-[0.85] uppercase">
                Free <span className="text-primary italic">Studio.</span>
              </h1>
              
              <p className="max-w-3xl text-muted-foreground text-xl md:text-3xl font-medium leading-relaxed italic">
                Experience high-speed video production without limits. Enter as a guest and claim <span className="text-white font-bold">Full Pro Access</span> for free.
              </p>

              <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                  <Button onClick={handleGuestEntry} disabled={loading} size="lg" className="h-24 px-16 rounded-[2.5rem] text-2xl font-black uppercase tracking-tight shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-all active:scale-95 bg-indigo-600 border-b-4 border-indigo-900 group">
                    {loading ? <Sparkles className="animate-spin mr-3" /> : <Zap className="mr-4 w-8 h-8 fill-current group-hover:animate-pulse" />}
                    Enter Free Studio
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-40">
                  <ShieldCheck className="w-3 h-3" /> Zero Cost Production Protocol Active
                </div>
              </div>
            </div>

            <div className="relative max-w-7xl mx-auto">
              <div className="premium-card overflow-hidden blue-glow border-2 border-white/5 rounded-[4rem]">
                {heroImg && (
                  <Image
                    alt="Gemini AI Video Generator Preview"
                    className="w-full aspect-video object-cover opacity-60"
                    height={720}
                    src={heroImg.imageUrl}
                    width={1280}
                    priority
                    data-ai-hint="video studio"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border-4 border-primary animate-pulse cursor-pointer hover:scale-110 transition-transform">
                      <Play className="w-10 h-10 fill-primary text-primary ml-1" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🐢 OPTIMIZED RENDERING TEST SECTION */}
        <section className="w-full py-40 border-y border-white/5">
           <div className="container px-6 mx-auto text-center space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-headline font-black uppercase tracking-tight">Optimized Rendering Test</h2>
                <p className="text-muted-foreground italic">Verifying Custom Image Loader Protocol...</p>
              </div>
              <div className="max-w-sm mx-auto p-4 bg-white/5 rounded-[3rem] border border-white/10 shadow-2xl relative group overflow-hidden">
                 <Image 
                   alt="turtles" 
                   src="https://picsum.photos/seed/turtles/600/600" 
                   width={300} 
                   height={300} 
                   className="rounded-[2.5rem] mx-auto grayscale group-hover:grayscale-0 transition-all duration-700"
                   data-ai-hint="turtles underwater"
                 />
                 <div className="mt-6 flex items-center justify-center gap-3 text-primary">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Custom Loader Verified</span>
                 </div>
              </div>
           </div>
        </section>

        <section id="features" className="w-full py-40 bg-indigo-500/5 relative overflow-hidden">
          <div className="container px-6 mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                    <Crown className="w-4 h-4" /> UNLOCKED CREATIVE HUB
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter text-white">100% Free <span className="text-indigo-400 italic">Forever.</span></h2>
                  <p className="text-muted-foreground text-xl leading-relaxed italic">
                    Launch Gemini Fast AI tools without any paywalls. Enter as a guest, enjoy unlimited credits, and scale your channel for free.
                  </p>
                  <ul className="space-y-6">
                     {[
                       "Instant Guest Access (No Password Required)",
                       "Unlimited Pro Credits for All Users",
                       "Unlocked 4K Exports & Premium Models",
                       "Full Access to Script & Motion Engines"
                     ].map((feat, i) => (
                       <li key={i} className="flex items-center gap-4 text-white font-bold italic">
                          <Check className="w-6 h-6 text-emerald-500" /> {feat}
                       </li>
                     ))}
                  </ul>
               </div>
               <div className="relative">
                  <div className="premium-card p-2 aspect-video bg-black/40 overflow-hidden blue-glow flex items-center justify-center rounded-[3rem]">
                     <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                           <Crown className="w-10 h-10 text-primary" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em]">Activating Unlimited Pro Mode...</p>
                        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
                           <div className="h-full bg-primary animate-progress" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-10 border-t border-white/5 glass-panel">
        <div className="container mx-auto flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
             <Video className="w-8 h-8 text-primary" />
             <span className="text-3xl font-headline font-bold tracking-tighter">VideoMaster<span className="text-primary">AI</span></span>
          </div>
          <div className="flex gap-10 opacity-40">
             <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary">Privacy</Link>
             <Link href="/terms" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary">Terms</Link>
          </div>
          <p className="text-[9px] text-muted-foreground/30 font-black uppercase tracking-[0.8em]">Production Build v2.5.0 Free Unlocked</p>
        </div>
      </footer>
    </div>
  );
}