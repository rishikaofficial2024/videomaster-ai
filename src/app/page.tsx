import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Zap, Sparkles, Youtube, Instagram, Share2, Play } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-main');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="bg-primary p-1.5 rounded-lg">
            <Video className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">VideoMaster AI</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/dashboard">
            Dashboard
          </Link>
          <Button asChild variant="default" size="sm">
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                The easiest AI video editor for everyone
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Create Viral Videos <br />
                <span className="text-primary">In Minutes, Not Hours.</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl mt-4">
                Designed for beginners. AI script generation, one-click subtitles, and professional editing tools without the complexity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg">
                  <Link href="/dashboard">Start Editing Free</Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg">
                  <Play className="mr-2 h-4 w-4 fill-current" /> Watch How it Works
                </Button>
              </div>
            </div>
            
            <div className="mt-16 relative mx-auto max-w-5xl group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-card rounded-2xl border shadow-2xl overflow-hidden">
                {heroImg && (
                  <Image
                    alt="VideoMaster AI Editor Interface"
                    className="w-full object-cover"
                    height={600}
                    src={heroImg.imageUrl}
                    width={1200}
                    priority
                    data-ai-hint="video editing"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-all">
                   <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-primary fill-current ml-1" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need To Go Viral</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl">
                We've stripped away the technical jargon. Just professional results for YouTube, Instagram, and TikTok.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Sparkles, title: "AI Script Generator", desc: "Just enter a topic and we'll write a high-retention script for you." },
                { icon: Zap, title: "One-Click Subtitles", desc: "Auto-caption your videos with 99% accuracy in multiple languages." },
                { icon: Youtube, title: "YouTube Shorts Creator", desc: "Convert long videos into perfectly framed, viral-ready shorts." },
                { icon: Instagram, title: "Reels Optimization", desc: "Presets and filters designed specifically for Instagram growth." },
                { icon: Share2, title: "Instant Sharing", desc: "Export and post directly to all major platforms from one place." },
                { icon: Video, title: "4K AI Upscaling", desc: "Enhance your footage to professional quality with one click." }
              ].map((feat, i) => (
                <Card key={i} className="border-none shadow-none bg-muted/50 hover:bg-muted transition-colors rounded-2xl">
                  <CardContent className="p-8 space-y-4">
                    <div className="bg-primary/10 p-3 rounded-xl w-fit">
                      <feat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{feat.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feat.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Start Your Channel?</h2>
            <p className="mx-auto max-w-[600px] md:text-xl opacity-90">
              Join 10,000+ creators who use VideoMaster AI to build their audience without the technical headache.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-12 h-14 text-lg font-bold">
              <Link href="/dashboard">Create Your First Video Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-4 md:px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link className="flex items-center gap-2" href="/">
              <Video className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">VideoMaster AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">The easiest way to create professional videos.</p>
          </div>
          <div className="flex gap-12">
             <div className="flex flex-col gap-2">
                <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Product</span>
                <Link href="/features" className="text-sm hover:text-primary transition-colors">Features</Link>
                <Link href="/pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link>
                <Link href="/ai-tools" className="text-sm hover:text-primary transition-colors">AI Tools</Link>
             </div>
             <div className="flex flex-col gap-2">
                <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Company</span>
                <Link href="/about" className="text-sm hover:text-primary transition-colors">About</Link>
                <Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link>
                <Link href="/terms" className="text-sm hover:text-primary transition-colors">Terms</Link>
             </div>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
          © 2024 VideoMaster AI Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}