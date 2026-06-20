
"use client";

import { Navbar } from "@/components/navbar";
import { ArrowLeft, Scale, Gavel, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-32">
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-6 md:p-12 mt-24 space-y-12">
        <header className="space-y-6">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group">
            <div className="p-2 bg-white/5 rounded-xl border border-white/5 group-hover:border-primary/50 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Home
          </Link>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">User Agreement Protocol</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-white">Terms of <span className="text-primary italic">Service</span></h1>
            <p className="text-muted-foreground font-medium italic opacity-60">Effective Date: October 2024. Please read our operational standards carefully.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 text-[#e1e4e8] font-body leading-relaxed">
          <section className="p-10 bg-white/5 rounded-[3rem] border border-white/5 space-y-6">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-primary/10 rounded-2xl">
                  <Gavel className="w-6 h-6 text-primary" />
               </div>
               <h2 className="text-2xl font-headline font-bold text-white">1. Service Acceptance</h2>
            </div>
            <p>By accessing VideoMaster AI, you agree to follow these Terms of Service and all applicable laws in India. If you disagree with any part of these terms, you must terminate your studio access immediately.</p>
          </section>

          <section className="p-10 bg-white/5 rounded-[3rem] border border-white/5 space-y-6">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-rose-500/10 rounded-2xl">
                  <FileText className="w-6 h-6 text-rose-400" />
               </div>
               <h2 className="text-2xl font-headline font-bold text-white">2. AI Usage & Credit Credits</h2>
            </div>
            <p>Users receive 100 free credits upon joining. Abuse of AI generation through automation, bots, or unauthorized scripts is strictly prohibited and will result in permanent suspension of the studio account.</p>
          </section>

          <section className="p-10 bg-white/5 rounded-[3rem] border border-white/5 space-y-6">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-amber-500/10 rounded-2xl">
                  <AlertCircle className="w-6 h-6 text-amber-400" />
               </div>
               <h2 className="text-2xl font-headline font-bold text-white">3. Content Ownership</h2>
            </div>
            <p>You own the intellectual property of videos generated using our studio. However, you must ensure your prompts do not violate copyright, promote hate speech, or generate illegal content. We reserve the right to audit content for safety compliance.</p>
          </section>

          <div className="p-8 bg-white/5 border border-dashed border-white/10 rounded-2xl text-center">
             <p className="text-xs text-muted-foreground italic font-medium">Standard Indian Jurisdiction • Subject to Change without Prior Neural Notice.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
