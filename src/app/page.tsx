import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Zap, Sparkles, Youtube, Instagram, Share2, Play, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-main');

  return (
    <div className="flex flex-col min-h-screen bg-background hero-gradient selection:bg-primary/30">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 h-20 border-b glass-panel z-50">
        <div className="max-w-7xl mx-auto h-full px-4 lg:px-8 flex items-center justify-between">
          <Link className="flex items-center justify-center gap-2 group" href="/">
            <div className="bg-primary p-1.5 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Video className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-black text-2xl tracking-tighter">VideoMaster<span className="text-primary italic">AI</span></span>
          </Link>
          <nav className="hidden sm:flex items-center gap-8">
            <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="/features">Features</Link>
            <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="/pricing">Pricing</Link>
            <Button asChild variant="outline" className="rounded-full px-6 font-bold" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full px-8 font-bold shadow-lg shadow-primary/20">
              <Link href="/dashboard">Get Started Free</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-48">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-6 py-2 text-sm font-black text-primary border border-primary/20 animate-in fade-in zoom-in duration-500">
                <Sparkles className="mr-2 h-4 w-4" />
                THE NEXT GEN AI VIDEO ENGINE IS HERE
              </div>
              <h1 className="text-5xl font-black tracking-tight sm:text-7xl md:text-8xl lg:text-[6rem] leading-[0.95]">
                Create Viral Videos <br />
                <span className="text-gradient">In Minutes, Not Hours.</span>
              </h1>
              <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-2xl font-medium leading-relaxed opacity-80">
                Designed for everyone. AI script generation, one-click subtitles, and professional editing tools without the steep learning curve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
                <Button asChild size="lg" className="rounded-full px-12 h-16 text-xl font-bold shadow-2xl shadow-primary/40 group overflow-hidden relative">
                  <Link href="/dashboard">
                    <span className="relative z-10 flex items-center gap-2">Start Editing Free <ArrowRight className="group-hover:translate-x-1 transition-transform" /></span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-12 h-16 text-xl font-bold border-2 hover:bg-muted transition-all">
                  <Play className="mr-2 h-5 w-5 fill-current" /> How it Works
                </Button>
              </div>
              
              <div className="flex items-center gap-8 pt-8 opacity-60">
                 <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /><span className="text-sm font-bold">No Credit Card</span></div>
                 <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /><span className="text-sm font-bold">Free Forever Plan</span></div>
                 <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /><span className="text-sm font-bold">4K Rendering</span></div>
              </div>
            </div>
            
            <div className="mt-20 relative mx-auto max-w-6xl animate-in slide-in-from-bottom-20 duration-1000 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-card rounded-[2rem] border shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                {heroImg && (
                  <Image
                    alt="VideoMaster AI Editor Interface"
                    className="w-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-1000"
                    height={800}
                    src={heroImg.imageUrl}
                    width={1600}
                    priority
                    data-ai-hint="modern video editor"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                   <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                      <Play className="h-10 w-10 text-primary fill-current ml-1" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 md:py-48 bg-muted/20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-20 max-w-4xl mx-auto">
              <h2 className="text-4xl font-black tracking-tight sm:text-6xl">Everything You Need To <span className="text-primary italic">Go Viral.</span></h2>
              <p className="text-muted-foreground text-xl md:text-2xl font-medium leading-relaxed opacity-70">
                We've stripped away the technical jargon. Professional results for YouTube, Instagram, and TikTok, powered by the world's most advanced AI.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Sparkles, title: "AI Script Generator", desc: "Just enter a topic and our neural engine writes high-retention scripts optimized for your platform.", color: "bg-blue-500/10 text-blue-500" },
                { icon: Zap, title: "One-Click Subtitles", desc: "Auto-caption your videos with 99.8% accuracy in 50+ languages. Engagement boost included.", color: "bg-amber-500/10 text-amber-500" },
                { icon: Youtube, title: "Shorts Creator", desc: "Convert any long-form video into perfectly framed, viral-ready vertical shorts in seconds.", color: "bg-red-500/10 text-red-500" },
                { icon: Instagram, title: "Reels Pro Presets", desc: "Presets and filters designed specifically for the Instagram algorithm to maximize reach.", color: "bg-pink-500/10 text-pink-500" },
                { icon: Share2, title: "Instant Publishing", desc: "Export and post directly to all major platforms from one centralized hub.", color: "bg-indigo-500/10 text-indigo-500" },
                { icon: Video, title: "4K AI Upscaling", desc: "Breathe new life into old footage. Our AI upscaler enhances clarity to cinematic 4K resolution.", color: "bg-emerald-500/10 text-emerald-500" }
              ].map((feat, i) => (
                <Card key={i} className="premium-card p-10 space-y-6 rounded-[2rem] group hover:bg-card">
                  <CardContent className="p-0 space-y-6">
                    <div className={cn("p-4 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-500", feat.color)}>
                      <feat.icon className="h-8 w-8" />
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-2xl font-bold tracking-tight">{feat.title}</h3>
                       <p className="text-muted-foreground leading-relaxed font-medium">
                         {feat.desc}
                       </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 md:py-48 bg-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 blur-[150px] -translate-y-1/2 translate-x-1/2 rounded-full" />
          <div className="container px-4 md:px-6 mx-auto text-center space-y-10 relative z-10">
            <h2 className="text-5xl font-black tracking-tight sm:text-8xl text-primary-foreground leading-[0.9]">Ready to Start Your <br /> Creative Empire?</h2>
            <p className="mx-auto max-w-[800px] text-xl md:text-3xl text-primary-foreground/80 font-medium leading-relaxed italic">
              Join 10,000+ creators who use VideoMaster AI to build their audience without the technical headache.
            </p>
            <div className="pt-8">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-16 h-20 text-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all">
                <Link href="/dashboard">Create Your Masterpiece <ArrowRight className="ml-3 h-8 w-8" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-20 px-4 md:px-6 bg-card">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="flex flex-col gap-6 max-w-xs">
            <Link className="flex items-center gap-2 group" href="/">
              <div className="bg-primary p-2 rounded-xl">
                <Video className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-black text-2xl tracking-tighter">VideoMaster<span className="text-primary italic">AI</span></span>
            </Link>
            <p className="text-lg text-muted-foreground font-medium italic">Empowering the next generation of storytellers with neural intelligence.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 sm:gap-24">
             <div className="flex flex-col gap-5">
                <span className="font-black text-sm uppercase tracking-[0.2em] text-muted-foreground/50">Production</span>
                <Link href="/features" className="text-base font-bold hover:text-primary transition-colors">AI Editor</Link>
                <Link href="/pricing" className="text-base font-bold hover:text-primary transition-colors">Elite Pricing</Link>
                <Link href="/ai-tools" className="text-base font-bold hover:text-primary transition-colors">Neural Hub</Link>
             </div>
             <div className="flex flex-col gap-5">
                <span className="font-black text-sm uppercase tracking-[0.2em] text-muted-foreground/50">Company</span>
                <Link href="/about" className="text-base font-bold hover:text-primary transition-colors">Our Vision</Link>
                <Link href="/contact" className="text-base font-bold hover:text-primary transition-colors">Connect Node</Link>
                <Link href="/terms" className="text-base font-bold hover:text-primary transition-colors">Service Standards</Link>
             </div>
             <div className="hidden sm:flex flex-col gap-5">
                <span className="font-black text-sm uppercase tracking-[0.2em] text-muted-foreground/50">Social Nodes</span>
                <Link href="#" className="text-base font-bold hover:text-primary transition-colors">YouTube</Link>
                <Link href="#" className="text-base font-bold hover:text-primary transition-colors">Instagram</Link>
                <Link href="#" className="text-base font-bold hover:text-primary transition-colors">Twitter X</Link>
             </div>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-6 text-sm font-bold text-muted-foreground/40">
          <p>© 2024 VideoMaster AI Technologies. All creative rights reserved.</p>
          <div className="flex gap-8">
             <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Node</Link>
             <Link href="/cookies" className="hover:text-primary transition-colors">Cookies Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
