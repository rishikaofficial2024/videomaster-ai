import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Video, ArrowRight, Sparkles, Wand2, Smartphone, Download, Apple, Play, Zap } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-bg");

  return (
    <div className="flex flex-col min-h-screen hero-gradient">
      <header className="px-6 lg:px-12 h-20 flex items-center border-b fixed top-0 w-full bg-background/60 backdrop-blur-xl z-50">
        <Link className="flex items-center justify-center gap-3" href="/">
          <div className="bg-primary p-1.5 rounded-xl shadow-lg shadow-primary/30">
            <Video className="h-6 w-6 text-white" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter">VideoMaster<span className="text-primary">AI</span></span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/login">
            Sign In
          </Link>
          <Button asChild size="sm" className="rounded-full px-6">
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      
      <main className="flex-1 mt-20">
        <section className="w-full py-20 lg:py-32">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-8 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-1000">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Video Studio
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-headline max-w-4xl leading-[1.1]">
                Turn your ideas into <span className="text-primary italic">cinematic</span> masterpieces
              </h1>
              <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl font-medium">
                The world's first AI video editor with deep reasoning. Automate captions, voiceovers, and content optimization in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                  <Link href="/signup">Start Creating Free <ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold hover:bg-muted/50 transition-colors">
                  <Play className="mr-2 w-5 h-5 fill-current" /> Watch Demo
                </Button>
              </div>
            </div>

            <div className="relative max-w-6xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[3rem] blur-3xl opacity-50"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl">
                {heroImg && (
                  <Image
                    alt="AI Video Editor Preview"
                    className="w-full aspect-video object-cover"
                    height={720}
                    src={heroImg.imageUrl}
                    width={1280}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-white">
          <div className="container px-6 mx-auto">
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                { 
                  icon: Wand2, 
                  title: "AI Video Generation", 
                  desc: "Create 4K cinematic clips from simple text prompts using Google Veo.",
                  color: "bg-purple-500/10 text-purple-600"
                },
                { 
                  icon: Zap, 
                  title: "Magic SEO", 
                  desc: "Get viral-ready hashtags, titles, and descriptions tailored to your content.",
                  color: "bg-orange-500/10 text-orange-600"
                },
                { 
                  icon: Apple, 
                  title: "Cross-Platform", 
                  desc: "Edit seamlessly across Web, Android, and iOS with full cloud sync.",
                  color: "bg-blue-500/10 text-blue-600"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-[2rem] border bg-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className={`p-4 rounded-2xl w-fit mb-6 ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 font-headline">{feature.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t bg-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <span className="font-headline font-bold text-xl">VideoMaster AI</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-primary">Twitter</Link>
            <Link href="#" className="hover:text-primary">YouTube</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">Privacy</Link>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 VideoMaster AI. Made for Creators.</p>
        </div>
      </footer>
    </div>
  );
}