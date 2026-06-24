
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Chrome, ArrowLeft, Loader2, Eye, EyeOff, ShieldCheck, UserCircle2, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInAnonymously
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast({
        title: "Access Granted",
        description: "Welcome back to the Studio.",
      });
      router.push(returnUrl);
    } catch (error: any) {
      let errorMessage = "Invalid email or password.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        errorMessage = "Account not found. Please sign up.";
      }
      toast({ variant: "destructive", title: "Security Alert", description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push(returnUrl);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Google Login Error", description: "Connection interrupted." });
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
          email: "guest-" + user.uid.slice(0, 5) + "@videomaster.ai",
          displayName: "Guest Creator",
          isPremium: false,
          isAdmin: false,
          subscriptionPlan: "free",
          credits: 100,
          createdAt: new Date().toISOString(),
          isAnonymous: true
        }, { merge: true });
      }

      toast({ title: "Guest Access Active", description: "100 FREE Credits assigned to guest node." });
      router.push(returnUrl);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Guest Access Failed", description: "Could not initialize anonymous node." });
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <CardContent className="space-y-6">
      <Button 
        variant="default" 
        className="w-full h-16 gap-3 bg-indigo-600 hover:bg-indigo-700 font-black rounded-2xl shadow-xl shadow-indigo-600/20 text-white uppercase tracking-widest text-xs" 
        onClick={handleGuestEntry} 
        disabled={guestLoading || loading}
      >
        {guestLoading ? <Loader2 className="animate-spin" /> : <Zap className="w-5 h-5 fill-current" />} 
        Bina Password Entry (Guest)
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
        <div className="relative flex justify-center text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em]"><span className="bg-[#0a0d14] px-4">OR USE GOOGLE</span></div>
      </div>

      <Button 
        variant="outline" 
        className="w-full h-14 gap-3 border-white/10 bg-white/5 font-bold rounded-2xl hover:bg-primary/10 transition-all text-white" 
        onClick={handleSocialLogin} 
        disabled={loading || guestLoading}
      >
        <Chrome className="w-5 h-5 text-red-500" /> Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
        <div className="relative flex justify-center text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em]"><span className="bg-[#0a0d14] px-4">OR EMAIL</span></div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase text-primary ml-1 font-bold tracking-widest">Email</Label>
          <Input 
            type="email" 
            placeholder="name@example.com" 
            required 
            className="h-12 bg-black/40 border-white/10 rounded-xl focus:border-primary/50 text-white" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase text-primary ml-1 font-bold tracking-widest">Password</Label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              required 
              className="h-12 bg-black/40 border-white/10 pr-12 rounded-xl focus:border-primary/50 text-white" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full h-14 font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20" disabled={loading || guestLoading}>
          {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
        </Button>
      </form>
    </CardContent>
  );
}

function LoginWrapper() {
  return (
    <Suspense fallback={<div className="p-10 text-center animate-pulse text-primary font-bold uppercase tracking-widest">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#05070a] relative">
      <div className="fixed top-8 left-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-colors group">
          <div className="p-2 bg-white/5 rounded-xl border border-white/5 group-hover:border-primary/50 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Home
        </Link>
      </div>

      <div className="w-full max-w-md animate-in fade-in duration-500 space-y-6">
        <Card className="border-white/5 bg-[#0a0d14] rounded-[2.5rem] shadow-2xl overflow-hidden border-t-primary/20 border-t-2">
          <CardHeader className="text-center pt-8 pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                <Video className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-headline text-white uppercase tracking-tight">Access Studio</CardTitle>
            <CardDescription className="italic text-muted-foreground">Select your entry protocol</CardDescription>
          </CardHeader>

          <LoginWrapper />

          <CardFooter className="flex flex-col space-y-4 pb-8 pt-2">
            <div className="text-sm text-center text-muted-foreground">
              New creator? <Link href="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
            </div>
            <div className="flex items-center justify-center gap-2 text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-20">
               <ShieldCheck className="w-3 h-3" /> Secure Auth Active
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
