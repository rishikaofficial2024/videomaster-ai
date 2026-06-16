
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Chrome, ArrowLeft, Sparkles, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuth } from "@/firebase";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background hero-gradient">
      <div className="fixed top-8 left-8 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-colors group">
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back Home
        </Link>
        <Link href="/test-connection" className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-200 text-yellow-700 text-xs font-bold hover:bg-yellow-100 transition-all">
          <AlertTriangle className="w-3 h-3" /> System Status
        </Link>
      </div>

      <Card className="w-full max-w-md border-white bg-white/80 backdrop-blur-xl shadow-2xl rounded-[3rem] overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-1000 blue-glow">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="space-y-2 text-center pt-12 pb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-primary rounded-[1.5rem] p-4 shadow-2xl shadow-primary/40 transition-transform hover:scale-110">
              <Video className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-headline font-bold tracking-tighter">Welcome back</CardTitle>
          <CardDescription className="text-base font-medium text-muted-foreground">
            Continue your cinematic journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest text-primary ml-1">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                className="h-14 rounded-2xl bg-white border-white shadow-sm focus:ring-4 focus:ring-primary/10 transition-all text-lg" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-bold text-xs uppercase tracking-widest text-primary ml-1">Security Key</Label>
                <Link href="#" className="text-xs text-primary font-bold hover:underline">Reset?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                className="h-14 rounded-2xl bg-white border-white shadow-sm focus:ring-4 focus:ring-primary/10 transition-all text-lg" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-16 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/30 transition-all active:scale-95" disabled={loading}>
              {loading ? "Authenticating..." : "Enter Studio"}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-white/10 px-4 text-muted-foreground backdrop-blur-md rounded-full">Or Connect Via</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full h-16 rounded-2xl gap-4 font-bold border-white bg-white hover:bg-muted/30 transition-all shadow-sm" onClick={handleGoogleLogin}>
            <Chrome className="w-6 h-6 text-red-500" />
            Google Workspace
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-6 pb-12 pt-4">
          <div className="text-sm text-center text-muted-foreground font-medium">
            New to the studio?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Create Account
            </Link>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Powered by Gemini AI</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
