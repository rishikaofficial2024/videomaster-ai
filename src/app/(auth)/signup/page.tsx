
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Chrome, Facebook, Sparkles, Loader2, AlertCircle, Copy, ExternalLink, ArrowLeft } from "lucide-react";
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
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentHostname, setCurrentHostname] = useState("");
  
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
      const profileData = {
        email: user.email,
        displayName: displayName,
        isPremium: false,
        isAdmin: false,
        subscriptionPlan: "free",
        credits: 100,
        photoURL: "",
        createdAt: new Date().toISOString(),
        usageStats: {
          totalVideos: 0,
          aiGenerations: 0
        }
      };

      setDoc(userRef, profileData)
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: profileData
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        });

      router.push("/dashboard");
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError("auth/unauthorized-domain");
      } else {
        setAuthError(error.message);
      }
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
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
      const profileData = {
        email: user.email,
        displayName: user.displayName,
        isPremium: false,
        isAdmin: false,
        subscriptionPlan: "free",
        credits: 100,
        photoURL: user.photoURL || "",
        createdAt: new Date().toISOString(),
        usageStats: {
          totalVideos: 0,
          aiGenerations: 0
        }
      };

      setDoc(userRef, profileData, { merge: true })
        .catch(async () => {});

      router.push("/dashboard");
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError("auth/unauthorized-domain");
      } else {
        setAuthError(error.message);
      }
      toast({
        variant: "destructive",
        title: "Social Signup Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Domain copied to clipboard." });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#05070a] hero-gradient overflow-hidden">
      <div className="fixed top-8 left-8 flex items-center gap-4 z-50">
        <Link href="/" className="flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-colors group">
          <div className="p-2 bg-background/50 rounded-xl shadow-sm group-hover:shadow-md transition-all border border-white/5 backdrop-blur-md">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back Home
        </Link>
      </div>

      <Card className="w-full max-w-md border-primary/10 bg-[#0a0d14]/80 backdrop-blur-3xl shadow-2xl rounded-[3rem] overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-1000 blue-glow relative z-10">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="space-y-2 text-center pt-10 pb-4">
          <div className="flex justify-center mb-6">
            <div className="bg-primary rounded-[1.5rem] p-4 shadow-xl shadow-primary/30 animate-float">
              <Video className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-headline font-bold tracking-tighter text-white">Join Studio</CardTitle>
          <CardDescription className="text-sm font-medium text-muted-foreground italic">
            Get 100 Free AI Credits upon joining
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-10">
          {authError === "auth/unauthorized-domain" && (
            <div className="p-5 bg-destructive/10 border border-destructive/20 rounded-2xl flex flex-col gap-4 animate-in zoom-in-95">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">Unauthorized Domain Error</p>
                  <p className="text-[11px] text-white/70">Niche diye gaye domain ko copy karein aur Firebase Console mein add karein:</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-black/40 rounded-xl border border-white/5 group">
                <code className="flex-1 text-[10px] font-mono text-primary truncate">{currentHostname}</code>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => copyToClipboard(currentHostname)}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>

              <Button variant="link" className="h-auto p-0 text-[10px] text-primary font-bold justify-start gap-1" asChild>
                <a href="https://console.firebase.google.com/project/studio-9489287013-59986/authentication/settings" target="_blank" rel="noopener noreferrer">
                  Open Firebase Settings <ExternalLink className="w-2 h-2" />
                </a>
              </Button>
            </div>
          )}

          {authError && authError !== "auth/unauthorized-domain" && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex gap-3 animate-in zoom-in-95">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-[10px] font-bold text-destructive leading-relaxed uppercase tracking-widest">{authError}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <Label htmlFor="firstName" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  required 
                  className="h-14 rounded-2xl bg-black/40 border-white/10 focus:border-primary/50 transition-all text-white" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="lastName" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  required 
                  className="h-14 rounded-2xl bg-black/40 border-white/10 focus:border-primary/50 transition-all text-white" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="email" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                required 
                className="h-14 rounded-2xl bg-black/40 border-white/10 focus:border-primary/50 transition-all text-white" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="password" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="h-14 rounded-2xl bg-black/40 border-white/10 focus:border-primary/50 transition-all text-white" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-16 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Start Free Journey"}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-[0.4em]">
              <span className="bg-[#0a0d14] px-4 text-muted-foreground">Quick Signup</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-14 rounded-2xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 transition-all group" onClick={() => handleSocialSignup('google')} disabled={loading}>
              <Chrome className="w-4 h-4 text-red-500" />
              Google
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 transition-all group" onClick={() => handleSocialSignup('facebook')} disabled={loading}>
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-6 pb-12 pt-6">
          <div className="text-xs text-center text-muted-foreground font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Log in
            </Link>
          </div>
          <div className="flex items-center gap-3 px-5 py-2 bg-primary/10 rounded-full border border-primary/20 shadow-inner">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[9px] font-bold text-primary uppercase tracking-[0.3em]">Neural Connect Verified</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
