"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
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
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(returnUrl);
    } catch (error: any) {
      setAuthError(error.code);
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: error.code === 'auth/unauthorized-domain' ? "Domain not authorized. Check Diagnostics below." : "Invalid credentials or unauthorized node.",
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
      toast({
        variant: "destructive",
        title: "Social Sync Error",
        description: error.code === 'auth/unauthorized-domain' ? "This domain is not yet authorized in Firebase." : "Configuration block detected.",
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
            {authError === 'auth/unauthorized-domain' && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-2 animate-in slide-in-from-top-2">
                 <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase">
                    <AlertTriangle className="w-4 h-4" /> Domain Authorization Required
                 </div>
                 <p className="text-[11px] text-muted-foreground italic">Your current domain is not yet whitelisted in Firebase Console.</p>
                 <Button variant="link" className="p-0 h-auto text-[10px] text-primary" asChild>
                   <Link href="/AUTH_DOMAIN_FIX.md">Read Fix Guide</Link>
                 </Button>
              </div>
            )}

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
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest gap-2 text-muted-foreground hover:text-white">
                  <HelpCircle className="w-3 h-3" /> Connection Diagnostics
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0a0d14] border-white/10 rounded-[2.5rem] p-10 max-w-md">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-headline font-bold text-white flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-primary" /> Security Diagnostics
                  </DialogTitle>
                  <DialogDescription className="text-sm italic">Owner Setup: Copy these domains and paste them in the box from your screenshot.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {authorizedDomains.map(domain => (
                      <div key={domain} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 group hover:border-primary/30 transition-all">
                        <div className="flex flex-col">
                           <code className="text-[10px] font-mono text-primary truncate">{domain}</code>
                           <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-tight">
                             {domain.includes('tech') ? 'Primary Domain' : 'Testing Domain'}
                           </span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10" onClick={() => copyToClipboard(domain)}>
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-2 pt-2">
                    <Button className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-[10px] font-bold uppercase tracking-widest" asChild>
                      <a href="https://console.firebase.google.com/project/studio-9489287013-59986/authentication/settings" target="_blank">
                        Open Auth Settings <ExternalLink className="ml-2 w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}