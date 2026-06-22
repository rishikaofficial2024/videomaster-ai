"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Video, Chrome, Facebook, ArrowLeft, Loader2, Eye, EyeOff, ShieldCheck, Github } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(returnUrl);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.code === 'auth/unauthorized-domain' ? "Domain unauthorized. Contact owner." : "Check your email/password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'facebook' | 'github') => {
    try {
      setLoading(true);
      let provider;
      if (providerName === 'google') provider = new GoogleAuthProvider();
      else if (providerName === 'facebook') provider = new FacebookAuthProvider();
      else provider = new GithubAuthProvider();

      await signInWithPopup(auth, provider);
      router.push(returnUrl);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Social Login Error",
        description: "Could not connect to provider.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
      const result = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmationResult(result);
      toast({ title: "OTP Sent" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Mobile Error", description: error.message });
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
      toast({ variant: "destructive", title: "Invalid OTP" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#05070a] relative">
      <div id="recaptcha-container"></div>
      
      <div className="fixed top-8 left-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>

      <div className="w-full max-w-md animate-in fade-in duration-500">
        <Card className="border-white/5 bg-[#0a0d14] rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-primary w-full" />
          <CardHeader className="text-center pt-8">
            <div className="flex justify-center mb-2">
              <Video className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Studio Login</CardTitle>
            <CardDescription>Enter your details to access the AI hub</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-xl mb-6">
                <TabsTrigger value="email" className="rounded-lg">Email</TabsTrigger>
                <TabsTrigger value="phone" className="rounded-lg">Mobile</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase text-primary ml-1">Email</Label>
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      required 
                      className="h-12 bg-black/40 border-white/10" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase text-primary ml-1">Password</Label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        required 
                        className="h-12 bg-black/40 border-white/10 pr-12" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 font-bold" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                {!confirmationResult ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-xs uppercase text-primary ml-1">Phone Number</Label>
                      <Input 
                        type="tel" 
                        placeholder="+91 1234567890" 
                        className="h-12 bg-black/40 border-white/10" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                      />
                    </div>
                    <Button onClick={handlePhoneSignIn} className="w-full h-12 font-bold" disabled={loading || !phone}>
                      {loading ? <Loader2 className="animate-spin" /> : "Send OTP"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-xs uppercase text-primary ml-1">6-Digit OTP</Label>
                      <Input 
                        placeholder="123456" 
                        className="h-12 bg-black/40 border-white/10 text-center tracking-widest text-lg font-bold" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        maxLength={6} 
                      />
                    </div>
                    <Button onClick={handleVerifyOtp} className="w-full h-12 font-bold" disabled={loading || otp.length < 6}>
                      {loading ? <Loader2 className="animate-spin" /> : "Verify & Sign In"}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-muted-foreground"><span className="bg-[#0a0d14] px-4">Social Login</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11 gap-2 border-white/10 bg-black/20" onClick={() => handleSocialLogin('google')} disabled={loading}>
                <Chrome className="w-4 h-4 text-red-500" /> Google
              </Button>
              <Button variant="outline" className="h-11 gap-2 border-white/10 bg-black/20" onClick={() => handleSocialLogin('github')} disabled={loading}>
                <Github className="w-4 h-4" /> GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8 pt-2">
            <div className="text-sm text-center text-muted-foreground">
              New here? <Link href="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
            </div>
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
               <ShieldCheck className="w-3 h-3" /> Secure Node videomaster-ai.tech
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}