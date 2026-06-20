
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Chrome, Facebook, Smartphone, ArrowLeft, Sparkles, Loader2, Info, ExternalLink, Github, AlertCircle, Copy } from "lucide-react";
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
      setAuthError(error.message);
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
      
      let description = error.message;
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError("auth/unauthorized-domain");
      } else if (error.code === 'auth/operation-not-allowed') {
        description = `⚠️ ${providerName} Login disabled hai! Firebase Console mein ise Enable karein.`;
        setAuthError(description);
      } else if (error.code === 'auth/billing-not-enabled') {
        setAuthError("auth/billing-not-enabled");
      }
      
      toast({
        variant: "destructive",
        title: `${providerName} Login Error`,
        description: description,
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
      console.error("Phone Auth Error:", error.code, error.message);
      let description = error.message;
      if (error.code === 'auth/operation-not-allowed') {
        description = "⚠️ Phone Login disabled hai! Firebase Console mein 'Phone' ko Enable karein.";
      } else if (error.code === 'auth/billing-not-enabled') {
        setAuthError("auth/billing-not-enabled");
        description = "⚠️ Billing not enabled! Firebase Console mein 'Blaze Plan' par upgrade karein.";
      }
      setAuthError(description);
      toast({ variant: "destructive", title: "Phone Error", description: description });
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
          {/* Billing Error Handler */}
          {authError === "auth/billing-not-enabled" && (
            <div className="p-5 bg-destructive/10 border border-destructive/20 rounded-2xl flex flex-col gap-4 animate-in zoom-in-95">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">Billing Not Enabled</p>
                  <p className="text-[11px] text-white/70 leading-relaxed">Phone Auth ke liye aapko Firebase project ko **Blaze Plan** par upgrade karna hoga. Ye Google ki policy hai.</p>
                </div>
              </div>
              <Button variant="link" className="h-auto p-0 text-[10px] text-primary font-bold justify-start gap-1" asChild>
                <a href="https://console.firebase.google.com/project/studio-9489287013-59986/usage/details" target="_blank" rel="noopener noreferrer">
                  Upgrade to Blaze Plan <ExternalLink className="w-2 h-2" />
                </a>
              </Button>
            </div>
          )}

          {/* Unauthorized Domain Error Handler */}
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

          {authError && authError !== "auth/unauthorized-domain" && authError !== "auth/billing-not-enabled" && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex gap-3 animate-in zoom-in-95">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-[10px] font-bold text-destructive leading-relaxed uppercase tracking-widest">{authError}</p>
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
                    className="h-14 rounded-2xl bg-black/40 border-white/10 focus:border-primary/50 transition-all text-white" 
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
                    className="h-14 rounded-2xl bg-black/40 border-white/10 focus:border-primary/50 transition-all text-white" 
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
                      className="h-14 rounded-2xl bg-black/40 border-white/10 focus:border-primary/50 transition-all text-white" 
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
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-[0.4em]">
              <span className="bg-[#0a0d14] px-4 text-muted-foreground">Neural Connect</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="h-14 rounded-2xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 transition-all group p-1" onClick={() => handleSocialLogin('google')} disabled={loading}>
              <Chrome className="w-4 h-4 text-red-500" />
              <span className="text-[10px]">Google</span>
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 transition-all group p-1" onClick={() => handleSocialLogin('facebook')} disabled={loading}>
              <Facebook className="w-4 h-4 text-blue-600" />
              <span className="text-[10px]">FB</span>
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 transition-all group p-1" onClick={() => handleSocialLogin('github')} disabled={loading}>
              <Github className="w-4 h-4 text-white" />
              <span className="text-[10px]">GitHub</span>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-6 pb-12 pt-6">
          <div className="text-xs text-center text-muted-foreground font-medium">
            New to the studio?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline transition-all">
              Create Free Account
            </Link>
          </div>
          <div className="flex items-center gap-3 px-5 py-2 bg-primary/10 rounded-full border border-primary/20 shadow-inner">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[9px] font-bold text-primary uppercase tracking-[0.3em]">Secure 256-bit AI Access</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
