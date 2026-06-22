"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Video, Chrome, ArrowLeft, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { useAuth } from "@/firebase";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
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
        description: "Please check your email and password.",
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
      toast({
        variant: "destructive",
        title: "Google Login Error",
        description: "Could not connect to Google. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#05070a] relative">
      <div className="fixed top-8 left-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-colors group">
          <div className="p-2 bg-white/5 rounded-xl border border-white/5 group-hover:border-primary/50 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md animate-in fade-in duration-500 space-y-6">
        <Card className="border-white/5 bg-[#0a0d14] rounded-[2.5rem] shadow-2xl overflow-hidden border-t-primary/20 border-t-2">
          <CardHeader className="text-center pt-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <Video className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-headline">Studio Login</CardTitle>
            <CardDescription className="italic">Access your professional AI tools</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-xl mb-6">
                <TabsTrigger value="email" className="rounded-lg font-bold">Email</TabsTrigger>
                <TabsTrigger value="phone" className="rounded-lg font-bold">Mobile</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase text-primary ml-1 font-bold tracking-widest">Email Address</Label>
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      required 
                      className="h-12 bg-black/40 border-white/10 rounded-xl focus:border-primary/50" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase text-primary ml-1 font-bold tracking-widest">Password</Label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        required 
                        className="h-12 bg-black/40 border-white/10 pr-12 rounded-xl focus:border-primary/50" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-14 font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/20" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Enter Studio"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                <div className="text-center p-8 opacity-40 italic text-sm border-2 border-dashed border-white/5 rounded-2xl">
                   Mobile OTP system is syncing with the region. Please use the Email tab for now.
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em]"><span className="bg-[#0a0d14] px-4">Social Access</span></div>
            </div>

            <Button variant="outline" className="w-full h-14 gap-3 border-white/10 bg-black/20 font-bold rounded-xl hover:bg-white/5 transition-all" onClick={handleSocialLogin} disabled={loading}>
              <Chrome className="w-4 h-4 text-red-500" /> Continue with Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8 pt-2">
            <div className="text-sm text-center text-muted-foreground">
              New to the Studio? <Link href="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
            </div>
            <div className="flex items-center justify-center gap-2 text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-20">
               <ShieldCheck className="w-3 h-3" /> Secure Handshake Protocol Active
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
