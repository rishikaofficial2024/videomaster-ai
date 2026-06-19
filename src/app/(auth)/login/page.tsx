
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Chrome, Facebook, Smartphone, ArrowLeft, Sparkles, Loader2, AlertTriangle } from "lucide-react";
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
        description = "⚠️ Ye domain Authorized nahi hai! Firebase Console > Auth > Settings > Authorized Domains mein jaakar apna current URL add karein. Instructions ke liye 'AUTH_DOMAIN_FIX.md' padhein.";
      }
      
      toast({
        variant: "destructive",
        title: `${providerName} Login Failed`,
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

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background hero-gradient">
      <div id="recaptcha-container"></div>
      
      <div className="fixed top-8 left-8 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-colors group">
          <div className="p-2 bg-background rounded-xl shadow-sm group-hover:shadow-md transition-all border">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back Home
        </Link>
      </div>

      <Card className="w-full max-w-md border-primary/10 bg-background/80 backdrop-blur-xl shadow-2xl rounded-[3rem] overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-1000 blue-glow">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="space-y-2 text-center pt-8 pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-[1.2rem] p-3 shadow-xl shadow-primary/20">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold tracking-tighter">Enter Studio</CardTitle>
          <CardDescription className="text-sm font-medium text-muted-foreground">
            Continue your cinematic journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-10">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-xl p-1 mb-6">
              <TabsTrigger value="email" className="rounded-lg font-bold text-[10px] uppercase tracking-widest">Email Access</TabsTrigger>
              <TabsTrigger value="phone" className="rounded-lg font-bold text-[10px] uppercase tracking-widest">Mobile OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    required 
                    className="h-12 rounded-xl bg-background border-primary/10" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Security Key</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    className="h-12 rounded-xl bg-background border-primary/10" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full h-14 text-base font-bold rounded-xl shadow-xl shadow-primary/20" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4">
              {!confirmationResult ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Mobile Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      className="h-12 rounded-xl bg-background border-primary/10" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <Button onClick={handlePhoneSignIn} className="w-full h-14 text-base font-bold rounded-xl shadow-xl shadow-primary/20" disabled={loading || !phone}>
                    {loading ? <Loader2 className="animate-spin" /> : "Send OTP Verification"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Enter 6-Digit OTP</Label>
                    <Input 
                      id="otp" 
                      placeholder="123456" 
                      className="h-12 rounded-xl bg-background border-primary/10 text-center tracking-[0.5em] text-lg font-bold" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <Button onClick={handleVerifyOtp} className="w-full h-14 text-base font-bold rounded-xl shadow-xl shadow-primary/20" disabled={loading || otp.length < 6}>
                    {loading ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary/10" />
            </div>
            <div className="relative flex justify-center text-[8px] uppercase font-bold tracking-[0.3em]">
              <span className="bg-background px-4 text-muted-foreground">Social Connect</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-14 rounded-xl gap-2 font-bold border-primary/10 bg-background hover:bg-primary/5 transition-all shadow-sm" onClick={() => handleSocialLogin('google')} disabled={loading}>
              <Chrome className="w-4 h-4 text-red-500" />
              Google
            </Button>
            <Button variant="outline" className="h-14 rounded-xl gap-2 font-bold border-primary/10 bg-background hover:bg-primary/5 transition-all shadow-sm" onClick={() => handleSocialLogin('facebook')} disabled={loading}>
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pb-10 pt-4">
          <div className="text-xs text-center text-muted-foreground font-medium">
            New to the studio?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Create Account
            </Link>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[8px] font-bold text-primary uppercase tracking-[0.2em]">Secure AI Access</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
