
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Check, Zap, Cloud, Video, ShieldCheck, Loader2, Star, Rocket, Building2, CheckCircle2, Banknote, CreditCard, ArrowRight } from "lucide-react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
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
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const plans = [
    {
      id: "free",
      name: "Starter",
      price: "₹0",
      description: "Perfect for beginners",
      features: ["100 AI Credits", "720p Exports", "Basic AI Scripts", "Standard Support"],
      buttonText: "Current Plan",
      icon: Star,
      color: "border-slate-800"
    },
    {
      id: "pro",
      name: "Pro Studio",
      price: "₹99",
      description: "Best for creators",
      features: ["Unlimited AI Credits", "4K Ultra HD Exports", "Imagen 4 Thumbnails", "No Watermark"],
      buttonText: "Upgrade to Pro",
      icon: Rocket,
      popular: true,
      color: "border-primary shadow-primary/20"
    },
    {
      id: "business",
      name: "Agency",
      price: "₹499",
      description: "For professional teams",
      features: ["Everything in Pro", "Team Collaboration", "Priority AI Queue", "API Access"],
      buttonText: "Join Agency",
      icon: Building2,
      color: "border-purple-500 shadow-purple-500/10"
    }
  ];

  const handleUpgrade = async (planId: string) => {
    if (!user || planId === "free") return;
    setLoadingPlan(planId);
    
    const userRef = doc(db, "users", user.uid);
    const data = {
      isPremium: true,
      subscriptionPlan: planId,
      credits: 99999,
      updatedAt: new Date().toISOString()
    };

    try {
      // Simulation of a payment gateway delay (Razorpay integration point)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateDoc(userRef, data).catch(async (e) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: "update",
          requestResourceData: data
        } satisfies SecurityRuleContext);
        errorEmitter.emit("permission-error", permissionError);
      });
      
      setShowSuccess(true);
      toast({
        title: "Welcome to Pro Studio!",
        description: "Your account has been upgraded successfully.",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: e.message || "Please try again later.",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8 animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto border-2 border-primary animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-primary" />
           </div>
           <div className="space-y-4">
              <h1 className="text-4xl font-headline font-bold text-white tracking-tighter">PAYMENT SUCCESS!</h1>
              <p className="text-muted-foreground font-medium italic leading-relaxed">Aapka account ab PRO hai. Ab aap unlimited AI videos generate kar sakte hain.</p>
           </div>
           <Button className="w-full h-16 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30" onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pt-20 bg-background hero-gradient">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 space-y-16 py-12">
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
            <Crown className="w-3 h-3 fill-current" /> Monetize Your Creativity
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter">Choose Your <span className="text-primary italic">Success Plan</span></h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
            Join 5,000+ creators who use VideoMaster AI to earn more through professional content.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id} className={cn(
              "relative flex flex-col rounded-[3rem] border-2 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:scale-105 overflow-hidden",
              plan.color,
              plan.popular && "blue-glow"
            )}>
              {plan.popular && (
                <div className="absolute top-6 right-6 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
                  Most Popular
                </div>
              )}
              <CardHeader className="p-10 pb-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
                  plan.id === "pro" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  <plan.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-3xl font-headline">{plan.name}</CardTitle>
                <CardDescription className="text-base font-medium">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0 flex-1 space-y-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold font-headline">{plan.price}</span>
                  <span className="text-muted-foreground font-bold">/ month</span>
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
                  className={cn(
                    "w-full h-16 rounded-2xl font-bold text-lg transition-all",
                    plan.popular ? "bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30" : "variant-outline"
                  )}
                  disabled={loadingPlan === plan.id || (profile?.subscriptionPlan === plan.id) || plan.id === "free"}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {loadingPlan === plan.id ? <Loader2 className="animate-spin" /> : (profile?.subscriptionPlan === plan.id ? "Current Plan" : plan.buttonText)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bank Connection Info Card */}
        <section className="bg-indigo-500/5 border border-indigo-500/20 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center border border-indigo-500/20">
                 <Banknote className="w-10 h-10 text-indigo-400" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-bold font-headline">Bank Account & Earning</h3>
                 <p className="text-muted-foreground text-sm max-w-md font-medium">Aapki kamai direct bank mein aayegi. Google AdSense aur Subscription ka paisa kaise withdraw karna hai, ye jaanne ke liye guide padhein.</p>
              </div>
           </div>
           <Button variant="outline" className="h-14 px-10 rounded-2xl border-indigo-500/30 font-bold hover:bg-indigo-500/10" asChild>
              <Link href="/BANK_TRANSFER_GUIDE.md">Paisa Kaise Milega? <ArrowRight className="ml-2 w-4 h-4" /></Link>
           </Button>
        </section>

        <AdBanner provider="AdMob Premium Network" />

        <div className="grid md:grid-cols-4 gap-8 py-10">
          {[
            { label: "Revenue Generated", value: "₹2.5M+", icon: Zap },
            { label: "Happy Creators", value: "10k+", icon: ShieldCheck },
            { label: "AI Operations", value: "1M+", icon: Cloud },
            { label: "Global Reach", value: "45+", icon: Video },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2 p-6 rounded-[2rem] bg-background/40 border">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2 opacity-50" />
              <p className="text-3xl font-bold font-headline">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
