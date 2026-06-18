"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Video, ArrowRight, Sparkles, Wand2, Smartphone, 
  Download, Play, Zap, Globe, Cpu, BarChart3, Crown, Check
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { AdBanner } from "@/components/ads/ad-banner";

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-bg");

  return (
    <div className="flex flex-col min-h-screen bg-background hero-gradient selection:bg-primary/30">
      <header className="px-6 lg:px-12 h-20 flex items-center border-b fixed top-0 w-full bg-background/80 backdrop-blur-xl z-50 border-white/5">
        <Link className="flex items-center justify-center gap-3 group" href="/">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
            <Video className="h-6 w-6 text-white" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter">VideoMaster<span className="text-primary">AI.in</span></span>
        </Link>
        <nav className="ml-auto flex items-center gap-8">
          <div className="hidden md:flex gap-8">
            <Link href="#features" className="text-sm font-semibold hover:text-primary transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-semibold hover:text-primary transition-colors">Pricing</Link>
            <Link href="/templates" className="text-sm font-semibold hover:text-primary transition-colors">Templates</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link className="text-sm font-semibold hover:text-primary transition-colors py-2" href="/login">
              Sign In
            </Link>
            <Button asChild className="rounded-full px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </nav>
      </header>
      
      <main className="flex-1 mt-20">
        <section className="w-full py-20 lg:py-32 overflow-hidden">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-10 mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.3em] animate-in fade-in slide-in-from-bottom-3 duration-1000">
                <Sparkles className="w-3.5 h-3.5" /> India's Elite AI Studio (.in)
              </div>
              <h1 className="text-5xl md:text-9xl font-bold tracking-tighter font-headline max-w-6xl leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                Design <span className="text-primary italic">Viral Content</span> with AI Precision.
              </h1>
              <p className="max-w-[800px] text-muted-foreground text-lg md:text-2xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
                VideoMaster AI is a professional design studio for Indian creators. Generate scripts, thumbnails, and cinematic HD videos automatically on videomaster-ai.in.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
                <Button asChild size="lg" className="h-16 px-12 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                  <Link href="/signup">Claim 100 Free Credits <ArrowRight className="ml-2 w-6 h-6" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl text-lg font-bold bg-background/50 backdrop-blur-sm border-primary/10 hover:bg-primary/5 transition-all">
                  <Play className="mr-2 w-5 h-5 fill-primary text-primary" /> Watch Demo
                </Button>
              </div>
            </div>

            <div className="relative max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-400">
              <div className="absolute -inset-10 bg-primary/20 rounded-[4rem] blur-[120px] opacity-40"></div>
              <div className="relative rounded-[3rem] overflow-hidden border-[12px] border-background shadow-2xl blue-glow bg-background">
                {heroImg && (
                  <Image
                    alt="VideoMaster AI Professional Design Studio"
                    className="w-full aspect-video object-cover"
                    height={720}
                    src={heroImg.imageUrl}
                    width={1280}
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6">
          <AdBanner provider="Google AdSense & AdMob" />
        </section>

        <section id="features" className="w-full py-32">
          <div className="container px-6 mx-auto">
            <div className="text-center mb-24 space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">AI Studio for <span className="text-primary italic">Modern Creators</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-xl font-medium">Empowering Indian YouTubers with Canva-style ease and world-class AI script writing.</p>
            </div>
            <div className="grid gap-8 lg:grid-cols-4">
              {[
                { 
                  icon: Wand2, 
                  title: "Design Studio", 
                  desc: "Experience Canva-like ease with our AI design studio. Drag, drop, and generate in one place.",
                  color: "blue"
                },
                { 
                  icon: Zap, 
                  title: "Viral Reels Maker", 
                  desc: "Automatically generate viral titles, hashtags, and SEO descriptions to rank higher.",
                  color: "orange"
                },
                { 
                  icon: BarChart3, 
                  title: "Pro Script Writer", 
                  desc: "Craft professional video scripts in seconds with our advanced AI script writer engine.",
                  color: "green"
                },
                { 
                  icon: Cpu, 
                  title: "Thumbnail AI", 
                  desc: "Create click-worthy thumbnails that boost your CTR. Elite AI thumbnail maker.",
                  color: "rose"
                }
              ].map((feature, i) => (
                <div key={i} className={cn(
                  "group p-10 rounded-[3rem] border bg-background/50 hover:bg-background hover:shadow-2xl transition-all duration-500 blue-glow border-white/5"
                )}>
                  <div className={cn("p-4 rounded-2xl w-fit mb-8 bg-primary/5 text-primary shadow-sm group-hover:scale-110 transition-transform")}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-headline">{feature.title}</h3>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-32 bg-[#0a0d14]/40">
          <div className="container px-6 mx-auto">
            <div className="text-center mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                <Crown className="w-3 h-3" /> Monetize Your Vision
              </div>
              <h2 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">Elite Plans for <span className="text-primary italic">Viral Growth</span></h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg font-medium italic">Start for free with 100 credits, then upgrade as you earn.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { name: "Starter", price: "₹0", features: ["100 Free Credits", "720p Exports", "Basic AI Studio"] },
                { name: "Pro Studio", price: "₹99", features: ["Unlimited AI Credits", "4K Ultra HD", "Advanced Layering", "No Watermark"], popular: true },
                { name: "Agency", price: "₹499", features: ["Everything in Pro", "Team Collaboration", "Priority AI Queue", "API Access"] }
              ].map((plan, i) => (
                <div key={i} className={cn(
                  "p-12 rounded-[3.5rem] border bg-card/40 backdrop-blur-xl flex flex-col space-y-8 relative overflow-hidden transition-all hover:scale-105",
                  plan.popular ? "border-primary blue-glow" : "border-white/5"
                )}>
                  {plan.popular && <div className="absolute top-8 right-8 bg-primary text-white text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">Best Value</div>}
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold font-headline">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold tracking-tighter">{plan.price}</span>
                      <span className="text-xs text-muted-foreground font-bold">/mo</span>
                    </div>
                  </div>
                  <ul className="space-y-5 flex-1 pt-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-xs font-bold text-muted-foreground/80">
                        <Check className="w-4 h-4 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className={cn("h-16 rounded-2xl font-bold text-lg", plan.popular ? "bg-primary shadow-xl" : "bg-white/5 hover:bg-white/10 text-white")}>
                    <Link href="/signup">{plan.price === "₹0" ? "Start Designing" : "Get Pro Studio"}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-32">
          <div className="container px-6 mx-auto">
            <div className="bg-primary p-16 md:p-32 rounded-[5rem] text-white relative overflow-hidden shadow-2xl shadow-primary/40 text-center">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent)]"></div>
               <div className="relative z-10 space-y-12">
                  <h2 className="text-5xl md:text-8xl font-bold font-headline tracking-tighter leading-tight">Your Viral Channel <br/> Starts Here</h2>
                  <p className="max-w-2xl mx-auto text-primary-foreground/90 text-xl md:text-2xl font-medium">Get 100 free AI credits when you create your account today. The #1 design studio for viral growth.</p>
                  <Button asChild size="lg" variant="secondary" className="h-20 px-20 rounded-[2.5rem] text-2xl font-bold hover:scale-105 transition-all shadow-2xl">
                    <Link href="/signup">Claim My 100 Credits <ArrowRight className="ml-4 w-7 h-7" /></Link>
                  </Button>
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 px-6 border-t bg-background/80 backdrop-blur-xl border-white/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div className="bg-primary p-2 rounded-xl">
                   <Video className="h-7 w-7 text-white" />
                </div>
                <span className="font-headline font-bold text-4xl tracking-tighter">VideoMaster AI</span>
              </div>
              <p className="text-muted-foreground max-w-sm text-xl leading-relaxed">The world's first AI-native design studio built for speed, performance, and viral growth in the Indian creator economy.</p>
            </div>
            <div className="space-y-8">
              <h4 className="font-bold text-xs uppercase tracking-[0.3em] text-primary">Studio</h4>
              <nav className="flex flex-col gap-5 text-muted-foreground font-medium text-base">
                <Link href="/editor" className="hover:text-primary transition-colors">Design Studio India</Link>
                <Link href="/templates" className="hover:text-primary transition-colors">AI Templates</Link>
                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              </nav>
            </div>
            <div className="space-y-8">
              <h4 className="font-bold text-xs uppercase tracking-[0.3em] text-primary">Support</h4>
              <nav className="flex flex-col gap-5 text-muted-foreground font-medium text-base">
                <Link href="#" className="hover:text-primary transition-colors">Help Center</Link>
                <Link href="#" className="hover:text-primary transition-colors">Contact Expert</Link>
                <p className="text-sm text-muted-foreground/60 italic">Email: support@videomaster-ai.web.app</p>
              </nav>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t pt-16 gap-10 border-white/5">
             <div className="flex flex-col md:flex-row items-center gap-8">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.3em]">© 2024 VideoMaster AI India</p>
                <div className="flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                   <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Neural Link: Active</span>
                </div>
             </div>
             <div className="flex gap-6">
                <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 hover:bg-primary/10 hover:text-primary border-white/10"><Smartphone className="w-5 h-5" /></Button>
                <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 hover:bg-primary/10 hover:text-primary border-white/10"><Download className="w-5 h-5" /></Button>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
