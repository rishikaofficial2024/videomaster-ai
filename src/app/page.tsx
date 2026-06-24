
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Video, ArrowRight, Play, Zap, Cpu, Crown, Check, 
  Gift, Coins, UserCircle, ShieldCheck, Sparkles
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
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
          email: "guest@videomaster.ai",
          displayName: "Guest Creator",
          isPremium: false,
          isAdmin: false,
          subscriptionPlan: "free",
          credits: 100,
          createdAt: new Date().toISOString(),
          isAnonymous: true
        }, { merge: true });
      }

      toast({ title: "Welcome Guest!", description: "100 FREE Credits assigned to your node." });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Entry Failed", description: "Could not initialize neural link." });
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
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.4em] animate-pulse">
                <Gift className="w-4 h-4" /> 100 FREE CREDITS FOR GUESTS
              </div>
              
              <h1 className="text-6xl md:text-[10rem] font-bold tracking-tighter font-headline max-w-7xl leading-[0.85] uppercase">
                AI Studio <span className="text-primary italic">Unlocked.</span>
              </h1>
              
              <p className="max-w-3xl text-muted-foreground text-xl md:text-3xl font-medium leading-relaxed italic">
                No password required. Enter as a guest and claim your <span className="text-white font-bold">100 FREE credits</span> instantly.
              </p>

              <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                  <Button onClick={handleGuestEntry} disabled={loading} size="lg" className="h-24 px-16 rounded-[2.5rem] text-2xl font-black uppercase tracking-tight shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-all active:scale-95 bg-indigo-600 border-b-4 border-indigo-900 group">
                    {loading ? <Sparkles className="animate-spin mr-3" /> : <Zap className="mr-4 w-8 h-8 fill-current group-hover:animate-pulse" />}
                    Skip Login & Enter
                  </Button>
                  
                  <Button asChild variant="outline" size="lg" className="h-24 px-12 rounded-[2.5rem] text-xl font-black uppercase tracking-tight bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-all group">
                    <Link href="/login">
                      <UserCircle className="mr-3 w-7 h-7 text-primary group-hover:scale-110 transition-transform" /> 
                      Sign In (Owner)
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-40">
                  <ShieldCheck className="w-3 h-3" /> Anonymous Node Access Protocol Active
                </div>
              </div>
            </div>

            <div className="relative max-w-7xl mx-auto">
              <div className="premium-card overflow-hidden blue-glow border-2 border-white/5 rounded-[4rem]">
                {heroImg && (
                  <Image
                    alt="AI Video Generator Dashboard Preview"
                    className="w-full aspect-video object-cover opacity-60"
                    height={720}
                    src={heroImg.imageUrl}
                    width={1280}
                    priority
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

        <section id="features" className="w-full py-40 bg-indigo-500/5 border-y border-white/5 relative overflow-hidden">
          <div className="container px-6 mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                    <Coins className="w-4 h-4" /> ZERO FRICTION ENTRY
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter text-white">Start Creating <span className="text-indigo-400 italic">Immediately.</span></h2>
                  <p className="text-muted-foreground text-xl leading-relaxed italic">
                    Click "Skip Login" to enter the studio as a guest. Earn more credits by watching ads, or register later to save your projects permanently.
                  </p>
                  <ul className="space-y-6">
                     {[
                       "No Password Needed for Guest Entry",
                       "100 FREE Credits instantly on Guest Start",
                       "+20 Credits for Ad impressions",
                       "Full access to AI Script & Video tools"
                     ].map((feat, i) => (
                       <li key={i} className="flex items-center gap-4 text-white font-bold italic">
                          <Check className="w-6 h-6 text-emerald-500" /> {feat}
                       </li>
                     ))}
                  </ul>
                  <Button onClick={handleGuestEntry} disabled={loading} size="lg" className="h-16 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl">
                     Launch Guest Node
                  </Button>
               </div>
               <div className="relative">
                  <div className="premium-card p-2 aspect-video bg-black/40 overflow-hidden blue-glow flex items-center justify-center rounded-[3rem]">
                     <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                           <Zap className="w-10 h-10 text-primary" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em]">Assigning Guest Node...</p>
                        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
                           <div className="h-full bg-primary animate-progress" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        <section className="w-full py-40 bg-[#05070a]">
          <div className="container px-6 mx-auto max-w-4xl">
             <div className="text-center mb-20">
                <h2 className="text-5xl font-headline font-bold mb-4 uppercase tracking-tighter">Guest <span className="text-primary">FAQ</span></h2>
                <p className="text-muted-foreground italic tracking-widest text-xs font-black uppercase opacity-40">Zero Friction Policy</p>
             </div>
             
             <Accordion type="single" collapsible className="space-y-4">
                {[
                  { q: "Can I enter without a password?", a: "Yes. Use the 'Skip Login' or 'Guest Entry' button to start using AI tools instantly." },
                  { q: "Will I lose my credits as a guest?", a: "No. Credits stay on your device session. You can link your account later to save them permanently." },
                  { q: "Is anonymous access safe?", a: "100%. We use Firebase Anonymous Authentication to provide secure temporary nodes for all creators." }
                ].map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-white/5 bg-white/5 rounded-3xl px-8 py-2">
                    <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-primary transition-colors uppercase tracking-tight">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base italic leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
             </Accordion>
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
          <p className="text-[9px] text-muted-foreground/30 font-black uppercase tracking-[0.8em]">Production Build v1.7.0 Guest Ready</p>
        </div>
      </footer>
    </div>
  );
}
