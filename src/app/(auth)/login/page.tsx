
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Chrome, Facebook, ArrowLeft, Sparkles, Loader2, Info, ExternalLink, Github, AlertCircle, Copy, HelpCircle, ShieldCheck, Zap } from "lucide-react";
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

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {}
      });
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phone) return;
    setLoading(true);
    setAuthError(null);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      toast({ title: "OTP Sent", description: "Please check your mobile messages." });
    } catch (error: any) {
      setAuthError(error.code);
      if (error.code === 'auth/billing-not-enabled') setShowTroubleshoot(true);
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
      toast({ variant: "destructive", title: "Invalid OTP", description: "The code you entered is incorrect." });
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
      <div id="recaptcha-container"></div>
      
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
          <CardTitle className="text-4xl font-headline font-bold tracking-tighter text-white">Enter Studio</CardTitle>
          <CardDescription className="text-sm font-medium text-muted-foreground italic">
            Continue your cinematic journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-10">
          {/* Elite Troubleshooting UI */}
          {(authError || showTroubleshoot) && (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-3xl space-y-4 animate-in zoom-in-95">
              <div className="flex gap-3">
                <ShieldCheck className="w-6 h-6 text-red-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Sync Connection Fix</p>
                  <p className="text-[11px] text-white/70">Bhaai, login sync karne ke liye ye steps 1 minute mein poore karein:</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-black/40 rounded-xl border border-white/10">
                  <code className="flex-1 text-[10px] font-mono text-primary truncate">{currentHostname}</code>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => copyToClipboard(currentHostname)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Button className="w-full h-10 rounded-xl bg-red-600 hover:bg-red-700 text-[9px] font-bold uppercase tracking-wider" asChild>
                    <a href="https://console.firebase.google.com/project/studio-9489287013-59986/authentication/providers" target="_blank">
                      1. Enable Google/FB Sync <ExternalLink className="ml-2 w-3 h-3" />
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full h-10 rounded-xl border-red-500/30 text-[9px] font-bold uppercase tracking-wider" asChild>
                    <a href="https://console.firebase.google.com/project/studio-9489287013-59986/authentication/settings" target="_blank">
                      2. Add Authorized Domain <ExternalLink className="ml-2 w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
              <p className="text-[9px] text-white/40 text-center italic">Error Code: {authError || "SYNC_FAILED"}</p>
            </div>
          )}

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-2xl p-1.5 mb-8 border border-white/5">
              <TabsTrigger value="email" className="rounded-xl font-bold text-[10px] uppercase tracking-widest py-3">Email Access</TabsTrigger>
              <TabsTrigger value="phone" className="rounded-xl font-bold text-[10px] uppercase tracking-widest py-3">Mobile OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-6 animate-in fade-in duration-500">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Registered Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    required 
                    className="h-14 rounded-2xl bg-black/40 border-white/10 focus:border-primary/50 text-white" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="password" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Security Key</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    className="h-14 rounded-2xl bg-black/40 border-white/10 focus:border-primary/50 text-white" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full h-16 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : "Sign In to Studio"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone" className="space-y-6 animate-in fade-in duration-500">
              {!confirmationResult ? (
                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="phone" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Mobile Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      className="h-14 rounded-2xl bg-black/40 border-white/10 focus:border-primary/50 text-white" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <Button onClick={handlePhoneSignIn} className="w-full h-16 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" disabled={loading || !phone}>
                    {loading ? <Loader2 className="animate-spin" /> : "Send OTP Verification"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="otp" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Enter 6-Digit OTP</Label>
                    <Input 
                      id="otp" 
                      placeholder="123456" 
                      className="h-16 rounded-2xl bg-black/40 border-white/10 text-center tracking-[0.5em] text-2xl font-bold text-white" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <Button onClick={handleVerifyOtp} className="w-full h-16 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/20" disabled={loading || otp.length < 6}>
                    {loading ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="h-14 rounded-2xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 transition-all p-1" onClick={() => handleSocialLogin('google')} disabled={loading}>
              <Chrome className="w-4 h-4 text-red-500" />
              <span className="text-[10px]">Google</span>
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 transition-all p-1" onClick={() => handleSocialLogin('facebook')} disabled={loading}>
              <Facebook className="w-4 h-4 text-blue-600" />
              <span className="text-[10px]">FB</span>
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 transition-all p-1" onClick={() => handleSocialLogin('github')} disabled={loading}>
              <Github className="w-4 h-4 text-white" />
              <span className="text-[10px]">GitHub</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-6 pb-12 pt-6">
          <div className="text-xs text-center text-muted-foreground font-medium">
            New to the studio?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Create Free Account
            </Link>
          </div>
          <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest gap-2 text-muted-foreground" onClick={() => setShowTroubleshoot(!showTroubleshoot)}>
            <HelpCircle className="w-3 h-3" /> Troubleshoot Sync
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
