
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, Coins, ShieldCheck, Lock, Loader2, ArrowUpRight, TrendingUp,
  Activity, CheckCircle2, Star, ShieldAlert, MoreVertical
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, limit, orderBy, getCountFromServer, doc, updateDoc, increment } from "firebase/firestore";
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
            <p className="text-muted-foreground font-medium italic">Manage studio users, roles, and AI resources.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-xl">
             <div className="flex flex-col px-4 border-r border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Network Users</span>
                <span className="text-2xl font-bold font-headline text-emerald-500">{totalUsersCount ?? "..."}</span>
             </div>
             <ShieldCheck className="w-8 h-8 text-primary opacity-20" />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
           <Card className="rounded-[3rem] bg-[#0a0d14] border-white/5 overflow-hidden shadow-2xl">
              <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-headline font-bold">User Management</CardTitle>
                  <CardDescription>Directly modify roles, credits, and subscription status.</CardDescription>
                </div>
                <Users className="w-6 h-6 text-muted-foreground opacity-20" />
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-white/5">
                       <TableRow className="hover:bg-transparent border-white/5">
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest px-8">User</TableHead>
                          <TableHead className="text-[10px] font-bold uppercase tracking-widest">Credits & Plan</TableHead>
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
                                  <span className="font-bold text-white">{u.displayName || 'Unknown Creator'}</span>
                                  <span className="text-[10px] text-muted-foreground">{u.email}</span>
                               </div>
                            </TableCell>
                            <TableCell>
                               <div className="flex items-center gap-3">
                                   <Badge variant={u.isPremium ? 'default' : 'secondary'} className="rounded-full text-[9px] uppercase tracking-widest px-3">
                                      {u.subscriptionPlan?.toUpperCase() || 'FREE'}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                                      <Coins className="w-3 h-3" /> {u.credits?.toFixed(0) || 0}
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
                                  {updatingUser === u.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                  ) : (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                                          <MoreVertical className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="bg-[#0a0d14] border-white/10 rounded-2xl w-56 p-2">
                                        <DropdownMenuItem className="rounded-xl font-bold text-xs p-3 cursor-pointer" onClick={() => handleUpdateUser(u.id, { credits: increment(500) })}>
                                          Grant +500 Credits
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-xl font-bold text-xs p-3 cursor-pointer" onClick={() => handleUpdateUser(u.id, { isPremium: !u.isPremium, subscriptionPlan: u.isPremium ? 'free' : 'pro' })}>
                                          {u.isPremium ? 'Downgrade to Free' : 'Promote to Pro'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-xl font-bold text-xs p-3 cursor-pointer text-red-500" onClick={() => handleUpdateUser(u.id, { isAdmin: !u.isAdmin })}>
                                          {u.isAdmin ? 'Revoke Admin Role' : 'Grant Admin Role'}
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
