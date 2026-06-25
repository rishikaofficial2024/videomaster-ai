"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Users, Search, MoreVertical, Zap, 
  Crown, ShieldAlert, Coins, RefreshCw, 
  UserPlus, UserMinus, ShieldCheck, Mail,
  ExternalLink, Loader2
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, limit, orderBy, doc, updateDoc, increment, deleteDoc, getDocs, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

export default function AdminUserManagement() {
  const db = useFirestore();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingUser] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "users"), limit(100), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: users, loading: usersLoading } = useCollection(usersQuery);

  const filteredUsers = users?.filter(u => {
    const matchesSearch = u.displayName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ? true : filter === 'premium' ? u.isPremium : filter === 'admin' ? u.isAdmin : true;
    return matchesSearch && matchesFilter;
  });

  const handleUpdate = async (userId: string, data: any, label: string) => {
    setUpdatingUser(userId);
    const userRef = doc(db, "users", userId);
    
    updateDoc(userRef, data)
      .then(() => {
        toast({ title: "Identity Node Synced", description: `${label} protocol initiated successfully.` });
      })
      .catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: data,
        } satisfies SecurityRuleContext));
      })
      .finally(() => setUpdatingUser(null));
  };

  return (
    <main className="p-12 space-y-16 max-w-[100rem] mx-auto">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
            <Users size={14} /> REGISTRY INFRASTRUCTURE
          </div>
          <div className="space-y-2">
            <h1 className="text-7xl md:text-9xl font-headline font-black tracking-tighter text-white uppercase leading-none">Creator <span className="text-primary italic">Nodes.</span></h1>
            <p className="text-muted-foreground text-2xl font-medium italic opacity-60">Master oversight of all creative identities across the neural network.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-[400px]">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
             <Input 
               placeholder="Search Identity ID or Email..." 
               className="h-16 pl-16 pr-8 bg-white/[0.03] border-white/10 rounded-full text-lg focus:border-primary/50 transition-all font-medium shadow-inner"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
          <div className="flex gap-4">
             {['all', 'premium', 'admin'].map((f) => (
               <button 
                 key={f} 
                 onClick={() => setFilter(f)}
                 className={cn(
                   "px-8 h-16 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95",
                   filter === f ? "bg-primary text-black border-primary shadow-glow" : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                 )}
               >
                 {f.toUpperCase()}
               </button>
             ))}
          </div>
        </div>
      </header>

      <Card className="rounded-[5rem] glass-panel border-white/5 overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.8)]">
        <CardHeader className="p-16 border-b border-white/10 flex flex-row items-center justify-between bg-white/[0.02]">
           <div className="space-y-4">
              <CardTitle className="text-5xl font-headline font-black uppercase tracking-tight text-white">Institutional Registry</CardTitle>
              <CardDescription className="italic text-xl text-muted-foreground opacity-60">Verified creative nodes currently connected to the global production CDN.</CardDescription>
           </div>
           <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 shadow-2xl flex items-center gap-6">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Total Nodes</span>
                <span className="text-3xl font-bold font-headline text-primary">{filteredUsers?.length || 0}</span>
              </div>
              <Users className="w-10 h-10 text-primary/40" />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/[0.03]">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-[12px] font-black uppercase tracking-[0.5em] px-16 py-10 text-primary">Identity Terminal</TableHead>
                <TableHead className="text-[12px] font-black uppercase tracking-[0.5em] text-accent">Clearance Level</TableHead>
                <TableHead className="text-[12px] font-black uppercase tracking-[0.5em] text-secondary">Neural Reserves</TableHead>
                <TableHead className="text-right px-16 text-[12px] font-black uppercase tracking-[0.5em] text-white">Protocols</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-60 animate-pulse italic text-3xl font-black tracking-widest text-primary opacity-20 uppercase">SYNCHRONIZING WITH DATABASE...</TableCell></TableRow>
              ) : filteredUsers?.map((u: any) => (
                <TableRow key={u.id} className="border-white/5 hover:bg-white/[0.04] transition-all group">
                  <TableCell className="px-16 py-12">
                     <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center text-4xl font-headline font-black text-primary/20 group-hover:text-primary/100 transition-all duration-700">
                           {u.displayName?.charAt(0) || 'G'}
                        </div>
                        <div className="flex flex-col gap-2">
                           <span className="text-3xl font-black text-white group-hover:text-primary transition-colors tracking-tighter uppercase">{u.displayName || 'Guest Creator'}</span>
                           <span className="text-[10px] text-muted-foreground font-mono opacity-40 uppercase tracking-[0.4em] flex items-center gap-2">
                              <Mail size={10} /> {u.email}
                           </span>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell>
                     <Badge className={cn(
                       "rounded-full text-[11px] font-black uppercase tracking-[0.4em] px-8 py-3 shadow-2xl",
                       u.isAdmin ? 'bg-indigo-500 text-white' : u.isPremium ? 'bg-primary text-black' : 'bg-white/5 text-muted-foreground border-white/5'
                     )}>
                        {u.isAdmin ? 'MASTER' : u.subscriptionPlan?.toUpperCase() || 'STARTER'}
                     </Badge>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-4 text-2xl font-black text-primary font-headline">
                        <Coins className="w-6 h-6 text-primary/40" /> {u.credits?.toLocaleString() || 0}
                     </div>
                  </TableCell>
                  <TableCell className="text-right px-16">
                     {updatingId === u.id ? (
                        <Loader2 className="w-8 h-8 animate-spin text-primary ml-auto" />
                     ) : (
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-2xl h-16 w-16 glass-panel border-white/10 hover:bg-primary/20 transition-all shadow-xl group">
                                 <MoreVertical className="w-8 h-8 group-hover:text-primary transition-colors" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="bg-[#0a061c] border-white/10 rounded-[3rem] w-96 p-8 shadow-[0_50px_100px_rgba(0,0,0,0.9)] mt-4">
                              <div className="p-4 mb-6 border-b border-white/5">
                                 <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Protocol Selection</span>
                              </div>
                              <DropdownMenuItem className="rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest p-6 hover:bg-primary/10 cursor-pointer transition-all mb-4" onClick={() => handleUpdate(u.id, { credits: increment(100000) }, "Credit Injection")}>
                                 <Zap className="w-5 h-5 mr-4 text-primary" /> Inject +100K Credits
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest p-6 hover:bg-emerald-500/10 cursor-pointer transition-all mb-4" onClick={() => handleUpdate(u.id, { isPremium: true, subscriptionPlan: 'pro', totalSpent: increment(99) }, "Pro Authorization")}>
                                 <Crown className="w-5 h-5 mr-4 text-emerald-500" /> Authorize Elite Access
                              </DropdownMenuItem>
                              <div className="h-px bg-white/5 my-6" />
                              <DropdownMenuItem className="rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest p-6 text-red-500 hover:bg-red-500/10 cursor-pointer transition-all" onClick={() => handleUpdate(u.id, { isAdmin: !u.isAdmin }, "Master Clearance")}>
                                 <ShieldAlert className="w-5 h-5 mr-4" /> {u.isAdmin ? 'Revoke Master Clearance' : 'Grant Master Clearance'}
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!filteredUsers?.length && !usersLoading && (
            <div className="py-60 text-center space-y-8">
               <UserMinus className="w-32 h-32 mx-auto text-muted-foreground opacity-10" />
               <div className="space-y-2">
                  <h4 className="text-4xl font-black font-headline text-white/20 uppercase tracking-tight">Node Registry Empty</h4>
                  <p className="text-muted-foreground italic text-lg opacity-40">No identity matches found in the current sector.</p>
               </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
