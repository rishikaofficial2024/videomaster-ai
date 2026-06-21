
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Chrome, Facebook, ArrowLeft, Loader2, ExternalLink, Github, Copy, HelpCircle, ShieldCheck, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";
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
      router.push(returnUrl);
    } catch (error: any) {
      setAuthError(error.code);
      if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed') setShowTroubleshoot(true);
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: error.message || "Invalid credentials or unauthorized node.",
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
      router.push(returnUrl);
    } catch (error: any) {
      setAuthError(error.code);
      if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed') {
        setShowTroubleshoot(true);
      }
      toast({
        variant: "destructive",
        title: "Social Sync Error",
        description: "A configuration block is preventing access. Please see the troubleshooting card.",
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
      toast({ title: "OTP Sent", description: "Identity token dispatched to your mobile device." });
    } catch (error: any) {
      setAuthError(error.code);
      if (error.code === 'auth/unauthorized-domain') setShowTroubleshoot(true);
      toast({ variant: "destructive", title: "Mobile Verification Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return;
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      router.push(returnUrl);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Invalid Token", description: "Verification failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `"${text}" copied to clipboard.` });
  };

  const authorizedDomains = [
    "videomaster-ai.tech",
    "studio-9489287013-59986.web.app",
    "studio-9489287013-59986.firebaseapp.com",
    "localhost"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#05070a] hero-gradient relative">
      <div id="recaptcha-container"></div>
      
      <div className="fixed top-8 left-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Exit to Landing
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8 animate-in fade-in duration-700">
        {(authError || showTroubleshoot) && (
          <Card className="border-red-500/40 bg-red-500/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="bg-red-500 h-1.5 w-full" />
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-red-500">Permanent Fix Required</CardTitle>
              </div>
              <CardDescription className="text-xs italic text-white/60">
                Owners: You must add these domains to your Firebase settings to enable login:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-col gap-2">
                  {authorizedDomains.map(domain => (
                    <div key={domain} className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5 group hover:border-primary/30 transition-all">
                      <code className="text-[10px] font-mono text-primary truncate">{domain}</code>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10" onClick={() => copyToClipboard(domain)}>
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 pt-2">
                <Button className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-red-600/20" asChild>
                  <a href="https://console.firebase.google.com/project/studio-9489287013-59986/authentication/settings" target="_blank">
                    Step 2: Add Domains to Firebase <ExternalLink className="ml-2 w-3.5 h-3.5" />
                  </a>
                </Button>
                <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider" asChild>
                  <a href="https://console.firebase.google.com/project/studio-9489287013-59986/authentication/providers" target="_blank">
                    Step 3: Enable Providers <ExternalLink className="ml-2 w-3.5 h-3.5" />
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                 <p className="text-[9px] text-emerald-500 font-bold uppercase">Login will work instantly after adding these.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-primary/10 bg-[#0a0d14]/80 backdrop-blur-3xl shadow-2xl rounded-[3.5rem] overflow-hidden blue-glow">
          <div className="h-2 bg-primary w-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
          <CardHeader className="text-center pt-10 pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-primary rounded-2xl p-4 shadow-xl shadow-primary/30 animate-float">
                <Video className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-headline font-bold text-white tracking-tight">Studio Access</CardTitle>
            <CardDescription className="italic text-muted-foreground">Verify your identity to enter the neural core</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-10">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-2xl p-1 mb-6">
                <TabsTrigger value="email" className="rounded-xl font-bold text-[10px] uppercase py-2.5">Credentials</TabsTrigger>
                <TabsTrigger value="phone" className="rounded-xl font-bold text-[10px] uppercase py-2.5">Mobile Node</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-primary ml-1 text-left block font-bold">Identity Email</Label>
                  <Input type="email" placeholder="creator@studio.tech" className="h-12 rounded-xl bg-black/40 border-white/10 text-white focus:border-primary/50" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-primary ml-1 text-left block font-bold">Secure Access Key</Label>
                  <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-black/40 border-white/10 text-white focus:border-primary/50" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button onClick={handleLogin} className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : "Authorize Entry"}
                </Button>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                {!confirmationResult ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-primary ml-1 text-left block font-bold">Mobile Node Number</Label>
                      <Input type="tel" placeholder="+91 1234567890" className="h-12 rounded-xl bg-black/40 border-white/10 text-white" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <Button onClick={handlePhoneSignIn} className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95" disabled={loading || !phone}>
                      {loading ? <Loader2 className="animate-spin" /> : "Request Identity Token"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-primary ml-1 text-left block font-bold">6-Digit Verification Token</Label>
                      <Input placeholder="123456" className="h-12 rounded-xl bg-black/40 border-white/10 text-center tracking-[0.3em] text-xl font-bold text-white" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
                    </div>
                    <Button onClick={handleVerifyOtp} className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95" disabled={loading || otp.length < 6}>
                      {loading ? <Loader2 className="animate-spin" /> : "Sync Identity"}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-muted-foreground"><span className="bg-[#0a0d14] px-4 tracking-[0.2em]">Social Verification</span></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="h-12 rounded-2xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 p-1 transition-all" onClick={() => handleSocialLogin('google')} disabled={loading}>
                <Chrome className="w-4 h-4 text-red-500" />
                <span className="text-[9px] font-bold">Google</span>
              </Button>
              <Button variant="outline" className="h-12 rounded-2xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 p-1 transition-all" onClick={() => handleSocialLogin('facebook')} disabled={loading}>
                <Facebook className="w-4 h-4 text-blue-600" />
                <span className="text-[9px] font-bold">Facebook</span>
              </Button>
              <Button variant="outline" className="h-12 rounded-2xl gap-2 font-bold border-white/10 bg-black/20 hover:bg-primary/5 p-1 transition-all" onClick={() => handleSocialLogin('github')} disabled={loading}>
                <Github className="w-4 h-4 text-white" />
                <span className="text-[9px] font-bold">GitHub</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-10 pt-4">
            <div className="text-xs text-center text-muted-foreground font-medium italic">
              New to Studio? <Link href="/signup" className="text-primary font-bold hover:underline not-italic">Register Identity</Link>
            </div>
            <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest gap-2 text-muted-foreground hover:text-white" onClick={() => setShowTroubleshoot(!showTroubleshoot)}>
              <HelpCircle className="w-3 h-3" /> Connection Diagnostics
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
