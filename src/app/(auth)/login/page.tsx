"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Chrome, ArrowLeft, Loader2, Eye, EyeOff, ShieldCheck, Crown, Zap, Sparkles } from "lucide-react";
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
  const returnUrl = searchParams.get("returnUrl") || "/editor";
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast({ title: "Session Established", description: "Loading global workspace nodes..." });
      router.push(returnUrl);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid node credentials." });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          isPremium: true,
          isAdmin: false,
          subscriptionPlan: "pro",
          credits: 999999,
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      router.push(returnUrl);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Social Sync Failed", description: "Handshake interrupted." });
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
          isPremium: true,
          isAdmin: false,
          subscriptionPlan: "pro",
          credits: 999999,
          createdAt: new Date().toISOString(),
          isAnonymous: true
        }, { merge: true });
      }

      toast({ title: "Ephemeral Access Active", description: "Entering Unlocked Pro Workspace." });
      router.push(returnUrl);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Guest Link Error", description: "Node initialization failed." });
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <CardContent className="space-y-10 p-12">
      <Button 
        className="w-full h-24 gap-5 bg-primary hover:bg-primary/90 font-black rounded-full shadow-glow text-white uppercase tracking-widest text-lg relative overflow-hidden group" 
        onClick={handleGuestEntry} 
        disabled={guestLoading || loading}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
        {guestLoading ? <Loader2 className="animate-spin" /> : <Zap className="w-8 h-8 fill-current group-hover:animate-pulse" />} 
        Enter Studio Free
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
        <div className="relative flex justify-center text-[10px] uppercase font-black text-muted-foreground tracking-[0.6em]"><span className="bg-[#0a061c] px-6">OR USE IDENTITY HUB</span></div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Button 
          variant="outline" 
          className="w-full h-16 gap-4 border-white/10 bg-white/5 font-black rounded-full hover:bg-primary/10 transition-all text-white text-[11px] uppercase tracking-widest" 
          onClick={handleSocialLogin} 
          disabled={loading || guestLoading}
        >
          <Chrome className="w-5 h-5 text-accent" /> Continue with Google
        </Button>
      </div>

      <form onSubmit={handleLogin} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-primary ml-6 font-black tracking-[0.4em]">Email Node</Label>
            <Input 
              type="email" 
              placeholder="identity@videomaster.ai" 
              required 
              className="h-16 bg-black/40 border-white/10 rounded-full px-8 focus:border-primary/50 text-white font-medium text-lg" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-primary ml-6 font-black tracking-[0.4em]">Password Key</Label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
                className="h-16 bg-black/40 border-white/10 pr-20 rounded-full px-8 focus:border-primary/50 text-white font-medium text-lg" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>
        </div>
        <Button type="submit" className="w-full h-20 font-black uppercase tracking-[0.4em] rounded-full shadow-2xl active:scale-95 transition-all text-xs" disabled={loading || guestLoading}>
          {loading ? <Loader2 className="animate-spin" /> : "Authorize & Enter"}
        </Button>
      </form>
    </CardContent>
  );
}

function LoginWrapper() {
  return (
    <Suspense fallback={<div className="p-20 text-center animate-pulse text-primary font-black uppercase tracking-[1em]">Establishing Link...</div>}>
      <LoginForm />
    </Suspense>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#03010a] relative overflow-hidden">
      {/* DECOR */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] -z-10" />
      
      <div className="fixed top-12 left-12">
        <Link href="/" className="flex items-center gap-4 font-black text-muted-foreground hover:text-primary transition-all group text-[11px] uppercase tracking-[0.5em]">
          <div className="p-4 glass-panel rounded-full group-hover:border-primary/50 group-hover:translate-x-[-4px] transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Exit Hub
        </Link>
      </div>

      <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-700">
        <Card className="border-white/5 bg-[#0a061c]/60 backdrop-blur-3xl rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden">
          <CardHeader className="text-center pt-20 pb-0">
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-gradient-to-br from-primary to-accent rounded-[2.5rem] shadow-glow relative group">
                <Video className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 blur-2xl bg-primary/40 rounded-full scale-150 animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-5xl md:text-7xl font-bold font-headline text-white uppercase tracking-tighter mb-4 leading-none">Access <br/> Studio <span className="text-primary italic">Node.</span></CardTitle>
            <CardDescription className="italic text-xl text-muted-foreground opacity-60">Select your entry protocol</CardDescription>
          </CardHeader>

          <LoginWrapper />

          <CardFooter className="flex flex-col space-y-8 pb-20 pt-4">
            <div className="text-lg text-center text-muted-foreground">
              New node? <Link href="/signup" className="text-primary font-black uppercase tracking-widest hover:underline ml-2">Create Account</Link>
            </div>
            <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground uppercase font-black tracking-[1em] opacity-20">
               <ShieldCheck className="w-4 h-4" /> Secure Auth Hub Active
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}