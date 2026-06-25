"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Check, Zap, Rocket, Sparkles, Briefcase, Gem, Globe, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdBanner } from "@/components/ads/ad-banner";
import Link from "next/link";

export default function PremiumPage() {
  const plans = [
    {
      id: "free",
      name: "Starter Node",
      price: "₹0",
      description: "Individual Assets",
      features: ["5 AI Scripts / day", "Standard HD Exports", "Basic Masterpieces", "Priority Support", "Branded Watermark"],
      buttonText: "Active Tier",
      icon: Zap,
      popular: false,
      color: "border-white/5 bg-white/5",
      iconColor: "text-muted-foreground",
      bgGradient: "from-white/5 to-transparent"
    },
    {
      id: "pro",
      name: "Pro Studio",
      price: "₹99",
      description: "Gold Standard Protocol",
      features: ["Unlimited AI Scripts", "4K Ultra HD Exports", "Elite Thumbnail Node", "Neural Voiceover", "No Watermark", "Master Hub Access"],
      buttonText: "Join Elite",
      icon: Gem,
      popular: true,
      color: "border-primary shadow-glow",
      iconColor: "text-primary",
      bgGradient: "from-primary/10 via-transparent to-white/5"
    },
    {
      id: "premium",
      name: "Elite Agency",
      price: "₹499",
      description: "Enterprise Production",
      features: ["Everything in Pro", "Advanced Veo Motion", "Team Collaboration (5 Seats)", "Whitelabel Exports", "Bulk Master Processing", "Dedicated Account Node"],
      buttonText: "Go Enterprise",
      icon: Briefcase,
      popular: false,
      color: "border-white/10 bg-white/[0.02]",
      iconColor: "text-white",
      bgGradient: "from-white/5 to-transparent"
    }
  ];

  return (
    <div className="min-h-screen pb-40 bg-[#060606]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 lg:p-16 space-y-32 pt-32 lg:pt-40">
        {/* HERO */}
        <div className="text-center space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full glass-panel border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl">
            <Sparkles className="w-4 h-4 animate-pulse" /> PRESTIGE PRODUCTION INFRASTRUCTURE
          </div>
          <h1 className="text-8xl md:text-[12rem] font-headline font-black tracking-tighter text-white uppercase leading-[0.8] mb-8">
            The <span className="text-gradient italic">Standard.</span>
          </h1>
          <p className="text-2xl md:text-4xl text-muted-foreground max-w-4xl mx-auto font-medium italic opacity-60 leading-relaxed">
            Select your clearance level. A one-time commitment for a lifetime of elite production power.
          </p>
        </div>

        {/* PRICING GRID */}
        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[200px] -z-10" />
          
          {plans.map((plan) => (
            <Card key={plan.id} className={cn(
              "relative flex flex-col rounded-[4rem] border-2 backdrop-blur-3xl transition-all duration-700 hover:scale-[1.05] overflow-hidden group shadow-2xl",
              plan.color,
              plan.popular ? "gold-glow z-20" : "hover:border-white/10"
            )}>
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-yellow-200 to-primary" />
              )}
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", plan.bgGradient)} />
              
              <CardHeader className="p-12 pb-8 relative z-10">
                <div className={cn(
                  "w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 border-2 transition-all group-hover:rotate-6 shadow-2xl",
                  plan.popular ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-white"
                )}>
                  <plan.icon size={40} />
                </div>
                <CardTitle className="text-5xl font-headline font-black uppercase tracking-tight text-white mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-xl font-medium italic opacity-60 leading-tight">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="p-12 pt-0 flex-1 space-y-12 relative z-10">
                <div className="flex items-baseline gap-4">
                  <span className="text-8xl font-black font-headline text-white tracking-tighter">{plan.price}</span>
                  <span className="text-muted-foreground font-black uppercase tracking-widest text-[11px] opacity-40">/ LIFETIME</span>
                </div>
                <ul className="space-y-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-6 text-base font-bold text-white/80 group/feat">
                      <div className="bg-white/5 p-2 rounded-full border border-white/10 group-hover/feat:bg-primary/20 transition-all">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="opacity-80 group-hover/feat:opacity-100 transition-opacity">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-12 pt-0 relative z-10">
                <Button 
                  className={cn(
                    "w-full h-24 rounded-full font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl active:scale-95",
                    plan.popular ? "bg-white text-black hover:bg-primary" : "bg-black/40 border border-white/10 text-white hover:bg-white/5"
                  )}
                  asChild
                >
                   <Link href={plan.id === 'free' ? '#' : 'https://razorpay.com/payment-page-placeholder'}>
                    {plan.buttonText}
                   </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* TRUST LOGOS */}
        <section className="grid md:grid-cols-3 gap-12">
           {[
             { label: "Institutional Access", icon: Crown, desc: "Bulk whitelabel processing for high-volume enterprise networks." },
             { label: "Lossless Fidelity", icon: Sparkles, desc: "4K Master rendering on our global gold-tier CDN network." },
             { label: "Encrypted Node", icon: ShieldCheck, desc: "Military-grade isolation for all creative assets and projects." }
           ].map((item, i) => (
             <Card key={i} className="glass-panel p-12 rounded-[4rem] flex flex-col items-center text-center space-y-8 hover:bg-white/[0.03] transition-all border-white/5">
                <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20 shadow-inner">
                   <item.icon className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-3xl font-headline font-black uppercase tracking-tight text-white">{item.label}</h4>
                  <p className="text-lg text-muted-foreground italic leading-relaxed opacity-60">{item.desc}</p>
                </div>
                <div className="pt-4 flex items-center gap-3 text-primary/40 group-hover:text-primary transition-colors">
                   <span className="text-[10px] font-black uppercase tracking-widest">Protocol Verified</span>
                   <ArrowRight size={16} />
                </div>
             </Card>
           ))}
        </section>

        <AdBanner adSlot="premium-plans-bottom" variant="large" provider="Prestige Network" />

        <div className="text-center pt-10">
           <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[1em] opacity-20">VideoMaster AI • THE GOLD STANDARD IN PRODUCTION</p>
        </div>
      </main>
    </div>
  );
}
