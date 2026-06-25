"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Zap, Sparkles, Youtube, Instagram, Share2, Play, CheckCircle2, ArrowRight, ShieldCheck, Globe, Star } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-main');

  return (
    <div className="flex flex-col min-h-screen bg-[#020202] hero-gradient selection:bg-primary/30">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-48">
          <div className="container px-4 md:px-6 mx-auto relative z-10 text-center space-y-12">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-8 py-3 text-xs font-black text-primary border border-primary/20 animate-in fade-in zoom-in duration-700 shadow-2xl">
              <Sparkles className="mr-3 h-4 w-4 animate-pulse" />
              ELITE NEURAL PRODUCTION SUITE ACTIVE
            </div>
            
            <div className="space-y-6 max-w-5xl mx-auto">
              <h1 className="text-6xl font-black tracking-tight sm:text-8xl md:text-9xl leading-[0.85] uppercase">
                Viral Vision <br />
                <span className="text-gradient italic">Automated.</span>
              </h1>
              <p className="mx-auto max-w-[900px] text-muted-foreground text-xl md:text-3xl font-medium leading-relaxed opacity-70 italic">
                From simple text to 4K cinematic sequences. No skill required. <br className="hidden md:block" /> Powered by Gemini 1.5 & Veo engines.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button asChild size="lg" className="rounded-full px-16 h-20 text-2xl font-black shadow-2xl shadow-primary/40 group relative overflow-hidden active:scale-95 transition-all">
                <Link href="/dashboard">
                  <span className="relative z-10 flex items-center gap-3">START CREATING FREE <ArrowRight className="group-hover:translate-x-1 transition-transform" /></span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-16 h-20 text-2xl font-black border-2 bg-white/5 hover:bg-white/10 transition-all active:scale-95">
                <Play className="mr-3 h-6 w-6 fill-current" /> SYSTEM DEMO
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-12 pt-16 opacity-40">
               <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /><span className="text-xs font-black uppercase tracking-widest">No Credit Card</span></div>
               <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /><span className="text-xs font-black uppercase tracking-widest">Enterprise Ready</span></div>
               <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /><span className="text-xs font-black uppercase tracking-widest">4K Lossless</span></div>
            </div>
          </div>
          
          <div className="mt-32 relative mx-auto max-w-7xl px-4 animate-in slide-in-from-bottom-20 duration-1000 group">
            <div className="absolute -inset-4 bg-primary/10 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-[#0a0a0a] rounded-[3.5rem] border-2 border-white/5 shadow-[0_50px_150px_-20px_rgba(0,0,0,1)] overflow-hidden">
              {heroImg && (
                <Image
                  alt="VideoMaster AI Elite Editor"
                  className="w-full object-cover opacity-80 group-hover:scale-[1.01] transition-transform duration-1000"
                  height={900}
                  src={heroImg.imageUrl}
                  width={1800}
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </section>

        {/* Features Matrix */}
        <section className="w-full py-32 md:py-60 bg-white/[0.01]">
          <div className="container px-4 md:px-6 mx-auto space-y-24">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-none uppercase">The Neural <br /> <span className="text-primary italic">Standard.</span></h2>
              <p className="text-muted-foreground text-xl md:text-3xl font-medium opacity-60 leading-relaxed italic">
                We've combined professional production nodes into a single, seamless workspace.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { icon: Sparkles, title: "Script Engineering", desc: "Precision-optimized narratives for YouTube, Instagram, and TikTok algorithms.", color: "text-blue-500", bg: "bg-blue-500/10" },
                { icon: Zap, title: "Neural Subtitles", desc: "Synchronized WebVTT captions with 99.8% semantic accuracy.", color: "text-amber-500", bg: "bg-amber-500/10" },
                { icon: Youtube, title: "Shorts Generator", desc: "Smart framing technology converts long-form content into viral clips.", color: "text-red-500", bg: "bg-red-500/10" },
                { icon: Globe, title: "Global CDN Sync", desc: "Start on mobile, finalize on desktop. Instant cloud project persistence.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
                { icon: ShieldCheck, title: "Enterprise Safety", desc: "Data isolation nodes protected by Google's App Check technology.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { icon: Video, title: "Veo Motion Engine", desc: "Flagship text-to-video synthesis for cinematic background sequences.", color: "text-purple-500", bg: "bg-purple-500/10" }
              ].map((feat, i) => (
                <Card key={i} className="premium-card p-12 rounded-[3.5rem] group border-white/5">
                  <CardContent className="p-0 space-y-10">
                    <div className={cn("p-6 rounded-[2rem] w-fit shadow-2xl transition-all group-hover:scale-110 duration-500", feat.bg, feat.color)}>
                      <feat.icon className="h-10 w-10" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-3xl font-black uppercase tracking-tight">{feat.title}</h3>
                       <p className="text-muted-foreground leading-relaxed text-lg font-medium opacity-70 italic">
                         {feat.desc}
                       </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final Matrix CTA */}
        <section className="w-full py-40 md:py-60 bg-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-white/10 blur-[200px] -translate-y-1/2 translate-x-1/2 rounded-full animate-pulse" />
          <div className="container px-4 md:px-6 mx-auto text-center space-y-12 relative z-10">
            <h2 className="text-6xl font-black tracking-tight sm:text-[10rem] text-primary-foreground leading-[0.8] uppercase">Launch Your <br /> Empire.</h2>
            <p className="mx-auto max-w-[1000px] text-2xl md:text-5xl text-primary-foreground/90 font-black italic leading-[1.1] uppercase">
              Join 10,000+ creators scaling their reach <br className="hidden md:block" /> with neural intelligence.
            </p>
            <div className="pt-12">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-20 h-28 text-4xl font-black shadow-[0_40px_100px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all text-primary">
                <Link href="/dashboard" className="flex items-center gap-6 tracking-tighter">GET STARTED <ArrowRight className="h-12 w-12" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-32 px-4 md:px-6 bg-[#020202]">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-24">
          <div className="flex flex-col gap-10 max-w-sm">
            <Link className="flex items-center gap-3 group" href="/">
              <div className="bg-primary p-2.5 rounded-2xl shadow-xl">
                <Video className="h-8 w-8 text-primary-foreground" />
              </div>
              <span className="font-black text-3xl tracking-tighter uppercase">VideoMaster<span className="text-primary italic">AI</span></span>
            </Link>
            <p className="text-xl text-muted-foreground font-medium italic opacity-60">Empowering the next generation of storytellers with neural production standards.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-24">
             <div className="flex flex-col gap-6">
                <span className="font-black text-[10px] uppercase tracking-[0.4em] text-primary/50">Infrastructure</span>
                <Link href="/features" className="text-lg font-bold text-white hover:text-primary transition-colors uppercase tracking-tight">AI Editor</Link>
                <Link href="/pricing" className="text-lg font-bold text-white hover:text-primary transition-colors uppercase tracking-tight">Elite Access</Link>
                <Link href="/ai-tools" className="text-lg font-bold text-white hover:text-primary transition-colors uppercase tracking-tight">Neural Hub</Link>
             </div>
             <div className="flex flex-col gap-6">
                <span className="font-black text-[10px] uppercase tracking-[0.4em] text-primary/50">Governance</span>
                <Link href="/about" className="text-lg font-bold text-white hover:text-primary transition-colors uppercase tracking-tight">The Vision</Link>
                <Link href="/contact" className="text-lg font-bold text-white hover:text-primary transition-colors uppercase tracking-tight">Connect Node</Link>
                <Link href="/terms" className="text-lg font-bold text-white hover:text-primary transition-colors uppercase tracking-tight">Protocols</Link>
             </div>
             <div className="hidden sm:flex flex-col gap-6">
                <span className="font-black text-[10px] uppercase tracking-[0.4em] text-primary/50">Verified Nodes</span>
                <div className="flex items-center gap-4 text-white/40">
                   <Youtube size={24} />
                   <Instagram size={24} />
                   <Share2 size={24} />
                </div>
             </div>
          </div>
        </div>
        <div className="container mx-auto mt-40 pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30">
          <p>© 2026 VideoMaster AI Technologies. Developed by Rinku Ganjawala.</p>
          <div className="flex gap-12">
             <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Node</Link>
             <Link href="/cookies" className="hover:text-primary transition-colors">Cookies Ledger</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
