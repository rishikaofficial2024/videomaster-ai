
"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Check, Zap, Cloud, Video, ShieldCheck, Loader2 } from "lucide-react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function PremiumPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { data: profile } = useDoc(user ? doc(db, "users", user.uid) : null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = async () => {
    if (!user) return;
    setLoading(true);
    const userRef = doc(db, "users", user.uid);
    const data = {
      isPremium: true,
      credits: 9999,
    };

    try {
      await updateDoc(userRef, data).catch(async (e) => {
        errorEmitter.emit("permission-error", new FirestorePermissionError({
          path: userRef.path,
          operation: "update",
          requestResourceData: data
        }));
      });
      toast({
        title: "Welcome to PRO!",
        description: "You now have access to all professional features.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Upgrade Failed",
        description: "Could not process your subscription.",
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { title: "4K High Res Exports", icon: Video, desc: "Export videos in stunning crystal clear 4K." },
    { title: "Unlimited AI Credits", icon: Zap, desc: "Run auto-captions and content analysis endlessly." },
    { title: "100GB Cloud Storage", icon: Cloud, desc: "Keep all your high-res source files in sync." },
    { title: "No Ads Ever", icon: ShieldCheck, desc: "Clean, professional workspace without interruptions." },
  ];

  return (
    <div className="min-h-screen pb-20 md:pt-20 bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 flex flex-col items-center text-center space-y-12 py-10">
        <div className="space-y-4">
          <div className="bg-primary/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-primary fill-primary" />
          </div>
          <h1 className="text-4xl font-headline font-bold">VideoMaster <span className="text-primary underline">PRO</span></h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Unlock professional tools and limitless AI reasoning to take your content to the next level.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full">
          {features.map((f, i) => (
            <Card key={i} className="text-left border-none bg-card/50 shadow-md">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="w-full max-w-md border-primary shadow-2xl shadow-primary/10 relative overflow-hidden bg-gradient-to-br from-card to-background">
          <div className="absolute top-0 right-0 p-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">Best Value</div>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Annual Plan</CardTitle>
            <CardDescription>Billed annually. Cancel anytime.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold font-headline">₹99</span>
              <span className="text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-3 text-sm text-left px-4">
              <li className="flex items-center gap-2">
                <Check className="text-primary w-4 h-4" /> 
                {profile?.isPremium ? "Active Subscription" : "All Premium Features"}
              </li>
              <li className="flex items-center gap-2"><Check className="text-primary w-4 h-4" /> Early Access to AI Tools</li>
              <li className="flex items-center gap-2"><Check className="text-primary w-4 h-4" /> Dedicated Support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
              onClick={handleUpgrade}
              disabled={loading || profile?.isPremium}
            >
              {loading ? <Loader2 className="animate-spin" /> : profile?.isPremium ? "Already Subscribed" : "Upgrade Now"}
            </Button>
          </CardFooter>
        </Card>
        
        <p className="text-xs text-muted-foreground">By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
      </main>
    </div>
  );
}
