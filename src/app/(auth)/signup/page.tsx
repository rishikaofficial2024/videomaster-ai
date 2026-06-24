"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Chrome, Loader2, Eye, EyeOff, ArrowLeft, ShieldCheck, Zap, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInAnonymously
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: fullName });

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        displayName: fullName,
        isPremium: true,
        isAdmin: false,
        subscriptionPlan: "pro",
        credits: 999999,
        createdAt: new Date().toISOString(),
        usageStats: { totalVideos: 0, aiGenerations: 0 }
      }, { merge: true });
      
      toast({ title: "Welcome!", description: "Unlimited Free Pro Credits unlocked." });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Registration Alert", description: "Error during account creation." });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEntry = async () => {
    setGuestLoading(true);
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          email: "guest@videomaster.ai",
          displayName: "Guest Creator",
          isPremium: true,
          isAdmin: false,
          subscriptionPlan: "pro",
          credits: 999999,
          createdAt: new Date().toISOString(),
          isAnonymous: true
        }, { merge: true });
      }

      toast({ title: "Guest Protocol Active", description: "Unlimited Pro Credits available." });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Guest Access Failed", description: "Connection interrupted." });
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#05070a] relative">
      <div className="fixed top-8 left-8">
        <Link href="/login" className="flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </div>

      <div className="w-full max-w-md animate-in fade-in duration-500">
        <Card className="border-white/5 bg-[#0a0d14] rounded-[2.5rem] shadow-2xl overflow-hidden border-t-2 border-primary/20">
          <CardHeader className="text-center pt-8 pb-4">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Video className="w-10 h-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-headline uppercase tracking-tight">Join Free Studio</CardTitle>
            <CardDescription className="italic">Start creating with Unlimited Free Credits</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button 
              className="w-full h-16 gap-3 bg-primary hover:bg-primary/90 font-black rounded-2xl shadow-xl shadow-primary/20 text-xs uppercase tracking-[0.2em]" 
              onClick={handleGuestEntry} 
              disabled={guestLoading || loading}
            >
              {guestLoading ? <Loader2 className="animate-spin" /> : <Crown className="w-5 h-5 fill-current" />} 
              Enter Free Pro Studio (Guest)
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-muted-foreground"><span className="bg-[#0a0d14] px-4">OR USE FORM</span></div>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-primary ml-1 font-bold">Full Name</Label>
                <Input placeholder="John Doe" required className="h-12 bg-black/40 border-white/10" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-primary ml-1 font-bold">Email</Label>
                <Input type="email" placeholder="john@example.com" required className="h-12 bg-black/40 border-white/10" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-primary ml-1 font-bold">Password</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" required className="h-12 bg-black/40 border-white/10 pr-12" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-14 font-black uppercase tracking-widest rounded-xl" disabled={loading || guestLoading}>
                {loading ? <Loader2 className="animate-spin" /> : "Get Started Free"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8 pt-2">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login</Link>
            </div>
            <div className="flex items-center justify-center gap-2 text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-20">
               <ShieldCheck className="w-3 h-3" /> Secure Node Access
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
