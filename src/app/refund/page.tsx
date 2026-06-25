"use client";

import { Navbar } from "@/components/navbar";
import { ArrowLeft, Banknote, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-40">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6 md:p-16 mt-40 space-y-16">
        <header className="space-y-8">
          <Link href="/settings" className="inline-flex items-center gap-3 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.5em]">
              <ArrowLeft className="w-4 h-4" /> Return to Studio
          </Link>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-500">
              <Banknote className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">FINANCIAL PROTOCOL</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-headline font-black tracking-tighter text-white leading-none uppercase">Refund <span className="text-primary italic">Node.</span></h1>
            <p className="text-muted-foreground text-2xl font-medium italic opacity-60">Transparency in every creative transaction.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 text-[#e1e4e8] leading-relaxed">
          <section className="p-12 bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[4rem] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20"><CheckCircle2 className="w-8 h-8 text-primary" /></div>
               <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tight">1. Eligibility</h2>
            </div>
            <p className="text-xl text-muted-foreground italic leading-relaxed">Refunds are applicable for Pro Studio purchases within 48 hours of transaction if no AI credits have been utilized. Since our tools provide instant creative output, utilized resources are non-refundable.</p>
          </section>

          <section className="p-12 bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[4rem] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20"><ShieldAlert className="w-8 h-8 text-rose-400" /></div>
               <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tight">2. Non-Refundable</h2>
            </div>
            <p className="text-xl text-muted-foreground italic leading-relaxed">Subscription nodes that have processed more than 5 AI generations or initiated 4K exports are categorized as 'Full Utilization' and are ineligible for refund protocol.</p>
          </section>

          <section className="p-12 bg-indigo-500/5 rounded-[4rem] border border-indigo-500/10 space-y-8">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"><FileText className="w-8 h-8 text-indigo-400" /></div>
               <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tight">3. Request Process</h2>
            </div>
            <p className="text-lg text-muted-foreground italic leading-relaxed">To initiate a refund request, provide your Transaction ID and Creator Node ID to <b>billing@videomaster-ai.tech</b>. Payouts are processed via original payment node within 7-10 business days.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
