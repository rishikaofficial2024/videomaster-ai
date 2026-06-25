"use client";

import { Navbar } from "@/components/navbar";
import { ArrowLeft, Scale, Gavel, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

/**
 * ⚖️ ELITE TERMS NODE: Service Agreement & Operational Protocols.
 */
export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-40">
      <Navbar />
      
      <main className="max-w-5xl mx-auto p-6 md:p-16 mt-40 space-y-16">
        <header className="space-y-8">
          <Link href="/settings" className="inline-flex items-center gap-3 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.5em]">
              <ArrowLeft className="w-4 h-4" /> Back to Studio
          </Link>
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400">
              <Scale className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">USER OPERATIONAL STANDARDS</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-headline font-black tracking-tighter text-white leading-none uppercase">Service <span className="text-primary italic">Node.</span></h1>
            <p className="text-muted-foreground text-2xl font-medium italic opacity-60">Effective Date: June 2026. Standard Creative Protocols Apply.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 text-[#e1e4e8] leading-relaxed">
          <section className="p-12 bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[4rem] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20"><Gavel className="w-8 h-8 text-primary" /></div>
               <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tight">1. Engagement</h2>
            </div>
            <p className="text-xl text-muted-foreground italic leading-relaxed">By entering VideoMaster AI, you agree to comply with standard creative ethics and all applicable laws in India. Unauthorized automated access or system stress-testing is strictly prohibited.</p>
          </section>

          <section className="p-12 bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[4rem] border border-white/5 space-y-8 shadow-2xl">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20"><FileText className="w-8 h-8 text-rose-400" /></div>
               <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tight">2. Neural Credits</h2>
            </div>
            <p className="text-xl text-muted-foreground italic leading-relaxed">Pro Credits are provided as part of our democratization mission. Abuse of AI engines through mass-generation or bot-farming will result in permanent suspension of your creative node.</p>
          </section>

          <section className="p-12 bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[4rem] border border-white/5 space-y-8 shadow-2xl">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20"><AlertCircle className="w-8 h-8 text-amber-400" /></div>
               <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tight">3. IP Ownership</h2>
            </div>
            <p className="text-xl text-muted-foreground italic leading-relaxed">You own the final output of all generated media. However, you are responsible for ensuring that your creative inputs do not violate copyright, trademark, or safety standards.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
