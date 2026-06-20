
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Chrome, Facebook, ArrowLeft, Loader2, ExternalLink, Github, Copy, HelpCircle, ShieldCheck, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  GithubAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { useAuth } from "@/firebase";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentHostname, setCurrentHostname] = useState("");
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHostname(window.location.hostname);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      setAuthError(error.code || error.message);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'facebook' | 'github') => {
    try {
      setLoading(true);
      setAuthError(null);
      let provider;
      if (providerName === 'google') provider = new GoogleAuthProvider();
      else if (providerName === 'facebook') provider = new FacebookAuthProvider();
      else provider = new GithubAuthProvider();

      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Auth Error:", error.code, error.message);
      setAuthError(error.code);
      
      if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed' || error.code === 'auth/invalid-credential') {
        setShowTroubleshoot(true);
      }
      
      toast({
        variant: "destructive",
        title: `${providerName} Sync Error`,
        description: "Bhaai, Firebase settings mein kuch problem hai. Niche 'Troubleshoot' check karein.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phone) return;
    setLoading(true);
    setAuthError(null);
    try {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
      const result = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmationResult(result);
      toast({ title: "OTP Sent", description: "Check your messages." });
    } catch (error: any) {
      setAuthError(error.code);
      toast({ variant: "destructive", title: "Phone Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return;
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Invalid OTP" });
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
      <div id="recaptcha-container"></div>
      
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
          <CardTitle className="text-3xl font-headline font-bold text-white">Enter Studio</CardTitle>
          <CardDescription className="italic">Continue your cinematic journey</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-10">
          {(authError || showTroubleshoot) && (
            <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Sync Connection Fix</p>
                  <p className="text-[11px] text-white/70">Social login chalu karne ke liye ye domain Firebase mein add karein:</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-black/40 rounded-xl border border-white/10">
                <code className="flex-1 text-[10px] font-mono text-primary truncate">{currentHostname}</code>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(currentHostname)}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button className="w-full h-10 rounded-xl bg-red-600 hover:bg-red-700 text-[9px] font-bold uppercase tracking-wider" asChild>
                  <a href="https://console.firebase.google.com/project/studio-9489287013-59986/authentication/providers" target="_blank">
                    1. Enable Social Providers <ExternalLink className="ml-2 w-3 h-3" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full h-10 rounded-xl border-red-500/30 text-[9px] font-bold uppercase tracking-wider" asChild>
                  <a href="https://console.firebase.google.com/project/studio-9489287013-59986/authentication/settings" target="_blank">
                    2. Add Authorized Domain <ExternalLink className="ml-2 w-3 h-3" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-2xl p-1 mb-6">
              <TabsTrigger value="email" className="rounded-xl font-bold text-[10px] uppercase py-2.5">Email</TabsTrigger>
              <TabsTrigger value="phone" className="rounded-xl font-bold text-[10px] uppercase py-2.5">Mobile OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-primary ml-1">Email</Label>
                <Input type="email" placeholder="name@example.com" className="h-12 rounded-xl bg-black/40 border-white/10 text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-primary ml-1">Security Key</Label>
                <Input type="password" className="h-12 rounded-xl bg-black/40 border-white/10 text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button onClick={handleLogin} className="w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/20" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Sign In to Studio"}
              </Button>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4">
              {!confirmationResult ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-primary ml-1">Mobile Number</Label>
                    <Input type="tel" placeholder="+91 98765 43210" className="h-12 rounded-xl bg-black/40 border-white/10 text-white" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <Button onClick={handlePhoneSignIn} className="w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/20" disabled={loading || !phone}>
                    {loading ? <Loader2 className="animate-spin" /> : "Send OTP"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-primary ml-1">Enter OTP</Label>
                    <Input placeholder="123456" className="h-12 rounded-xl bg-black/40 border-white/10 text-center tracking-widest text-xl font-bold text-white" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
                  </div>
                  <Button onClick={handleVerifyOtp} className="w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/20" disabled={loading || otp.length < 6}>
                    {loading ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="h-12 rounded-xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 p-1" onClick={() => handleSocialLogin('google')} disabled={loading}>
              <Chrome className="w-4 h-4 text-red-500" />
              <span className="text-[9px]">Google</span>
            </Button>
            <Button variant="outline" className="h-12 rounded-xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 p-1" onClick={() => handleSocialLogin('facebook')} disabled={loading}>
              <Facebook className="w-4 h-4 text-blue-600" />
              <span className="text-[9px]">FB</span>
            </Button>
            <Button variant="outline" className="h-12 rounded-xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 p-1" onClick={() => handleSocialLogin('github')} disabled={loading}>
              <Github className="w-4 h-4 text-white" />
              <span className="text-[9px]">GitHub</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-10 pt-4">
          <div className="text-xs text-center text-muted-foreground font-medium">
            New to the studio? <Link href="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
          </div>
          <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest gap-2 text-muted-foreground" onClick={() => setShowTroubleshoot(!showTroubleshoot)}>
            <HelpCircle className="w-3 h-3" /> Troubleshoot Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
