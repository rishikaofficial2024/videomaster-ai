import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Star, Zap, Globe, ShieldCheck, Video, Wand2, Scissors, Sparkles, Type, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { AdBanner } from "@/components/ads/ad-banner";
import toolsData from "@/app/lib/tools-data.json";
import { notFound } from "next/navigation";

const iconMap: any = { Wand2, Video, Scissors, Sparkles, Type, ImageIcon, Zap };

/**
 * 🛠️ TOOL LANDING NODE: SEO-Optimized Server Component.
 * Optimized for Next.js 15 Static Export.
 */
export default async function ToolLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolsData.tools.find(t => t.slug === slug);

  if (!tool) return notFound();

  const Icon = iconMap[tool.icon] || Wand2;

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-32">
      <Navbar />
      
      <main className="max-w-6xl mx-auto p-6 mt-40 space-y-24">
        <header className="text-center space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.4em] rounded-full">
              <Zap className="w-4 h-4" /> 100% FREE ONLINE TOOL
           </div>
           <h1 className="text-6xl md:text-[10rem] font-headline font-bold text-white tracking-tighter uppercase leading-[0.8]">
              {tool.h1.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? "text-primary italic" : ""}>{word} </span>
              ))}
           </h1>
           <p className="text-2xl md:text-4xl text-muted-foreground italic font-medium opacity-60 max-w-4xl mx-auto leading-relaxed">
             {tool.desc}
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
              <Button className="h-24 px-16 rounded-[2.5rem] bg-primary font-black text-2xl gap-5 shadow-glow hover:scale-105 active:scale-95 transition-all" asChild>
                 <Link href="/editor">
                   LAUNCH {tool.title.toUpperCase()} <ArrowRight className="w-8 h-8" />
                 </Link>
              </Button>
              <div className="flex items-center gap-4 text-emerald-500 font-bold uppercase tracking-widest text-xs">
                 <ShieldCheck className="w-5 h-5" /> Secured by Cloud Shield
              </div>
           </div>
        </header>

        <section className="grid md:grid-cols-3 gap-10">
           {tool.features.map((f, i) => (
             <Card key={i} className="p-10 rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all group">
                <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-8 group-hover:scale-110 transition-transform">
                   <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-4">{f}</h3>
                <p className="text-muted-foreground italic">Optimized for high-speed professional output.</p>
             </Card>
           ))}
        </section>

        <AdBanner adSlot="tool-page-middle" variant="large" provider="Neural Ad Network" />

        <section className="space-y-16 py-20 border-t border-white/5">
           <div className="text-center">
              <h2 className="text-5xl font-headline font-black text-white uppercase tracking-tighter">WHY CHOOSE VIDEOMASTER AI?</h2>
           </div>
           <div className="grid md:grid-cols-2 gap-10">
              <div className="p-12 bg-[#0a0d14] rounded-[4rem] border-2 border-white/5 space-y-6">
                 <h4 className="text-3xl font-bold text-primary flex items-center gap-4">
                    <Star className="w-8 h-8 fill-primary" /> ZERO COST NODE
                 </h4>
                 <p className="text-lg text-muted-foreground leading-relaxed italic">
                   Unlike other tools that charge ₹999/mo, VideoMaster AI provides full Pro access for free. Our democratization mission ensures every creator has elite tools.
                 </p>
              </div>
              <div className="p-12 bg-[#0a0d14] rounded-[4rem] border-2 border-white/5 space-y-6">
                 <h4 className="text-3xl font-bold text-indigo-400 flex items-center gap-4">
                    <Globe className="w-8 h-8" /> GLOBAL CDN SYNC
                 </h4>
                 <p className="text-lg text-muted-foreground leading-relaxed italic">
                   Your projects are synced across our global multi-node network. Start on mobile, finish on desktop. No lag, no latency.
                 </p>
              </div>
           </div>
        </section>

        <Card className="rounded-[5rem] bg-primary/5 border-2 border-primary/20 p-20 text-center space-y-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5 rotate-45">
              <Icon className="w-[30rem] h-[30rem] text-primary" />
           </div>
           <h2 className="text-6xl md:text-8xl font-headline font-black text-white uppercase tracking-tighter relative z-10 leading-none">READY TO GO <br/> <span className="text-primary italic">VIRAL?</span></h2>
           <Button className="h-28 px-20 rounded-[3rem] bg-white text-black font-black text-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10" asChild>
              <Link href="/editor">START EDITING NOW</Link>
           </Button>
        </Card>
      </main>
    </div>
  );
}

// Ensure static paths are generated during export
export async function generateStaticParams() {
  return toolsData.tools.map((t) => ({
    slug: t.slug,
  }));
}
