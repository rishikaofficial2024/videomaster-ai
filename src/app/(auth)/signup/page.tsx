
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Chrome, Facebook, Smartphone, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
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
      const profileData = {
        email: user.email,
        displayName: displayName,
        isPremium: false,
        isAdmin: false,
        subscriptionPlan: "free",
        credits: 100,
        photoURL: "",
        createdAt: new Date().toISOString(),
        usageStats: {
          totalVideos: 0,
          aiGenerations: 0
        }
      };

      setDoc(userRef, profileData)
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: profileData
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
        });

      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (providerName: 'google' | 'facebook') => {
    try {
      setLoading(true);
      const provider = providerName === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const profileData = {
        email: user.email,
        displayName: user.displayName,
        isPremium: false,
        isAdmin: false,
        subscriptionPlan: "free",
        credits: 100,
        photoURL: user.photoURL || "",
        createdAt: new Date().toISOString(),
        usageStats: {
          totalVideos: 0,
          aiGenerations: 0
        }
      };

      setDoc(userRef, profileData, { merge: true })
        .catch(async () => {});

      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Social Signup Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background hero-gradient">
      <Card className="w-full max-w-md border-primary/10 shadow-2xl bg-card/50 backdrop-blur-xl rounded-[3rem] overflow-hidden blue-glow">
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-2xl p-3 shadow-lg shadow-primary/30">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold tracking-tighter">Join Studio</CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-medium">
            Get 100 Free AI Credits upon joining
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-8 pb-6">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  required 
                  className="h-11 rounded-xl bg-background border-primary/10" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  required 
                  className="h-11 rounded-xl bg-background border-primary/10" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                required 
                className="h-11 rounded-xl bg-background border-primary/10" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="h-11 rounded-xl bg-background border-primary/10" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-14 text-base font-bold rounded-xl shadow-xl shadow-primary/20" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Start Free Journey"}
            </Button>
          </form>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary/10" />
            </div>
            <div className="relative flex justify-center text-[8px] uppercase font-bold tracking-widest">
              <span className="bg-background px-4 text-muted-foreground">Quick Signup</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 rounded-xl gap-2 font-bold border-primary/10 bg-background hover:bg-primary/5 transition-all shadow-sm" onClick={() => handleSocialSignup('google')} disabled={loading}>
              <Chrome className="w-4 h-4 text-red-500" />
              Google
            </Button>
            <Button variant="outline" className="h-12 rounded-xl gap-2 font-bold border-primary/10 bg-background hover:bg-primary/5 transition-all shadow-sm" onClick={() => handleSocialSignup('facebook')} disabled={loading}>
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
            </Button>
          </div>
        </CardContent>
        <CardFooter className="pb-8 pt-0">
          <div className="text-xs text-center w-full text-muted-foreground font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
