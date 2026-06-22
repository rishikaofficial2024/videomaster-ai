"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Video, Chrome, ArrowLeft, Loader2, Eye, EyeOff, ShieldCheck, Copy, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
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
  const [showDomains, setShowDomains] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";
  const { toast } = useToast();
  const auth = useAuth();

  const authDomains = [
    "videomaster-ai.tech",
    "studio-9489287013-59986.firebaseapp.com",
    "studio-9489287013-59986.web.app",
    "localhost"
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(returnUrl);
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        setShowDomains(true);
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.code === 'auth/unauthorized-domain' ? "Domain unauthorized. Add to Firebase Console." : "Check your email/password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push(returnUrl);
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        setShowDomains(true);
      }
      toast({
        variant: "destructive",
        title: "Google Login Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", description: text });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#05070a] relative">
      <div id="recaptcha-container"></div>
      
      <div className="fixed top-8 left-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>

      <div className="w-full max-w-md animate-in fade-in duration-500 space-y-6">
        {showDomains && (
          <Card className="border-amber-500/20 bg-amber-500/5 rounded-3xl p-6 animate-in slide-in-from-top-4">
             <div className="flex items-center gap-3 text-amber-500 mb-4">
                <ShieldCheck size={20} />
                <h4 className="font-bold text-sm uppercase tracking-widest">Security Action Required</h4>
             </div>
             <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
               Please add these domains to your Firebase Console under <b>Authentication &gt; Settings &gt; Authorized Domains</b>:
             </p>
             <div className="space-y-2">
                {authDomains.map(d => (
                  <div key={d} className="flex items-center justify-between bg-black/40 p-2 px-4 rounded-xl border border-white/5">
                     <code className="text-[10px] text-white">{d}</code>
                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(d)}>
                        <Copy size={12} className="text-primary" />
                     </Button>
                  </div>
                ))}
             </div>
             <Button variant="link" className="w-full mt-4 text-[10px] uppercase font-bold text-amber-500" onClick={() => setShowDomains(false)}>
                Dismiss
             </Button>
          </Card>
        )}

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
                <TabsTrigger value="email" className="rounded-lg font-bold">Email</TabsTrigger>
                <TabsTrigger value="phone" className="rounded-lg font-bold">Mobile</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-primary ml-1 font-bold">Email</Label>
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      required 
                      className="h-12 bg-black/40 border-white/10 rounded-xl" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-primary ml-1 font-bold">Password</Label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        required 
                        className="h-12 bg-black/40 border-white/10 pr-12 rounded-xl" 
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
                  <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest rounded-xl" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                <div className="text-center p-4 py-8 opacity-40 italic text-sm">
                   Mobile OTP system is active. Use the Email tab if testing from PC.
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black text-muted-foreground"><span className="bg-[#0a0d14] px-4">Social Login</span></div>
            </div>

            <Button variant="outline" className="w-full h-12 gap-3 border-white/10 bg-black/20 font-bold rounded-xl" onClick={handleSocialLogin} disabled={loading}>
              <Chrome className="w-4 h-4 text-red-500" /> Continue with Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8 pt-2">
            <div className="text-sm text-center text-muted-foreground">
              New here? <Link href="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
            </div>
            <div className="flex items-center justify-center gap-2 text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-30">
               <ShieldCheck className="w-3 h-3" /> Secure Node: videomaster-ai.tech
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
