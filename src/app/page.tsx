
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Video, ArrowRight, Sparkles, Wand2, Smartphone, Download, Apple, Play, Zap } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-bg");

  return (
    <div className="flex flex-col min-h-screen hero-gradient bg-background">
      <header className="px-6 lg:px-12 h-20 flex items-center border-b fixed top-0 w-full bg-background/80 backdrop-blur-xl z-50">
        <Link className="flex items-center justify-center gap-3" href="/">
          <div className="bg-primary p-1.5 rounded-xl shadow-lg shadow-primary/30">
            <Video className="h-6 w-6 text-white" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter">VideoMaster<span className="text-primary">AI</span></span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link className="text-sm font-semibold hover:text-primary transition-colors py-2" href="/login">
            Sign In
          </Link>
          <Button asChild className="rounded-full px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      
      <main className="flex-1 mt-20">
        <section className="w-full py-20 lg:py-32">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-8 mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-1000">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Video Studio
              </div>
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter font-headline max-w-5xl leading-[1]">
                Edit your videos with the <span className="text-primary italic">power of AI</span>
              </h1>
              <p className="max-w-[750px] text-muted-foreground text-lg md:text-2xl font-medium leading-relaxed">
                Experience the world's most intuitive AI video studio. Automate captions, generate voiceovers, and optimize for viral growth in one click.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Button asChild size="lg" className="h-16 px-12 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                  <Link href="/signup">Start Creating Now <ArrowRight className="ml-2 w-6 h-6" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl text-lg font-bold bg-background/50 backdrop-blur-sm border-primary/10 hover:bg-primary/5 transition-all">
                  <Play className="mr-2 w-5 h-5 fill-primary text-primary" /> Watch Demo
                </Button>
              </div>
            </div>

            <div className="relative max-w-6xl mx-auto">
              <div className="absolute -inset-10 bg-primary/10 rounded-[4rem] blur-[120px] opacity-60"></div>
              <div className="relative rounded-[3rem] overflow-hidden border-8 border-background shadow-2xl blue-glow bg-background">
                {heroImg && (
                  <Image
                    alt="AI Video Editor Preview"
                    className="w-full aspect-video object-cover"
                    height={720}
                    src={heroImg.imageUrl}
                    width={1280}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 p-4 bg-background/40 backdrop-blur-md rounded-2xl border border-primary/20 hidden md:block">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                        <Zap className="text-white w-6 h-6" />
                      </div>
                      <div className="text-foreground">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-70">AI Status</p>
                        <p className="text-sm font-bold">Optimizing for Viral Growth...</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-background/40 backdrop-blur-md">
          <div className="container px-6 mx-auto">
             <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl font-bold font-headline">Built for the Modern Creator</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Professional tools reimagined with artificial intelligence to save you hundreds of hours.</p>
             </div>
            <div className="grid gap-10 lg:grid-cols-3">
              {[
                { 
                  icon: Wand2, 
                  title: "AI Video Generation", 
                  desc: "Create 4K cinematic clips from simple text prompts using Google's Veo 2.0 reasoning engine.",
                  color: "bg-primary/10 text-primary"
                },
                { 
                  icon: Zap, 
                  title: "Magic SEO & Discovery", 
                  desc: "Automatically generate viral-ready hashtags, titles, and descriptions tailored specifically for your target audience.",
                  color: "bg-primary/10 text-primary"
                },
                { 
                  icon: Smartphone, 
                  title: "Cloud Studio Sync", 
                  desc: "Edit seamlessly across Web, Android, and iOS. Your projects are always safe and accessible in the cloud.",
                  color: "bg-primary/10 text-primary"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-10 rounded-[2.5rem] border-2 border-primary/5 bg-background/50 hover:bg-background hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 blue-glow">
                  <div className={`p-5 rounded-2xl w-fit mb-8 ${feature.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-headline">{feature.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed text-lg">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-1.5 rounded-xl">
                   <Video className="h-6 w-6 text-white" />
                </div>
                <span className="font-headline font-bold text-2xl tracking-tighter">VideoMaster AI</span>
              </div>
              <p className="text-muted-foreground max-w-xs text-lg">Empowering creators with the world's most advanced AI video editing platform.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Studio</h4>
                <div className="flex flex-col gap-2 text-muted-foreground font-medium">
                  <Link href="#" className="hover:text-primary transition-colors">Editor</Link>
                  <Link href="#" className="hover:text-primary transition-colors">Templates</Link>
                  <Link href="#" className="hover:text-primary transition-colors">AI Gen</Link>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Support</h4>
                <div className="flex flex-col gap-2 text-muted-foreground font-medium">
                  <Link href="#" className="hover:text-primary transition-colors">Help Center</Link>
                  <Link href="#" className="hover:text-primary transition-colors">API</Link>
                  <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t pt-10 gap-6">
             <p className="text-sm text-muted-foreground font-medium">© 2024 VideoMaster AI. All rights reserved for global creators.</p>
             <div className="flex gap-6">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary"><Smartphone className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary"><Download className="w-5 h-5" /></Button>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
