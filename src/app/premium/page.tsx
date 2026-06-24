"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Check, Zap, Building2, CheckCircle2, Banknote, ArrowRight, Coins, Gem, Loader2, Star, Rocket, ExternalLink, Sparkles } from "lucide-react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { cn } from "@/lib/utils";
import { AdBanner } from "@/components/ads/ad-banner";
import Link from "next/link";

export default function PremiumPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { data: profile } = useDoc(user ? doc(db, "users", user.uid) : null);
  const { toast } = useToast();

  const plans = [
    {
      id: "pro",
      name: "Pro Studio",
      price: "₹0",
      description: "Unlocked for Everyone",
      features: ["Unlimited AI Credits", "4K Ultra HD Exports", "Imagen 4 Thumbnails", "No Watermark", "Priority AI Queue"],
      buttonText: "Active Forever",
      icon: Rocket,
      popular: true,
      color: "border-primary shadow-primary/20"
    }
  ];

  return (
    <div className="min-h-screen pb-20 md:pt-20 bg-background hero-gradient">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 space-y-16 py-12">
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3 fill-current" /> 100% Free Forever
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter">Everything is <span className="text-primary italic">Unlocked</span></h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium italic">
            Enjoy full Pro features at zero cost. We believe in democratizing creativity.
          </p>
        </div>

        <div className="flex justify-center">
          {plans.map((plan) => (
            <Card key={plan.id} className={cn(
              "relative flex flex-col w-full max-w-md rounded-[3rem] border-2 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:scale-105 overflow-hidden",
              plan.color,
              plan.popular && "blue-glow"
            )}>
              <div className="absolute top-6 right-6 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Active
              </div>
              <CardHeader className="p-10 pb-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-primary/20 text-primary"
                )}>
                  <plan.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-3xl font-headline">{plan.name}</CardTitle>
                <CardDescription className="text-base font-medium">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0 flex-1 space-y-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold font-headline">{plan.price}</span>
                  <span className="text-muted-foreground font-bold italic">/ lifetime</span>
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <div className="bg-green-500/10 p-1 rounded-full">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-10 pt-0">
                <Button 
                  className="w-full h-16 rounded-2xl font-bold text-lg transition-all bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30"
                  disabled
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <section className="bg-primary/5 border border-primary/20 rounded-[3.5rem] p-10 md:p-14 text-center space-y-6">
           <h3 className="text-3xl font-bold font-headline">No Subscriptions Required</h3>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium italic">
             VideoMaster AI is supported by our community and partners. Enjoy the best AI tools without any monthly bills.
           </p>
           <Button className="h-16 px-10 rounded-2xl bg-primary font-bold text-lg" asChild>
              <Link href="/dashboard">Back to Creative Hub</Link>
           </Button>
        </section>

        <AdBanner provider="Free Unlocked Studio Ads" />
      </main>
    </div>
  );
}
