"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, Coins, ShieldCheck, Lock, Loader2, Banknote, TrendingUp,
  Activity, CheckCircle2, Star, ShieldAlert, MoreVertical, Landmark, PieChart, DollarSign, Globe, Info, ExternalLink, CreditCard
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

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [totalUsersCount, setTotalUsersCount] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [adRevenueEstimate, setAdRevenueEstimate] = useState<number>(0);
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
    } catch (e) {
      console.error("User count fetch failed", e);
    }
  };

  const calculateTotalRevenue = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      let revenue = 0;
      
      usersSnap.forEach((doc) => {
        const data = doc.data();
        revenue += (data.totalSpent || 0);
        if (data.isPremium && data.subscriptionPlan === 'pro') revenue += 99;
        if (data.isPremium && data.subscriptionPlan === 'business') revenue += 499;
      });
      
      setTotalRevenue(revenue);
      setAdRevenueEstimate(revenue * 0.15); 
    } catch (e) {
      console.error("Revenue calculation failed", e);
    }
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
        toast({ title: "Updated!", description: "User settings updated successfully." });
        calculateTotalRevenue(); 
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setUpdatingUser(null);
      });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-32 md:pt-24 bg-[#05070a] hero-gradient">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
              <Lock className="w-3 h-3 text-red-500" />
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Master Admin Node</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-white">
              Revenue <span className="text-primary">Hub</span>
            </h1>
            <p className="text-muted-foreground font-medium italic text-lg opacity-60">Track lifetime earnings, ad metrics, and user growth.</p>
          </div>
          
          <div className="flex items-center gap-8 bg-white/5 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl">
             <div className="flex flex-col px-6 border-r border-white/10 text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Global Users</span>
                <span className="text-4xl font-bold font-headline text-emerald-500">{totalUsersCount ?? "..."}</span>
             </div>
             <ShieldCheck className="w-10 h-10 text-primary animate-pulse" />
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-[3.5rem] bg-[#0a0d14]/80 border-emerald-500/30 p-10 blue-glow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Landmark className="w-24 h-24" />
            </div>
            <div className="space-y-4 relative z-10">
              <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em]">Total Revenue</p>
              <h3 className="text-6xl font-bold font-headline text-white">₹{totalRevenue.toLocaleString()}</h3>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> 
                SECURE WITHDRAWAL READY
              </div>
            </div>
          </Card>

          <Card className="rounded-[3.5rem] bg-[#0a0d14]/80 border-primary/30 p-10 blue-glow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <PieChart className="w-24 h-24" />
            </div>
            <div className="space-y-4 relative z-10">
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Est. Ad Revenue</p>
              <h3 className="text-6xl font-bold font-headline text-white">₹{adRevenueEstimate.toFixed(0)}</h3>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40">
                <Activity className="w-3 h-3 text-primary" /> 
                GOOGLE ADSENSE SYNCED
              </div>
            </div>
          </Card>

          <Card className="rounded-[3.5rem] bg-indigo-500/5 border-indigo-500/20 p-10 blue-glow relative overflow-hidden group flex flex-col justify-center text-center">
             <div className="space-y-6 relative z-10">
               <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl mx-auto flex items-center justify-center border border-indigo-500/20 shadow-xl">
                  <CreditCard className="w-8 h-8 text-indigo-400" />
               </div>
               <div className="space-y-1">
                 <h4 className="text-lg font-bold text-white uppercase tracking-tight">Withdrawal Hub</h4>
                 <p className="text-xs text-muted-foreground italic">Transfer funds to your bank node.</p>
               </div>
               <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 font-black text-[10px] uppercase tracking-[0.3em] h-12 px-8 shadow-xl" asChild>
                 <Link href="/BANK_TRANSFER_GUIDE.md">Payout Portal</Link>
               </Button>
             </div>
          </Card>
        </section>

        <div className="grid grid-cols-1 gap-8">
           <Card className="rounded-[3.5rem] bg-[#0a0d14]/80 backdrop-blur-3xl border-white/5 overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 shimmer opacity-[0.02] pointer-events-none" />
              <CardHeader className="p-10 border-b border-white/5 flex flex-row items-center justify-between relative z-10">
                <div className="space-y-1">
                  <CardTitle className="text-3xl font-headline font-black uppercase tracking-tight">Node Management</CardTitle>
                  <CardDescription className="italic text-muted-foreground">Modify roles, credits, and subscription status of creator nodes.</CardDescription>
                </div>
                <Users className="w-8 h-8 text-muted-foreground opacity-20" />
              </CardHeader>
              <CardContent className="p-0 relative z-10">
                 <Table>
                    <TableHeader className="bg-white/[0.02]">
                       <TableRow className="hover:bg-transparent border-white/5">
                          <TableHead className="text-[11px] font-black uppercase tracking-[0.3em] px-10 py-6">Creator Node</TableHead>
                          <TableHead className="text-[11px] font-black uppercase tracking-[0.3em]">Neural Power</TableHead>
                          <TableHead className="text-[11px] font-black uppercase tracking-[0.3em]">Clearance</TableHead>
                          <TableHead className="text-[11px] font-black uppercase tracking-[0.3em] text-right px-10">Protocols</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {usersLoading ? (
                         <TableRow><TableCell colSpan={4} className="text-center py-40 opacity-40 italic font-medium text-lg">Synchronizing Database Stream...</TableCell></TableRow>
                       ) : users?.map((u: any) => (
                         <TableRow key={u.id} className="border-white/5 hover:bg-white/[0.03] transition-all group">
                            <TableCell className="px-10 py-8">
                               <div className="flex flex-col gap-1">
                                  <span className="font-bold text-white text-lg group-hover:text-primary transition-colors">{u.displayName || 'Anonymous Creator'}</span>
                                  <span className="text-[10px] text-muted-foreground font-mono opacity-50 uppercase tracking-widest">{u.email}</span>
                               </div>
                            </TableCell>
                            <TableCell>
                               <div className="flex items-center gap-4">
                                   <Badge variant={u.isPremium ? 'default' : 'secondary'} className="rounded-full text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 shadow-xl">
                                      {u.subscriptionPlan?.toUpperCase() || 'FREE'}
                                    </Badge>
                                    <div className="flex items-center gap-2 text-sm font-bold text-primary">
                                      <Coins className="w-4 h-4" /> {u.credits?.toFixed(0) || 0}
                                    </div>
                               </div>
                            </TableCell>
                            <TableCell>
                               {u.isAdmin ? (
                                 <Badge className="bg-red-500/20 text-red-500 border-red-500/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5">Master Admin</Badge>
                               ) : (
                                 <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 opacity-30">Standard Node</Badge>
                               )}
                            </TableCell>
                            <TableCell className="text-right px-10">
                               <div className="flex items-center justify-end gap-4">
                                  {updatingUser === u.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                  ) : (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 bg-white/5 hover:bg-primary/20 transition-all border border-transparent hover:border-primary/30">
                                          <MoreVertical className="w-5 h-5" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="bg-[#0a0d14] border-white/10 rounded-[2rem] w-64 p-3 shadow-2xl">
                                        <DropdownMenuItem className="rounded-xl font-bold text-[11px] uppercase tracking-widest p-4 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => handleUpdateUser(u.id, { credits: increment(1000) })}>
                                          Inject +1000 Credits
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-xl font-bold text-[11px] uppercase tracking-widest p-4 cursor-pointer hover:bg-emerald-500/10 transition-colors" onClick={() => handleUpdateUser(u.id, { isPremium: true, subscriptionPlan: 'pro', totalSpent: increment(99) })}>
                                          Authorize Pro Status
                                        </DropdownMenuItem>
                                        <div className="h-px bg-white/5 my-2" />
                                        <DropdownMenuItem className="rounded-xl font-bold text-[11px] uppercase tracking-widest p-4 cursor-pointer text-red-500 hover:bg-red-500/10 transition-colors" onClick={() => handleUpdateUser(u.id, { isAdmin: !u.isAdmin })}>
                                          {u.isAdmin ? 'Revoke Admin Node' : 'Grant Admin Node'}
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
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
