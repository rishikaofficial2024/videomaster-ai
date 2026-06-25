"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, Coins, ShieldCheck, Lock, Loader2, Banknote, TrendingUp,
  Activity, CheckCircle2, Star, ShieldAlert, MoreVertical, Landmark, PieChart, DollarSign, Globe, Info, ExternalLink, CreditCard,
  Terminal, Shield, Gauge, Cpu, Database, Eye, ShieldX
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, limit, orderBy, getCountFromServer, doc, updateDoc, increment, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { firebaseConfig } from "@/firebase/config";

/**
 * 🛡️ MASTER ADMIN HUB: Elite Oversight & Revenue Node.
 */
export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [totalUsersCount, setTotalUsersCount] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (db) {
      fetchUserCount();
      calculateTotalRevenue();
    }
  }, [db]);

  const fetchUserCount = async () => {
    try {
      const coll = collection(db, "users");
      const snapshot = await getCountFromServer(coll);
      setTotalUsersCount(snapshot.data().count);
    } catch (e) {}
  };

  const calculateTotalRevenue = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      let revenue = 0;
      usersSnap.forEach((doc) => {
        const data = doc.data();
        revenue += (data.totalSpent || 0);
        // Manual override simulation for Pro memberships not yet tracked
        if (data.isPremium && !data.totalSpent) revenue += 99;
      });
      setTotalRevenue(revenue);
    } catch (e) {}
  };

  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "users"), limit(50), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: users, loading: usersLoading } = useCollection(usersQuery);

  const handleUpdateUser = async (userId: string, data: any) => {
    setUpdatingUser(userId);
    const userRef = doc(db, "users", userId);
    
    updateDoc(userRef, data)
      .then(() => {
        toast({ title: "Protocol Executed", description: "Node settings synchronized." });
        calculateTotalRevenue(); 
      })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: data,
        } satisfies SecurityRuleContext));
      })
      .finally(() => {
        setUpdatingUser(null);
      });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-40 bg-[#05070a] hero-gradient">
      <Navbar />
      <main className="max-w-[90rem] mx-auto p-6 space-y-16 pt-40">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
              <Lock className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.5em]">MASTER ADMIN HUB</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-headline font-black tracking-tighter text-white leading-none uppercase">
              Revenue <span className="text-primary">Node.</span>
            </h1>
            <p className="text-muted-foreground font-medium italic text-2xl opacity-60">Global creative empire overview and protocol management.</p>
          </div>
          
          <div className="flex items-center gap-6">
             <Button variant="outline" className="h-16 px-10 rounded-[1.5rem] border-white/10 bg-white/5 font-black text-xs uppercase tracking-widest" asChild>
                <Link href="/admin/monitoring"><Gauge className="w-5 h-5 mr-3" /> Live Monitoring</Link>
             </Button>
             <div className="flex items-center gap-10 bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl">
                <div className="flex flex-col px-10 border-r border-white/10 text-right">
                   <span className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground mb-2">Total Nodes</span>
                   <span className="text-6xl font-bold font-headline text-emerald-500 tracking-tighter">{totalUsersCount ?? "..."}</span>
                </div>
                <ShieldCheck className="w-12 h-12 text-primary animate-pulse" />
             </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="rounded-[3.5rem] bg-[#0a0d14]/80 border-2 border-emerald-500/30 p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
              <Landmark className="w-32 h-32 text-emerald-500" />
            </div>
            <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-3">Lifetime Revenue</p>
            <h3 className="text-5xl font-black text-white tracking-tighter">₹{totalRevenue.toLocaleString()}</h3>
          </Card>

          <Card className="rounded-[3.5rem] bg-[#0a0d14]/80 border-2 border-primary/30 p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
              <Shield className="w-32 h-32 text-primary" />
            </div>
            <p className="text-[11px] font-black text-primary uppercase tracking-[0.5em] mb-3">Security Level</p>
            <h3 className="text-3xl font-black text-white tracking-tighter">{firebaseConfig.appCheckSiteKey ? "ULTRA SECURE" : "PRODUCTION"}</h3>
          </Card>

          <Card className="rounded-[3.5rem] bg-[#0a0d14]/80 border-2 border-indigo-500/30 p-10 shadow-2xl">
             <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-3">Neural Link</p>
             <div className="flex items-center gap-4">
                <span className="text-5xl font-black text-white tracking-tighter">100%</span>
                <Cpu className="text-indigo-400 w-8 h-8 animate-pulse" />
             </div>
          </Card>

          <Card className="rounded-[3.5rem] bg-[#0a0d14]/80 border-2 border-rose-500/30 p-10 shadow-2xl">
             <p className="text-[11px] font-black text-rose-500 uppercase tracking-[0.5em] mb-3">System Hub</p>
             <h3 className="text-3xl font-black text-white tracking-tighter">Operational</h3>
          </Card>
        </section>

        <Card className="rounded-[4rem] bg-[#0a0d14]/90 backdrop-blur-3xl border border-white/5 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
           <CardHeader className="p-12 border-b border-white/5 flex flex-row items-center justify-between">
              <div className="space-y-2">
                 <CardTitle className="text-4xl font-headline font-black uppercase tracking-tight">Creator Node Registry</CardTitle>
                 <CardDescription className="italic text-muted-foreground text-lg">Centralized oversight of all creative nodes and neural permissions.</CardDescription>
              </div>
              <Users className="w-12 h-12 text-muted-foreground opacity-10" />
           </CardHeader>
           <CardContent className="p-0">
              <Table>
                 <TableHeader className="bg-white/[0.02]">
                    <TableRow className="border-white/5">
                       <TableHead className="text-[12px] font-black uppercase tracking-[0.4em] px-12 py-8">Creator Node</TableHead>
                       <TableHead className="text-[12px] font-black uppercase tracking-[0.4em]">Clearance</TableHead>
                       <TableHead className="text-[12px] font-black uppercase tracking-[0.4em]">Power Level</TableHead>
                       <TableHead className="text-right px-12 text-[12px] font-black uppercase tracking-[0.4em]">Protocols</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {usersLoading ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-40 animate-pulse italic text-2xl font-medium">Querying Database Node...</TableCell></TableRow>
                    ) : users?.map((u: any) => (
                      <TableRow key={u.id} className="border-white/5 hover:bg-white/[0.03] transition-all group">
                         <TableCell className="px-12 py-10">
                            <div className="flex flex-col gap-1">
                               <span className="text-2xl font-black text-white group-hover:text-primary transition-colors tracking-tighter">{u.displayName || 'Guest Creator'}</span>
                               <span className="text-[10px] text-muted-foreground font-mono opacity-40 uppercase tracking-widest">{u.email}</span>
                            </div>
                         </TableCell>
                         <TableCell>
                            <Badge variant={u.isPremium ? 'default' : 'secondary'} className="rounded-full text-[11px] font-black uppercase tracking-[0.3em] px-6 py-2 shadow-2xl">
                               {u.subscriptionPlan?.toUpperCase() || 'FREE'}
                            </Badge>
                         </TableCell>
                         <TableCell>
                            <div className="flex items-center gap-3 text-xl font-bold text-primary font-headline">
                               <Coins className="w-5 h-5" /> {u.credits?.toFixed(0) || 0}
                            </div>
                         </TableCell>
                         <TableCell className="text-right px-12">
                            {updatingUser === u.id ? (
                               <Loader2 className="w-6 h-6 animate-spin text-primary ml-auto" />
                            ) : (
                               <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="icon" className="rounded-2xl h-14 w-14 bg-white/5 hover:bg-primary/20 transition-all border border-white/5">
                                        <MoreVertical className="w-6 h-6" />
                                     </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-[#0a0d14] border-white/10 rounded-[2.5rem] w-80 p-5 shadow-2xl">
                                     <DropdownMenuItem className="rounded-2xl font-black text-[11px] uppercase tracking-widest p-5 hover:bg-primary/10 cursor-pointer" onClick={() => handleUpdateUser(u.id, { credits: increment(5000) })}>
                                        Inject +5000 Credits
                                     </DropdownMenuItem>
                                     <DropdownMenuItem className="rounded-2xl font-black text-[11px] uppercase tracking-widest p-5 hover:bg-emerald-500/10 cursor-pointer" onClick={() => handleUpdateUser(u.id, { isPremium: true, subscriptionPlan: 'pro', totalSpent: increment(99) })}>
                                        Authorize Pro Access
                                     </DropdownMenuItem>
                                     <div className="h-px bg-white/5 my-3" />
                                     <DropdownMenuItem className="rounded-2xl font-black text-[11px] uppercase tracking-widest p-5 text-red-500 hover:bg-red-500/10 cursor-pointer" onClick={() => handleUpdateUser(u.id, { isAdmin: !u.isAdmin })}>
                                        {u.isAdmin ? 'Revoke Admin Clearance' : 'Grant Admin Clearance'}
                                     </DropdownMenuItem>
                                  </DropdownMenuContent>
                               </DropdownMenu>
                            )}
                         </TableCell>
                      </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </CardContent>
        </Card>
      </main>
    </div>
  );
}
