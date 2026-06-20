
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Chrome, Facebook, Smartphone, ArrowLeft, Sparkles, Loader2, AlertTriangle, Info, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
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
  
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'facebook') => {
    try {
      setLoading(true);
      const provider = providerName === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Auth Error:", error.code, error.message);
      
      let description = error.message;
      if (error.code === 'auth/unauthorized-domain') {
        description = "⚠️ Ye domain Authorized nahi hai! Firebase Console > Auth > Settings > Authorized Domains mein jaakar apna current URL add karein.";
      } else if (error.code === 'auth/operation-not-allowed') {
        description = `⚠️ ${providerName} login enabled nahi hai! Firebase Console mein ise Enable karein.`;
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
        description = "⚠️ Phone Login disabled hai! [Action]: Firebase Console > Authentication > Sign-in Method mein jaakar 'Phone' ko Enable karein.";
      }
      
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
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex flex-col gap-3">
                    <div className="flex gap-3">
                      <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-[10px] font-medium text-muted-foreground leading-relaxed italic">
                        Firebase Console mein Phone Auth on karna zaroori hai.
                      </p>
                    </div>
                    <Button variant="link" className="h-auto p-0 text-[10px] text-primary font-bold justify-start gap-1" asChild>
                      <a href="https://console.firebase.google.com/project/studio-9489287013-59986/authentication/providers" target="_blank" rel="noopener noreferrer">
                        Direct Link to Enable <ExternalLink className="w-2 h-2" />
                      </a>
                    </Button>
                  </div>
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
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-16 rounded-2xl gap-3 font-bold border-white/10 bg-black/20 hover:bg-primary/5 transition-all shadow-sm group" onClick={() => handleSocialLogin('google')} disabled={loading}>
              <Chrome className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
              Google
            </Button>
            <Button variant="outline" className="h-16 rounded-2xl gap-3 font-bold border-white/10 bg-black/20 hover:bg-primary/5 transition-all shadow-sm group" onClick={() => handleSocialLogin('facebook')} disabled={loading}>
              <Facebook className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              Facebook
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
