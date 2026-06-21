"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Video, ArrowRight, Sparkles, Wand2, 
  Download, Play, Zap, Cpu, BarChart3, Crown, Check, ShieldCheck,
  Search, Globe, MessageSquare, Award, Gift, Coins
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-bg");

  return (
    <div className="flex flex-col min-h-screen bg-[#05070a] hero-gradient selection:bg-primary/30">
      {/* 🚀 ELITE NAVBAR */}
      <header className="px-6 lg:px-12 h-24 flex items-center fixed top-0 w-full bg-[#05070a]/80 backdrop-blur-3xl z-50 border-b border-white/5">
        <Link className="flex items-center justify-center gap-4 group" href="/">
          <div className="bg-primary p-2.5 rounded-2xl shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
            <Video className="h-6 w-6 text-white" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter">VideoMaster<span className="text-primary italic">AI.tech</span></span>
        </Link>
        <nav className="ml-auto flex items-center gap-10">
          <div className="hidden lg:flex gap-10">
            <Link href="#features" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">Features</Link>
            <Link href="#pricing" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">Pricing</Link>
            <Link href="/templates" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">Templates</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all" href="/login">
              Sign In
            </Link>
            <Button asChild className="rounded-full px-10 h-14 font-bold shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
              <Link href="/signup">Claim 100 Free Credits</Link>
            </Button>
          </div>
        </nav>
      </header>
      
      <main className="flex-1 mt-24">
        {/* 🎬 HERO SECTION - OPTIMIZED FOR "FREE" CONVERSION */}
        <section className="w-full py-24 lg:py-40 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10" />
          
          <div className="container px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-12 mb-28">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.4em] animate-pulse">
                <Gift className="w-4 h-4" /> 100% Free to Get Started
              </div>
              <h1 className="text-6xl md:text-[10rem] font-bold tracking-tighter font-headline max-w-7xl leading-[0.85]">
                AI Video Studio <span className="text-primary italic">For Free.</span>
              </h1>
              <p className="max-w-3xl text-muted-foreground text-xl md:text-3xl font-medium leading-relaxed italic">
                Generate professional YouTube Shorts and Reels instantly. Claim <span className="text-white font-bold">100 FREE credits</span> on signup and earn more by watching ads. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Button asChild size="lg" className="h-20 px-16 rounded-[2rem] text-xl font-bold shadow-2xl shadow-primary/40 hover:scale-105 transition-all active:scale-95 bg-primary">
                  <Link href="/signup">Claim My Free Credits <ArrowRight className="ml-3 w-7 h-7" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="h-20 px-16 rounded-[2rem] text-xl font-bold bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <Play className="mr-3 w-6 h-6 fill-primary text-primary" /> Watch Demo
                </Button>
              </div>
            </div>

            <div className="relative max-w-7xl mx-auto">
              <div className="premium-card overflow-hidden blue-glow">
                {heroImg && (
                  <Image
                    alt="AI Video Generator Dashboard Preview"
                    className="w-full aspect-video object-cover opacity-80"
                    height={720}
                    src={heroImg.imageUrl}
                    width={1280}
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 🛠️ REWARDS SECTION - EXPLAINING THE FREE ENGINE */}
        <section className="w-full py-40 bg-indigo-500/5 border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent opacity-50" />
          <div className="container px-6 mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                    <Coins className="w-4 h-4" /> Infinite Economy
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter text-white">Create Without <span className="text-indigo-400 italic">Limits.</span></h2>
                  <p className="text-muted-foreground text-xl leading-relaxed italic">
                    Our unique **Reward Protocol** allows you to earn AI credits by viewing high-value professional ads. No need for expensive subscriptions—just create, earn, and dominate.
                  </p>
                  <ul className="space-y-6">
                     {[
                       "Instant 100 Credits on Identity Verification",
                       "+20 Credits for every Rewarded Placement viewed",
                       "Full access to AI Scripting & Cinematic Engines",
                       "No hidden fees or recurring charges"
                     ].map((feat, i) => (
                       <li key={i} className="flex items-center gap-4 text-white font-bold italic">
                          <Check className="w-6 h-6 text-emerald-500" /> {feat}
                       </li>
                     ))}
                  </ul>
                  <Button asChild size="lg" className="h-16 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20">
                     <Link href="/signup">Start Free Journey</Link>
                  </Button>
               </div>
               <div className="relative">
                  <div className="premium-card p-2 aspect-video bg-black/40 overflow-hidden blue-glow flex items-center justify-center">
                     <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                           <Play className="w-10 h-10 text-primary" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em]">Rewarded Impression Active</p>
                        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
                           <div className="h-full bg-primary animate-progress" />
                        </div>
                     </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 bg-[#0a0d14] border border-white/10 p-6 rounded-[2rem] shadow-2xl">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                           <Coins className="text-emerald-400" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase">Credits Earned</p>
                           <p className="text-xl font-bold text-white">+500 Today</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* ❓ FAQ SECTION */}
        <section className="w-full py-40 bg-[#05070a]">
          <div className="container px-6 mx-auto max-w-4xl">
             <div className="text-center mb-20">
                <h2 className="text-5xl font-headline font-bold mb-4">Common <span className="text-primary">Questions</span></h2>
                <p className="text-muted-foreground italic">How we keep VideoMaster AI 100% accessible.</p>
             </div>
             
             <Accordion type="single" collapsible className="space-y-4">
                {[
                  { q: "Is it actually free?", a: "Yes. Every tool in the studio can be used for free by using the credits you get on signup or earn through our rewards system." },
                  { q: "How do I earn more credits?", a: "Simply click the 'Watch Ad' button in your dashboard. Each 15-second professional ad gives you +20 credits instantly." },
                  { q: "Can I remove watermarks for free?", a: "Watermarks are included in the free tier. Upgrading to Pro removes them, but free users still get high-quality HD exports." },
                  { q: "Where can I share my invite link?", a: "In your dashboard Expansion Hub, you'll find a message ready to be sent to WhatsApp, Instagram, or Telegram." }
                ].map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-white/5 bg-white/5 rounded-3xl px-8 py-2">
                    <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-primary transition-colors">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base italic leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
             </Accordion>
          </div>
        </section>

      </main>

      <footer className="py-32 px-10 border-t border-white/5 glass-panel">
        <div className="container mx-auto flex flex-col items-center gap-12">
          <div className="flex items-center gap-4">
             <Video className="w-8 h-8 text-primary" />
             <span className="text-3xl font-headline font-bold tracking-tighter">VideoMaster<span className="text-primary">AI.tech</span></span>
          </div>
          <p className="text-xs text-muted-foreground/40 font-bold uppercase tracking-[0.5em]">Made for creators, by creators. 100% Accessible.</p>
        </div>
      </footer>
    </div>
  );
}
