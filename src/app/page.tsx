"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Video, Play, Zap, Cpu, Crown, 
  ShieldCheck, Sparkles, Star, Globe, ArrowRight,
  TrendingUp, Rocket, MousePointer2
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
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

      toast({ title: "Studio Access Granted", description: "Loading Unlocked Pro Workspace..." });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Entry Failed", description: "Could not initialize neural link." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#03010a] selection:bg-primary/30 overflow-x-hidden">
      {/* HEADER */}
      <header className="px-6 lg:px-12 h-24 flex items-center fixed top-0 w-full bg-[#03010a]/40 backdrop-blur-xl z-50 border-b border-white/5">
        <Link className="flex items-center justify-center gap-4 group" href="/">
          <div className="bg-gradient-to-br from-primary to-secondary p-2.5 rounded-2xl shadow-glow group-hover:rotate-6 transition-all duration-500">
            <Video className="h-6 w-6 text-white" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter text-white">VideoMaster<span className="text-primary italic">AI</span></span>
        </Link>
        <nav className="ml-auto hidden lg:flex items-center gap-12">
          <Link href="#features" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all">Features</Link>
          <Link href="/templates" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all">Templates</Link>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-primary transition-all">Sign In</Link>
          <Button onClick={handleGuestEntry} disabled={loading} className="h-11 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all font-black text-[10px] uppercase tracking-widest px-8 shadow-xl">
             Try For Free
          </Button>
        </nav>
      </header>
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-32 lg:pt-60 lg:pb-60 overflow-hidden">
          {/* BACKGROUND ELEMENTS */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-primary/10 rounded-full blur-[200px] -z-10 animate-pulse" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] -z-10" />
          
          <div className="container px-6 mx-auto relative">
            <div className="flex flex-col items-center text-center space-y-12 mb-32">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-primary text-[10px] font-black uppercase tracking-[0.4em] animate-in fade-in zoom-in duration-1000 shadow-2xl">
                <Sparkles className="w-4 h-4 animate-pulse" /> THE NEURAL REVOLUTION IS HERE
              </div>
              
              <h1 className="text-7xl md:text-[11rem] font-bold tracking-tighter font-headline max-w-7xl leading-[0.85] uppercase text-white animate-in slide-in-from-bottom-10 duration-1000">
                Create <span className="text-gradient italic">Viral</span> <br/>
                <span className="text-white">With AI.</span>
              </h1>
              
              <p className="max-w-3xl text-muted-foreground text-xl md:text-3xl font-medium leading-relaxed italic opacity-70">
                Transform cinematic ideas into professional production assets in seconds. India's #1 AI Video Studio for modern creators.
              </p>

              <div className="flex flex-col items-center gap-12 w-full max-w-4xl mx-auto pt-8">
                <div className="flex flex-col sm:flex-row gap-8 w-full justify-center">
                  <Button onClick={handleGuestEntry} disabled={loading} className="h-24 px-16 rounded-full text-2xl font-black uppercase tracking-tight shadow-glow hover:scale-105 active:scale-95 bg-primary border-b-8 border-primary/50 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                    {loading ? <Sparkles className="animate-spin mr-4" /> : <Zap className="mr-4 w-8 h-8 fill-current" />}
                    Enter Pro Studio
                  </Button>
                  <Button variant="outline" className="h-24 px-12 rounded-full text-xl font-bold uppercase tracking-widest border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all backdrop-blur-xl">
                    <Play className="mr-4 fill-current" /> Watch Demo
                  </Button>
                </div>

                <div className="flex items-center gap-10 opacity-30">
                  {[Globe, ShieldCheck, Cpu].map((Icon, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <Icon className="w-5 h-5 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Verified Node</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PREVIEW IMAGE */}
            <div className="relative max-w-[95rem] mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-[5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="premium-card overflow-hidden rounded-[5rem] relative group border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                {heroImg && (
                  <Image
                    alt="VideoMaster AI Elite Hub"
                    className="w-full aspect-[21/9] object-cover opacity-50 group-hover:scale-105 transition-transform duration-[4s]"
                    height={1080}
                    src={heroImg.imageUrl}
                    width={1920}
                    priority
                    data-ai-hint="luxury video editing setup"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#03010a] via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-16 left-16 right-16 flex flex-col md:flex-row items-end justify-between gap-10">
                   <div className="space-y-4 max-w-xl">
                      <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 w-fit">
                         <Star className="w-4 h-4 text-primary fill-current" />
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">Top Rated Studio</span>
                      </div>
                      <h3 className="text-4xl md:text-6xl font-headline font-bold text-white uppercase leading-none">Designed for <br/> Elite Creators.</h3>
                   </div>
                   <div className="p-8 bg-black/60 backdrop-blur-2xl rounded-[3rem] border border-white/10 flex items-center gap-8 shadow-2xl">
                      <div className="flex flex-col">
                         <span className="text-4xl font-bold text-primary tracking-tighter">0.4s</span>
                         <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Node Latency</span>
                      </div>
                      <div className="w-px h-12 bg-white/10" />
                      <div className="flex flex-col">
                         <span className="text-4xl font-bold text-accent tracking-tighter">100k+</span>
                         <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Active Users</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE GRID */}
        <section id="features" className="w-full py-40 border-y border-white/5 relative bg-black/20">
           <div className="container px-6 mx-auto">
              <div className="text-center mb-32 space-y-4">
                 <h2 className="text-6xl md:text-8xl font-headline font-bold text-white uppercase tracking-tighter">The <span className="text-gradient">Power</span> Stack</h2>
                 <p className="text-xl text-muted-foreground italic max-w-2xl mx-auto">Every tool you need to dominate the attention economy.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-16">
                 {[
                   { icon: Cpu, title: "Neural Logic", desc: "Powered by Gemini 1.5 Pro for deep narrative understanding and complex script generation.", color: "text-primary" },
                   { icon: Zap, title: "Veo Motion", desc: "State-of-the-art text-to-video synthesis engine for professional-grade 4K motion assets.", color: "text-accent" },
                   { icon: MousePointer2, title: "One-Tap Edit", desc: "An intelligent VN-style editor optimized for high-speed mobile and web workflows.", color: "text-secondary" }
                 ].map((feat, i) => (
                   <div key={i} className="premium-card p-12 text-center group space-y-8 h-full">
                      <div className={cn("w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center mx-auto border border-white/10 group-hover:scale-110 transition-all duration-500 shadow-2xl", feat.color)}>
                        <feat.icon className="w-10 h-10" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-3xl font-headline font-bold text-white uppercase tracking-tight">{feat.title}</h3>
                        <p className="text-muted-foreground italic leading-relaxed opacity-60">{feat.desc}</p>
                      </div>
                      <div className="pt-4 flex items-center justify-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all">
                         <span className="text-[10px] font-black uppercase tracking-widest">Learn Protocol</span>
                         <ArrowRight className="w-4 h-4" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-40 relative">
           <div className="container px-6 mx-auto">
              <div className="max-w-6xl mx-auto glass-panel rounded-[5rem] p-16 md:p-32 text-center space-y-12 relative overflow-hidden purple-glow">
                 <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12">
                    <Rocket className="w-96 h-96 text-primary" />
                 </div>
                 <div className="space-y-6 relative z-10">
                    <h2 className="text-7xl md:text-[10rem] font-headline font-black text-white leading-none uppercase tracking-tighter">Ready to <br/> Go <span className="text-gradient">Viral?</span></h2>
                    <p className="text-2xl md:text-4xl text-muted-foreground font-medium italic opacity-60 max-w-4xl mx-auto">Stop editing manually. Join 100k+ creators scaling their reach with neural intelligence.</p>
                 </div>
                 <Button onClick={handleGuestEntry} disabled={loading} className="h-28 px-24 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all font-black text-3xl uppercase tracking-tight shadow-2xl relative z-10">
                    Start Creating Now
                 </Button>
              </div>
           </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-32 px-10 border-t border-white/5 glass-panel text-center space-y-16">
          <div className="flex flex-col items-center gap-6">
             <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-3xl shadow-glow">
                <Video className="w-10 h-10 text-white" />
             </div>
             <span className="text-5xl font-headline font-bold tracking-tighter text-white">VideoMaster<span className="text-primary italic">AI.</span></span>
          </div>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-24 opacity-60">
             {['Privacy', 'Terms', 'About', 'Help', 'Security'].map(link => (
               <Link key={link} href={`/${link.toLowerCase()}`} className="text-xs font-black uppercase tracking-[0.5em] hover:text-primary transition-colors">{link}</Link>
             ))}
          </div>
          <div className="space-y-6 max-w-xl mx-auto">
             <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[1em] opacity-30">ELITE PRODUCTION NODE v3.5.0</p>
             <p className="text-sm text-muted-foreground/40 italic leading-relaxed">
               © 2026 VideoMaster AI Technologies. High-performance video synthesis powered by Google Deep Research Labs.
             </p>
          </div>
      </footer>
    </div>
  );
}