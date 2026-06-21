"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Video, ArrowRight, Sparkles, Wand2, 
  Download, Play, Zap, Cpu, BarChart3, Crown, Check, ShieldCheck,
  Search, Globe, MessageSquare, Award
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
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </nav>
      </header>
      
      <main className="flex-1 mt-24">
        {/* 🎬 HERO SECTION - OPTIMIZED FOR H1 RANKING */}
        <section className="w-full py-24 lg:py-40 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10" />
          
          <div className="container px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-12 mb-28">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-bold uppercase tracking-[0.4em]">
                <Award className="w-4 h-4" /> Global No.1 AI Video Studio
              </div>
              <h1 className="text-6xl md:text-[10rem] font-bold tracking-tighter font-headline max-w-7xl leading-[0.85]">
                Master the <span className="text-primary italic">Viral Game.</span>
              </h1>
              <p className="max-w-3xl text-muted-foreground text-xl md:text-3xl font-medium leading-relaxed italic">
                The world's fastest AI Video Maker and Script Writer. Generate professional YouTube Shorts and Reels in seconds using the elite .tech engine.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Button asChild size="lg" className="h-20 px-16 rounded-[2rem] text-xl font-bold shadow-2xl shadow-primary/40 hover:scale-105 transition-all active:scale-95">
                  <Link href="/signup">Start Free Journey <ArrowRight className="ml-3 w-7 h-7" /></Link>
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

        {/* 🛠️ FEATURES SECTION - RICH CONTENT FOR GOOGLE */}
        <section id="features" className="w-full py-40 bg-black/20 border-y border-white/5">
          <div className="container px-6 mx-auto">
            <div className="text-center mb-32 space-y-6">
              <h2 className="text-5xl md:text-8xl font-bold font-headline tracking-tighter">Elite <span className="text-primary italic">Capabilities</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-2xl font-medium italic leading-relaxed">Everything you need to dominate social media, powered by the world's most stable AI engine.</p>
            </div>
            <div className="grid gap-10 lg:grid-cols-4">
              {[
                { 
                  icon: Wand2, 
                  title: "AI Video Creator", 
                  desc: "Transform simple text prompts into cinematic 4K video clips instantly.",
                  color: "primary"
                },
                { 
                  icon: Zap, 
                  title: "Viral Optimizer", 
                  desc: "Generate high-CTR tags and SEO-friendly descriptions for YouTube growth.",
                  color: "indigo-400"
                },
                { 
                  icon: BarChart3, 
                  title: "Neural Scripting", 
                  desc: "Scripts that grab attention. Engineered for Instagram Reels and TikTok virality.",
                  color: "emerald-400"
                },
                { 
                  icon: Globe, 
                  title: "Global Reach", 
                  desc: "Automated captions and translation to reach a worldwide audience.",
                  color: "rose-400"
                }
              ].map((feature, i) => (
                <div key={i} className="premium-card p-12 group hover:scale-[1.02]">
                  <div className="p-5 rounded-[1.5rem] w-fit mb-10 bg-white/5 text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                    <feature.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6 font-headline tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed opacity-80">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ❓ FAQ SECTION - CRITICAL FOR SEARCH RANKING */}
        <section className="w-full py-40 bg-[#05070a]">
          <div className="container px-6 mx-auto max-w-4xl">
             <div className="text-center mb-20">
                <h2 className="text-5xl font-headline font-bold mb-4">Frequently Asked <span className="text-primary">Questions</span></h2>
                <p className="text-muted-foreground italic">Everything you need to know about the world's No.1 AI Video Maker.</p>
             </div>
             
             <Accordion type="single" collapsible className="space-y-4">
                {[
                  { q: "Is VideoMaster AI really free to use?", a: "Yes! Every new user gets 100 free AI credits to start creating cinematic videos and scripts immediately." },
                  { q: "How can I rank my videos on YouTube?", a: "Use our Viral Optimizer tool. It analyzes your content and provides high-CTR titles and trending hashtags automatically." },
                  { q: "Can I use the videos for commercial purposes?", a: "Absolutely. Once generated, you own the full rights to your videos. Premium users also get license-free exports." },
                  { q: "What makes the .tech engine special?", a: "Our proprietary .tech backend ensures 99.9% uptime and 10x faster processing compared to standard AI video editors." }
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

        {/* 💰 PRICING SECTION */}
        <section id="pricing" className="w-full py-40">
          <div className="container px-6 mx-auto">
            <div className="text-center mb-28 space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-[0.3em]">
                <Crown className="w-4 h-4 fill-current" /> Scale Your Empire
              </div>
              <h2 className="text-5xl md:text-8xl font-bold font-headline tracking-tighter">Monetization <span className="text-primary italic">Hub</span></h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-2xl font-medium italic opacity-80">Start free with 100 credits, then upgrade as your channel grows.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {[
                { name: "Starter", price: "$0", features: ["100 Free Credits", "720p Exports", "Basic AI Editor", "Community Support"] },
                { name: "Pro Creator", price: "$9.99", features: ["Unlimited AI Credits", "4K Ultra HD", "Advanced Layering", "Priority Support", "No Watermark"], popular: true },
                { name: "Production", price: "$49.99", features: ["Everything in Pro", "Team Collaboration", "API Integration", "Custom AI Models"] }
              ].map((plan, i) => (
                <div key={i} className={cn(
                  "premium-card p-16 flex flex-col space-y-10 relative overflow-hidden group",
                  plan.popular && "border-primary/40 blue-glow"
                )}>
                  {plan.popular && <div className="absolute top-10 right-10 bg-primary text-white text-[10px] font-bold px-5 py-2 rounded-full uppercase tracking-widest animate-pulse">Best Value</div>}
                  <div className="space-y-4">
                    <h3 className="text-4xl font-bold font-headline tracking-tight">{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-bold tracking-tighter">{plan.price}</span>
                      <span className="text-sm text-muted-foreground font-bold uppercase tracking-widest">/mo</span>
                    </div>
                  </div>
                  <ul className="space-y-6 flex-1 pt-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-4 text-sm font-bold text-muted-foreground group-hover:text-white transition-colors">
                        <Check className="w-5 h-5 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className={cn("h-20 rounded-[1.5rem] font-bold text-xl transition-all active:scale-95", plan.popular ? "bg-primary shadow-2xl shadow-primary/30" : "bg-white/5 border border-white/10 hover:bg-white/10 text-white")}>
                    <Link href="/signup">{plan.price === "$0" ? "Start Creating" : "Go Pro Now"}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-32 px-10 border-t border-white/5 glass-panel">
        <div className="container mx-auto flex flex-col items-center gap-12">
          <div className="flex items-center gap-4">
             <Video className="w-8 h-8 text-primary" />
             <span className="text-3xl font-headline font-bold tracking-tighter">VideoMaster<span className="text-primary">AI.tech</span></span>
          </div>
          <div className="flex flex-wrap justify-center gap-12 text-sm font-bold uppercase tracking-widest text-muted-foreground">
             <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
             <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
             <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
             <Link href="/test-connection" className="hover:text-primary transition-colors">Support</Link>
          </div>
          <p className="text-xs text-muted-foreground/40 font-bold uppercase tracking-[0.5em]">© 2024 VideoMaster AI Tech Hub</p>
        </div>
      </footer>
    </div>
  );
}
