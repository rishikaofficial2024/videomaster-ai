
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Chrome, Facebook, Loader2, AlertCircle, Copy, ExternalLink, ArrowLeft, HelpCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentHostname, setCurrentHostname] = useState("");
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHostname(window.location.hostname);
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const displayName = `${firstName} ${lastName}`;

      await updateProfile(user, { displayName });

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        displayName: displayName,
        isPremium: false,
        isAdmin: false,
        subscriptionPlan: "free",
        credits: 100,
        photoURL: "",
        createdAt: new Date().toISOString(),
        usageStats: { totalVideos: 0, aiGenerations: 0 }
      });
      router.push("/dashboard");
    } catch (error: any) {
      setAuthError(error.code || error.message);
      if (error.code === 'auth/unauthorized-domain') setShowTroubleshoot(true);
      toast({ variant: "destructive", title: "Signup Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (providerName: 'google' | 'facebook') => {
    try {
      setLoading(true);
      setAuthError(null);
      const provider = providerName === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        isPremium: false,
        isAdmin: false,
        subscriptionPlan: "free",
        credits: 100,
        photoURL: user.photoURL || "",
        createdAt: new Date().toISOString(),
        usageStats: { totalVideos: 0, aiGenerations: 0 }
      }, { merge: true });
      router.push("/dashboard");
    } catch (error: any) {
      setAuthError(error.code || error.message);
      if (error.code === 'auth/unauthorized-domain') setShowTroubleshoot(true);
      toast({ variant: "destructive", title: "Social Signup Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Domain copied to clipboard." });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#05070a] hero-gradient relative">
      <div className="fixed top-8 left-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>
      </div>

      <Card className="w-full max-w-md border-primary/10 bg-[#0a0d14]/80 backdrop-blur-3xl shadow-2xl rounded-[3rem] overflow-hidden blue-glow">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="text-center pt-10 pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-2xl p-4 shadow-xl shadow-primary/30">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-white">Join Studio</CardTitle>
          <CardDescription className="italic">Get 100 Free AI Credits upon joining</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-10">
          {(authError === "auth/unauthorized-domain" || showTroubleshoot) && (
            <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Login Fix Required</p>
                  <p className="text-[11px] text-white/70">Niche wala domain copy karke Firebase Console mein add karein:</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-black/40 rounded-xl border border-white/10">
                <code className="flex-1 text-[10px] font-mono text-primary truncate">{currentHostname}</code>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(currentHostname)}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Button className="w-full h-10 rounded-xl bg-red-600 font-bold text-[10px]" asChild>
                  <a href="https://console.firebase.google.com/project/studio-9489287013-59986/authentication/settings" target="_blank">
                    Open Firebase Settings <ExternalLink className="ml-2 w-3 h-3" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-widest text-primary ml-1">First Name</Label>
                <Input placeholder="John" required className="h-12 rounded-xl bg-black/40 border-white/10 text-white" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-widest text-primary ml-1">Last Name</Label>
                <Input placeholder="Doe" required className="h-12 rounded-xl bg-black/40 border-white/10 text-white" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-widest text-primary ml-1">Email</Label>
              <Input type="email" placeholder="john@example.com" required className="h-12 rounded-xl bg-black/40 border-white/10 text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-widest text-primary ml-1">Password</Label>
              <Input type="password" required className="h-12 rounded-xl bg-black/40 border-white/10 text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/20" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Start Free Journey"}
            </Button>
          </form>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 rounded-xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5" onClick={() => handleSocialSignup('google')} disabled={loading}>
              <Chrome className="w-4 h-4 text-red-500" /> Google
            </Button>
            <Button variant="outline" className="h-12 rounded-xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5" onClick={() => handleSocialSignup('facebook')} disabled={loading}>
              <Facebook className="w-4 h-4 text-blue-600" /> Facebook
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-10 pt-4">
          <div className="text-xs text-center text-muted-foreground font-medium">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
