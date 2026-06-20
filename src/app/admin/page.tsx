
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, DollarSign, BarChart3, Settings, 
  Loader2, ArrowUpRight, TrendingUp,
  Cpu, Activity, Database, AlertTriangle,
  RefreshCw, Lock, Globe, Eye, Search, CheckCircle2, ShieldCheck,
  UserPlus, ShieldAlert, Coins, Star
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, limit, orderBy, getCountFromServer, doc, updateDoc, increment } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [totalUsersCount, setTotalUsersCount] = useState<number | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchUserCount();
  }, [db]);

  const fetchUserCount = async () => {
    if (!db) return;
    try {
      const coll = collection(db, "users");
      const snapshot = await getCountFromServer(coll);
      setTotalUsersCount(snapshot.data().count);
    } catch (e) {
      console.error("User count fetch failed", e);
    }
  };

  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "users"), limit(50), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: users, loading: usersLoading } = useCollection(usersQuery);

  const handleUpdateUser = async (userId: string, data: any) => {
    setUpdatingUser(userId);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, data);
      toast({ title: "Updated!", description: "User settings updated successfully." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setUpdatingUser(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-32 md:pt-24 bg-[#05070a] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
              <Lock className="w-3 h-3 text-red-500" />
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Master Admin Node</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-white">
              Studio <span className="text-primary">Control</span>
            </h1>
            <p className="text-muted-foreground font-medium italic">Manage users, roles, and credits.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-xl">
             <div className="flex flex-col px-4 border-r border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Users</span>
                <span className="text-2xl font-bold font-headline text-emerald-500">{totalUsersCount ?? "..."}</span>
             </div>
             <ShieldCheck className="w-8 h-8 text-primary opacity-20" />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
           {/* RECENT USERS */}
           <Card className="rounded-[3rem] bg-[#0a0d14] border-white/5 overflow-hidden shadow-2xl">
              <CardHeader className="p-8 border-b border-white/5">
                <CardTitle className="text-xl font-headline font-bold">User Settings Management</CardTitle>
                <CardDescription>Promote users, give credits, or manage plans.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-white/5">
                       <TableRow className="hover:bg-transparent border-white/5">
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest px-8">User Info</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status & Credits</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest">Role</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right px-8">Actions</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {usersLoading ? (
                         <TableRow><TableCell colSpan={4} className="text-center py-20 opacity-40 italic">Syncing database...</TableCell></TableRow>
                       ) : users?.map((u: any) => (
                         <TableRow key={u.id} className="border-white/5 hover:bg-white/5 transition-colors">
                            <TableCell className="px-8 py-6">
                               <div className="flex flex-col">
                                  <span className="font-bold text-white">{u.displayName || 'Creator'}</span>
                                  <span className="text-[10px] text-muted-foreground">{u.email}</span>
                               </div>
                            </TableCell>
                            <TableCell>
                               <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                     <Badge variant={u.isPremium ? 'default' : 'secondary'} className="rounded-full text-[9px] uppercase tracking-widest">
                                        {u.subscriptionPlan?.toUpperCase() || 'FREE'}
                                      </Badge>
                                      <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                                        <Coins className="w-3 h-3" /> {u.credits?.toFixed(0) || 0}
                                      </span>
                                  </div>
                               </div>
                            </TableCell>
                            <TableCell>
                               {u.isAdmin ? (
                                 <Badge className="bg-red-500/20 text-red-500 border-red-500/30 rounded-full text-[9px] uppercase tracking-widest">Admin</Badge>
                               ) : (
                                 <Badge variant="outline" className="text-[9px] uppercase tracking-widest opacity-50">User</Badge>
                               )}
                            </TableCell>
                            <TableCell className="text-right px-8">
                               <div className="flex items-center justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-9 px-3 rounded-xl text-[10px] font-bold uppercase"
                                    onClick={() => handleUpdateUser(u.id, { credits: increment(100) })}
                                    disabled={updatingUser === u.id}
                                  >
                                    +100 Credits
                                  </Button>
                                  <Button 
                                    variant={u.isPremium ? "outline" : "default"} 
                                    size="sm" 
                                    className="h-9 px-3 rounded-xl text-[10px] font-bold uppercase"
                                    onClick={() => handleUpdateUser(u.id, { isPremium: !u.isPremium, subscriptionPlan: u.isPremium ? 'free' : 'pro' })}
                                    disabled={updatingUser === u.id}
                                  >
                                    {u.isPremium ? 'Revoke Pro' : 'Make Pro'}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-9 px-3 rounded-xl text-[10px] font-bold uppercase hover:bg-red-500/10 hover:text-red-500"
                                    onClick={() => handleUpdateUser(u.id, { isAdmin: !u.isAdmin })}
                                    disabled={updatingUser === u.id}
                                  >
                                    {u.isAdmin ? 'Demote' : 'Promote Admin'}
                                  </Button>
                               </div>
                            </TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </div>
      </main>
    </div>
  );
}
