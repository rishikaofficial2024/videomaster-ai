
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Video, ArrowRight, Sparkles, Wand2, Smartphone, 
  Download, Play, Zap, ShieldCheck, Star, 
  CheckCircle2, Globe, Cpu, BarChart3
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-bg");

  return (
    <div className="flex flex-col min-h-screen bg-background hero-gradient">
      <header className="px-6 lg:px-12 h-20 flex items-center border-b fixed top-0 w-full bg-background/80 backdrop-blur-xl z-50">
        <Link className="flex items-center justify-center gap-3" href="/">
          <div className="bg-primary p-1.5 rounded-xl shadow-lg shadow-primary/30">
            <Video className="h-6 w-6 text-white" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter">VideoMaster<span className="text-primary">AI</span></span>
        </Link>
        <nav className="ml-auto flex items-center gap-8">
          <div className="hidden md:flex gap-8">
            <Link href="#features" className="text-sm font-semibold hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-semibold hover:text-primary transition-colors">How it works</Link>
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
        {/* Hero Section */}
        <section className="w-full py-20 lg:py-32 overflow-hidden">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-10 mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-3 duration-1000">
                <Sparkles className="w-3.5 h-3.5" /> Empowering 50k+ Content Creators
              </div>
              <h1 className="text-5xl md:text-9xl font-bold tracking-tighter font-headline max-w-6xl leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                Create content <span className="text-primary italic">10x faster</span> with AI.
              </h1>
              <p className="max-w-[800px] text-muted-foreground text-lg md:text-2xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
                The all-in-one AI video studio for modern creators. Generate scripts, edit footage, and design thumbnails in seconds, not hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
                <Button asChild size="lg" className="h-16 px-12 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                  <Link href="/signup">Start Your Journey <ArrowRight className="ml-2 w-6 h-6" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl text-lg font-bold bg-background/50 backdrop-blur-sm border-primary/10 hover:bg-primary/5 transition-all">
                  <Play className="mr-2 w-5 h-5 fill-primary text-primary" /> Watch Showreel
                </Button>
              </div>
            </div>

            <div className="relative max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-400">
              <div className="absolute -inset-10 bg-primary/20 rounded-[4rem] blur-[120px] opacity-40"></div>
              <div className="relative rounded-[3rem] overflow-hidden border-[12px] border-background shadow-2xl blue-glow bg-background">
                {heroImg && (
                  <Image
                    alt="AI Video Editor Preview"
                    className="w-full aspect-video object-cover"
                    height={720}
                    src={heroImg.imageUrl}
                    width={1280}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="w-full py-12 border-y bg-muted/30">
          <div className="container px-6 mx-auto">
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-10">Trusted by creators from</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale">
              <div className="text-2xl font-bold font-headline">YouTube</div>
              <div className="text-2xl font-bold font-headline">TikTok</div>
              <div className="text-2xl font-bold font-headline">Instagram</div>
              <div className="text-2xl font-bold font-headline">LinkedIn</div>
              <div className="text-2xl font-bold font-headline">Meta</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-32">
          <div className="container px-6 mx-auto">
            <div className="text-center mb-24 space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">Tools for the <span className="text-primary italic">Pro Era</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-xl font-medium">Reimagining video production with ethical AI and cloud power.</p>
            </div>
            <div className="grid gap-8 lg:grid-cols-4">
              {[
                { 
                  icon: Wand2, 
                  title: "AI Video Gen", 
                  desc: "Generate high-fidelity B-roll clips using Veo 2.0 reasoning.",
                  color: "blue"
                },
                { 
                  icon: Zap, 
                  title: "Magic Optimization", 
                  desc: "Viral titles, hashtags, and SEO descriptions in one click.",
                  color: "orange"
                },
                { 
                  icon: BarChart3, 
                  title: "Smart Analytics", 
                  desc: "Track credit usage and content performance effortlessly.",
                  color: "green"
                },
                { 
                  icon: Cpu, 
                  title: "Imagen 4 Support", 
                  desc: "Click-worthy thumbnails designed by state-of-the-art AI.",
                  color: "rose"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-[2.5rem] border bg-background/50 hover:bg-background hover:shadow-2xl transition-all duration-500 blue-glow">
                  <div className={`p-4 rounded-2xl w-fit mb-6 bg-primary/5 text-primary shadow-sm group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-headline">{feature.title}</h3>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="w-full py-32 bg-primary/5">
          <div className="container px-6 mx-auto">
             <div className="grid md:grid-cols-3 gap-16 text-center">
                <div className="space-y-2">
                   <h4 className="text-6xl md:text-7xl font-bold font-headline text-primary tracking-tighter">98%</h4>
                   <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Faster Production</p>
                </div>
                <div className="space-y-2">
                   <h4 className="text-6xl md:text-7xl font-bold font-headline text-primary tracking-tighter">1M+</h4>
                   <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">AI Generations</p>
                </div>
                <div className="space-y-2">
                   <h4 className="text-6xl md:text-7xl font-bold font-headline text-primary tracking-tighter">₹0</h4>
                   <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Setup Cost</p>
                </div>
             </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-32">
          <div className="container px-6 mx-auto">
            <div className="bg-primary p-12 md:p-24 rounded-[4rem] text-center text-white relative overflow-hidden shadow-2xl shadow-primary/40">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]"></div>
               <div className="relative z-10 space-y-10">
                  <h2 className="text-4xl md:text-7xl font-bold font-headline tracking-tighter leading-tight">Ready to join the <br/> future of video?</h2>
                  <p className="max-w-xl mx-auto text-primary-foreground/80 text-lg md:text-xl font-medium">Get 100 free AI credits when you create your account today. No credit card required.</p>
                  <Button asChild size="lg" variant="secondary" className="h-20 px-16 rounded-[2rem] text-xl font-bold hover:scale-105 transition-all shadow-xl">
                    <Link href="/signup">Claim My 100 Credits <ArrowRight className="ml-3 w-6 h-6" /></Link>
                  </Button>
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 px-6 border-t bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-1.5 rounded-xl">
                   <Video className="h-6 w-6 text-white" />
                </div>
                <span className="font-headline font-bold text-3xl tracking-tighter">VideoMaster AI</span>
              </div>
              <p className="text-muted-foreground max-w-sm text-lg leading-relaxed">The world's first AI-native video studio built for speed, performance, and viral growth.</p>
            </div>
            <div className="space-y-6">
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-primary">Studio</h4>
              <nav className="flex flex-col gap-4 text-muted-foreground font-medium text-sm">
                <Link href="/editor" className="hover:text-primary transition-colors">Video Editor</Link>
                <Link href="/templates" className="hover:text-primary transition-colors">Premium Templates</Link>
                <Link href="/ai-gen" className="hover:text-primary transition-colors">AI Generation</Link>
                <Link href="/pricing" className="hover:text-primary transition-colors">Pricing Plans</Link>
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-primary">Support</h4>
              <nav className="flex flex-col gap-4 text-muted-foreground font-medium text-sm">
                <Link href="#" className="hover:text-primary transition-colors">Help Center</Link>
                <Link href="#" className="hover:text-primary transition-colors">Community</Link>
                <Link href="#" className="hover:text-primary transition-colors">API Docs</Link>
                <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </nav>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t pt-12 gap-8">
             <div className="flex items-center gap-6">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">© 2024 VideoMaster AI</p>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">All Systems Operational</span>
                </div>
             </div>
             <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary"><Smartphone className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary"><Download className="w-4 h-4" /></Button>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
