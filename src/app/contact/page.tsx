"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, MessageSquare, Globe, Phone, 
  Send, ArrowLeft, Zap, Sparkles 
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast({ title: "Message Broadcasted", description: "Our neural support node will respond within 4 hours." });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#05070a] hero-gradient pb-40">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 md:p-16 mt-40 space-y-24">
        <header className="space-y-12 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-3 text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.5em]">
            <ArrowLeft className="w-4 h-4" /> Return to Creative Hub
          </Link>
          <div className="space-y-8">
             <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                <Zap className="w-4 h-4" /> COMMUNICATION NODE
             </div>
             <h1 className="text-8xl md:text-[10rem] font-headline font-black tracking-tighter text-white leading-none uppercase">Contact <span className="text-primary italic">Node.</span></h1>
             <p className="text-muted-foreground text-2xl font-medium italic opacity-60 max-w-3xl mx-auto">Establishing direct links between creators and the studio engine.</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-20">
           <div className="space-y-12">
              <div className="space-y-6">
                 <h2 className="text-5xl font-headline font-black text-white uppercase tracking-tight">GLOBAL REACH</h2>
                 <p className="text-xl text-muted-foreground italic leading-relaxed">Whether it's technical support, business partnerships, or agency clearance—our elite team is ready.</p>
              </div>

              <div className="space-y-8">
                 {[
                   { icon: Mail, label: "Neural Inquiries", value: "hello@videomaster-ai.tech" },
                   { icon: MessageSquare, label: "Technical Support", value: "support@videomaster-ai.tech" },
                   { icon: Globe, label: "Global Presence", value: "Bengaluru, India • San Francisco, USA" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-8 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all group">
                      <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                         <item.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                         <p className="text-2xl font-bold text-white tracking-tight">{item.value}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <Card className="rounded-[4rem] bg-[#0a0d14]/80 backdrop-blur-3xl border-2 border-white/5 p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
                 <Send className="w-48 h-48 text-primary" />
              </div>
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                 <div className="grid gap-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Identity</label>
                       <Input placeholder="Full Name..." className="h-16 rounded-2xl bg-black/40 border-white/10" required />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Email Node</label>
                       <Input type="email" placeholder="name@example.com" className="h-16 rounded-2xl bg-black/40 border-white/10" required />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Message Protocol</label>
                       <Textarea placeholder="How can we assist your workflow?" className="min-h-[200px] rounded-[2rem] bg-black/40 border-white/10 p-6" required />
                    </div>
                 </div>
                 <Button type="submit" className="w-full h-20 rounded-[1.5rem] bg-primary font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/30" disabled={loading}>
                    {loading ? <Sparkles className="animate-spin mr-3" /> : <Send className="w-5 h-5 mr-3" />}
                    INITIATE BROADCAST
                 </Button>
              </form>
           </Card>
        </div>
      </main>
    </div>
  );
}
