
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Chrome } from "lucide-react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

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

      // Create user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: displayName,
        isPremium: false,
        credits: 100, // Updated from 10 to 100 as requested
        photoURL: "",
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background hero-gradient">
      <Card className="w-full max-w-md border-primary/10 shadow-2xl bg-card/50 backdrop-blur-xl rounded-[3rem] overflow-hidden blue-glow">
        <CardHeader className="space-y-1 text-center pt-10">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-2xl p-3 shadow-lg shadow-primary/30">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-headline font-bold tracking-tighter">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Join VideoMaster AI and start creating today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-8 pb-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-bold text-[10px] uppercase tracking-widest text-primary ml-1">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  required 
                  className="h-12 rounded-xl bg-background border-primary/10 shadow-sm focus:ring-4 focus:ring-primary/10 transition-all" 
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
                  className="h-12 rounded-xl bg-background border-primary/10 shadow-sm focus:ring-4 focus:ring-primary/10 transition-all" 
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
                className="h-12 rounded-xl bg-background border-primary/10 shadow-sm focus:ring-4 focus:ring-primary/10 transition-all" 
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
                className="h-12 rounded-xl bg-background border-primary/10 shadow-sm focus:ring-4 focus:ring-primary/10 transition-all" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95 mt-4" disabled={loading}>
              {loading ? "Creating account..." : "Start Free Journey"}
            </Button>
          </form>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-background px-4 text-muted-foreground">Or connect with</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full h-14 rounded-xl gap-3 font-bold border-primary/10 bg-background hover:bg-primary/5 transition-all shadow-sm">
            <Chrome className="w-5 h-5 text-red-500" />
            Google Workspace
          </Button>
        </CardContent>
        <CardFooter className="pb-10 pt-0">
          <div className="text-sm text-center w-full text-muted-foreground font-medium">
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
