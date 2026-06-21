
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Video, Chrome, Facebook, Loader2, AlertCircle, Copy, ExternalLink, ArrowLeft, HelpCircle, ShieldCheck, AlertTriangle } from "lucide-react";
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
  
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

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
      const userData = {
        email: user.email,
        displayName: displayName,
        isPremium: false,
        isAdmin: false,
        subscriptionPlan: "free",
        credits: 100,
        photoURL: "",
        createdAt: new Date().toISOString(),
        usageStats: { totalVideos: 0, aiGenerations: 0 }
      };

      setDoc(userRef, userData).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: userData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });

      router.push("/dashboard");
    } catch (error: any) {
      setAuthError(error.code);
      toast({ 
        variant: "destructive", 
        title: "Registration Error", 
        description: error.code === 'auth/unauthorized-domain' ? "Security check required. See diagnostics." : error.message 
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
      const userData = {
        email: user.email,
        displayName: user.displayName,
        isPremium: false,
        isAdmin: false,
        subscriptionPlan: "free",
        credits: 100,
        photoURL: user.photoURL || "",
        createdAt: new Date().toISOString(),
        usageStats: { totalVideos: 0, aiGenerations: 0 }
      };

      setDoc(userRef, userData, { merge: true }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'write',
          requestResourceData: userData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });

      router.push("/dashboard");
    } catch (error: any) {
      setAuthError(error.code);
      toast({ variant: "destructive", title: "Social Sync Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#05070a] hero-gradient relative">
      <div className="fixed top-8 left-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Landing
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8 animate-in fade-in duration-700">
        <Card className="border-primary/10 bg-[#0a0d14]/80 backdrop-blur-3xl shadow-2xl rounded-[3rem] overflow-hidden blue-glow">
          <div className="h-2 bg-primary w-full" />
          <CardHeader className="text-center pt-10 pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-primary rounded-2xl p-4 shadow-xl shadow-primary/30">
                <Video className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-headline font-bold text-white">Join Studio</CardTitle>
            <CardDescription className="italic">Claim 100 Free AI Credits upon successful registration</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-10">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-widest text-primary ml-1 text-left block">First Name</Label>
                  <Input placeholder="John" required className="h-12 rounded-xl bg-black/40 border-white/10 text-white" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-widest text-primary ml-1 text-left block">Last Name</Label>
                  <Input placeholder="Doe" required className="h-12 rounded-xl bg-black/40 border-white/10 text-white" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-widest text-primary ml-1 text-left block">Email Address</Label>
                <Input type="email" placeholder="john@example.com" required className="h-12 rounded-xl bg-black/40 border-white/10 text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-widest text-primary ml-1 text-left block">Secure Password</Label>
                <Input type="password" placeholder="Min. 8 characters" required className="h-12 rounded-xl bg-black/40 border-white/10 text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
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
              Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign in instead</Link>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest gap-2 text-muted-foreground hover:text-white">
                  <HelpCircle className="w-3 h-3" /> Connection Diagnostics
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0a0d14] border-white/10 rounded-[2.5rem] p-10 max-w-md text-white">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-headline font-bold">Security Diagnostics</DialogTitle>
                  <DialogDescription className="italic">Owner: Add these domains to Firebase to enable Registration.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                   {["videomaster-ai.tech", "localhost"].map(d => (
                     <div key={d} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                        <code className="text-[10px] font-mono text-primary">{d}</code>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(d)}><Copy className="w-3.5 h-3.5" /></Button>
                     </div>
                   ))}
                   <Button className="w-full mt-4 bg-red-600 hover:bg-red-700" asChild>
                     <a href="https://console.firebase.google.com/project/studio-9489287013-59986/authentication/settings" target="_blank">Open Firebase Settings</a>
                   </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
