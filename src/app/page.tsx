
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Video, ArrowRight, Sparkles, Wand2, Smartphone, Download, Apple, Play } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-bg");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b fixed top-0 w-full bg-background/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Video className="h-6 w-6 text-primary" />
          <span className="font-headline font-bold text-xl">VideoMaster AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/signup">
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="flex-1 mt-14">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Create Cinematic Magic with <span className="text-primary">AI Reasoning</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    The professional video editor that does the heavy lifting for you. Trim, filter, and optimize your content with the power of AI.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-8">
                    <Link href="/signup">Get Started <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 px-8">
                    <Link href="/login">Watch Demo</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden relative">
                        <Image src={`https://picsum.photos/seed/user-${i}/64/64`} alt="User" fill />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Joined by <span className="text-foreground font-bold">10k+</span> creators worldwide
                  </p>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                {heroImg && (
                  <Image
                    alt="VideoMaster Hero"
                    className="relative mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full shadow-2xl"
                    height={600}
                    src={heroImg.imageUrl}
                    width={800}
                    data-ai-hint="video editing studio"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-headline font-bold">Everything you need to go viral</h2>
              <p className="text-muted-foreground max-w-[600px]">Powerful AI tools built into a professional timeline editor.</p>
            </div>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-card border shadow-sm">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Wand2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">AI Auto Captions</h3>
                <p className="text-muted-foreground">
                  Transform audio into perfectly timed subtitles instantly using our advanced AI reasoning tools.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-card border shadow-sm">
                <div className="p-4 bg-accent/10 rounded-full">
                  <Sparkles className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold font-headline">Content Alchemist</h3>
                <p className="text-muted-foreground">
                  Optimize your social reach with AI-generated hashtags, titles, and descriptions tailored to your video.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl bg-card border shadow-sm">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Cloud Sync</h3>
                <p className="text-muted-foreground">
                  Start editing on your phone, finish on your tablet. Your projects are always safe in the cloud.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* App Download Section */}
        <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-headline font-bold">Edit on the go</h2>
            <p className="text-primary-foreground/80 max-w-lg mx-auto md:text-lg">
              Download our professional mobile app to access the AI Studio anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button size="lg" variant="secondary" className="h-16 px-8 gap-3 rounded-2xl">
                <Apple className="w-6 h-6 fill-current" />
                <div className="text-left">
                  <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Download on the</div>
                  <div className="text-lg font-bold">App Store</div>
                </div>
              </Button>
              <Button size="lg" variant="secondary" className="h-16 px-8 gap-3 rounded-2xl">
                <Play className="w-6 h-6 fill-current" />
                <div className="text-left">
                  <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Get it on</div>
                  <div className="text-lg font-bold">Google Play</div>
                </div>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 VideoMaster AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
