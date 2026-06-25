"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Video, ArrowRight, Play, Zap, Cpu, Crown, Check, 
  ShieldCheck, Sparkles, Image as ImageIcon
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth, useFirestore } from "@/firebase";
import { signInAnonymously } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * 💎 ELITE LANDING NODE: Optimized for SEO and High CTR Conversion.
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
          <Link href="#features" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all">Features</Link>
          <Link href="/templates" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all">Templates</Link>
          <Button asChild variant="outline" className="h-11 rounded-xl bg-white/5 border-white/10 hover:bg-primary/20 transition-all font-bold text-xs uppercase tracking-widest px-8">
             <Link href="/login">Sign In</Link>
          </Button>
        </nav>
      </header>
      
      <main className="flex-1 mt-24">
        <section className="w-full py-24 lg:py-48 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[200px] -z-10" />
          
          <div className="container px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-12 mb-32">
              <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.5em] animate-in fade-in zoom-in duration-700">
                <Sparkles className="w-4 h-4" /> 100% FREE UNLOCKED STUDIO
              </div>
              
              <h1 className="text-7xl md:text-[12rem] font-bold tracking-tighter font-headline max-w-7xl leading-[0.8] uppercase animate-in slide-in-from-bottom-10 duration-1000">
                AI <span className="text-primary italic">Power.</span> <br/>
                <span className="text-white">Zero Cost.</span>
              </h1>
              
              <p className="max-w-3xl text-muted-foreground text-xl md:text-4xl font-medium leading-relaxed italic opacity-80">
                India's first professional AI production studio built for viral growth. Start creating without limits.
              </p>

              <div className="flex flex-col items-center gap-10 w-full max-w-4xl mx-auto pt-10">
                <div className="flex flex-col sm:flex-row gap-8 w-full justify-center">
                  <Button onClick={handleGuestEntry} disabled={loading} className="h-28 px-20 rounded-[3rem] text-3xl font-black uppercase tracking-tight shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 bg-primary border-b-8 border-primary/50 group">
                    {loading ? <Sparkles className="animate-spin mr-4" /> : <Zap className="mr-5 w-10 h-10 fill-current group-hover:animate-pulse" />}
                    Enter Pro Studio
                  </Button>
                </div>

                <div className="flex items-center gap-5 text-[11px] font-black uppercase tracking-[0.6em] text-muted-foreground opacity-30">
                  <ShieldCheck className="w-4 h-4" /> SECURE NEURAL LINK ACTIVE
                </div>
              </div>
            </div>

            <div className="relative max-w-[90rem] mx-auto">
              <div className="premium-card overflow-hidden blue-glow border-2 border-white/5 rounded-[5rem] relative group">
                {heroImg && (
                  <Image
                    alt="VideoMaster AI Studio Hub"
                    className="w-full aspect-[21/9] object-cover opacity-60 group-hover:scale-105 transition-transform duration-[3s]"
                    height={1080}
                    src={heroImg.imageUrl}
                    width={1920}
                    priority
                    data-ai-hint="high tech video editing"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center border-8 border-primary animate-pulse cursor-pointer hover:scale-125 transition-transform">
                      <Play className="w-14 h-14 fill-primary text-primary ml-2" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🛠️ FEATURE MATRIX */}
        <section id="features" className="w-full py-40 border-y border-white/5">
           <div className="container px-6 mx-auto">
              <div className="grid md:grid-cols-3 gap-16">
                 {[
                   { icon: Cpu, title: "Gemini 1.5 Flash", desc: "Engineered for high-speed viral narrative creation and deep script logic." },
                   { icon: Zap, title: "Veo Motion Engine", desc: "Transform cinematic text prompts into professional 4K video assets instantly." },
                   { icon: Crown, title: "Unlocked Pro Node", desc: "Access the entire premium AI suite and 4K exports at zero cost forever." }
                 ].map((feat, i) => (
                   <div key={i} className="space-y-6 text-center group">
                      <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-primary/20 group-hover:scale-110 transition-all shadow-xl">
                        <feat.icon className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-3xl font-headline font-bold text-white uppercase tracking-tight">{feat.title}</h3>
                      <p className="text-muted-foreground italic leading-relaxed">{feat.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      <footer className="py-32 px-10 border-t border-white/5 glass-panel text-center space-y-12">
          <div className="flex items-center justify-center gap-4">
             <Video className="w-10 h-10 text-primary" />
             <span className="text-4xl font-headline font-bold tracking-tighter">VideoMaster<span className="text-primary">AI</span></span>
          </div>
          <div className="flex justify-center gap-16 opacity-50">
             <Link href="/privacy" className="text-xs font-black uppercase tracking-[0.4em] hover:text-primary">Privacy</Link>
             <Link href="/terms" className="text-xs font-black uppercase tracking-[0.4em] hover:text-primary">Terms</Link>
             <Link href="/about" className="text-xs font-black uppercase tracking-[0.4em] hover:text-primary">About</Link>
             <Link href="/help" className="text-xs font-black uppercase tracking-[0.4em] hover:text-primary">Help</Link>
          </div>
          <div className="space-y-4">
             <p className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-[1em]">Production Release v2.5.0 Elite Node</p>
             <p className="text-[9px] text-muted-foreground/20 italic">© 2026 VideoMaster AI Technologies. All neural links reserved.</p>
          </div>
      </footer>
    </div>
  );
}
