"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Chrome, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const displayName = `${firstName} ${lastName}`;

      await updateProfile(user, { displayName });

      const userRef = doc(db, "users", user.uid);
      const userData = {
        email: user.email,
        displayName: displayName,
        isPremium: false,
        isAdmin: false,
        subscriptionPlan: "free",
        credits: 100,
        createdAt: new Date().toISOString(),
        usageStats: { totalVideos: 0, aiGenerations: 0 }
      };

      setDoc(userRef, userData).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: userData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Registration Failed", 
        description: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userData = {
        email: user.email,
        displayName: user.displayName,
        isPremium: false,
        isAdmin: false,
        subscriptionPlan: "free",
        credits: 100,
        createdAt: new Date().toISOString(),
        usageStats: { totalVideos: 0, aiGenerations: 0 }
      };

      setDoc(userRef, userData, { merge: true }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'write',
          requestResourceData: userData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Google Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#05070a] relative">
      <div className="fixed top-8 left-8">
        <Link href="/login" className="flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </div>

      <div className="w-full max-w-md animate-in fade-in duration-500">
        <Card className="border-white/5 bg-[#0a0d14] rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-primary w-full" />
          <CardHeader className="text-center pt-8">
            <div className="flex justify-center mb-2">
              <Video className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Join Studio</CardTitle>
            <CardDescription>Get 100 FREE AI Credits instantly</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-primary ml-1">First Name</Label>
                  <Input placeholder="John" required className="h-12 bg-black/40 border-white/10" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-primary ml-1">Last Name</Label>
                  <Input placeholder="Doe" required className="h-12 bg-black/40 border-white/10" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-primary ml-1">Email</Label>
                <Input type="email" placeholder="john@example.com" required className="h-12 bg-black/40 border-white/10" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-primary ml-1">Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Min. 8 characters" 
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
                {loading ? <Loader2 className="animate-spin" /> : "Start Free Journey"}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-muted-foreground"><span className="bg-[#0a0d14] px-4">Or sign up with</span></div>
            </div>

            <Button variant="outline" className="w-full h-12 gap-2 border-white/10 bg-black/20" onClick={handleSocialSignup} disabled={loading}>
              <Chrome className="w-4 h-4 text-red-500" /> Sign up with Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8 pt-2">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}