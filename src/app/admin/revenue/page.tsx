
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Banknote, TrendingUp, BarChart3, 
  DollarSign, PieChart, Landmark, 
  RefreshCw, Globe, ArrowUpRight, ArrowDownRight,
  ShieldCheck, Activity, Target, Zap
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { cn } from "@/lib/utils";

const mockRevenue = [
  { name: 'AdSense', val: 4200, color: '#D4AF37' },
  { name: 'Pro Subs', val: 8900, color: '#6366f1' },
  { name: 'Agency', val: 3400, color: '#10b981' },
  { name: 'Referrals', val: 1200, color: '#f59e0b' },
];

export default function AdminRevenueHub() {
  const db = useFirestore();
  const [stats, setStats] = useState({
    total: 0,
    daily: 0,
    conversion: 8.4
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (db) fetchRevenue();
  }, [db]);

  const fetchRevenue = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      let total = 0;
      snap.forEach(doc => {
        const d = doc.data();
        total += (d.totalSpent || 0);
        if (d.isPremium && !d.totalSpent) total += 99;
      });
      setStats(prev => ({ ...prev, total }));
    } catch (e) {}
  };

  return (
    <main className="p-12 space-y-16 max-w-[100rem] mx-auto">
      <header className="space-y-6">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">
          <Banknote size={14} /> FINANCIAL PROTOCOLS ACTIVE
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-2">
            <h1 className="text-7xl md:text-9xl font-headline font-black tracking-tighter text-white uppercase leading-none">Revenue <span className="text-emerald-500 italic">Matrix.</span></h1>
            <p className="text-muted-foreground text-2xl font-medium italic opacity-60">Institutional monitoring of global creative revenue streams.</p>
          </div>
          <div className="flex gap-4">
             <button className="h-16 px-10 rounded-full bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest shadow-glow active:scale-95 transition-all">
                <Target className="w-4 h-4 mr-3 inline" /> GENERATE REPORT
             </button>
             <button onClick={fetchRevenue} className="h-16 w-16 rounded-full glass-panel border-white/5 flex items-center justify-center hover:bg-white/10 active:rotate-180 transition-all">
                <RefreshCw className="w-5 h-5 text-muted-foreground" />
             </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <Card className="rounded-[4rem] bg-emerald-500/5 border border-emerald-500/20 p-12 space-y-10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:scale-110 transition-transform">
              <Landmark className="w-52 h-52 text-emerald-500" />
           </div>
           <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Total Master Reserve</p>
              <h3 className="text-8xl font-black text-white tracking-tighter uppercase">{isClient ? `₹${stats.total.toLocaleString()}` : '₹...'}</h3>
           </div>
           <div className="flex items-center gap-6 relative z-10 pt-6">
              <div className="flex items-center gap-2 text-emerald-500 font-black">
                 <ArrowUpRight className="w-5 h-5" />
                 <span className="text-xl">+12.4%</span>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">INSTITUTIONAL GROWTH</span>
           </div>
        </Card>

        <Card className="rounded-[4rem] glass-panel border-white/5 p-12 space-y-10 relative overflow-hidden">
           <div className="space-y-1">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">AdSense Identity</p>
              <h3 className="text-4xl font-black text-white uppercase tracking-tight">VERIFIED</h3>
           </div>
           <div className="space-y-4 pt-4 text-[10px] font-bold uppercase tracking-[0.2em]">
              <div className="flex justify-between border-b border-white/5 pb-3">
                 <span className="text-muted-foreground">Publisher ID</span>
                 <span className="text-white">ca-pub-8946...</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                 <span className="text-muted-foreground">Crawler Status</span>
                 <span className="text-emerald-500">SYNCED</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-muted-foreground">Ads.txt Node</span>
                 <span className="text-primary">OPERATIONAL</span>
              </div>
           </div>
           <button className="w-full h-16 rounded-[1.5rem] bg-orange-600/10 border border-orange-600/20 text-orange-600 font-black text-[9px] uppercase tracking-widest hover:bg-orange-600/20 transition-all">
              OPEN ADSENSE PORTAL
           </button>
        </Card>

        <Card className="rounded-[4rem] glass-panel border-white/5 p-12 space-y-10 relative overflow-hidden">
           <div className="space-y-1">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Conversion Engine</p>
              <h3 className="text-6xl font-black text-indigo-400 tracking-tighter uppercase">{stats.conversion}%</h3>
           </div>
           <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[42%] shadow-glow" />
           </div>
           <p className="text-xs text-muted-foreground italic leading-relaxed opacity-60">Elite Agency protocol conversions are up 4% this cycle.</p>
        </Card>
      </section>

      <div className="grid lg:grid-cols-2 gap-12">
         <Card className="rounded-[4rem] glass-panel border-white/5 p-12 space-y-10 shadow-2xl relative overflow-hidden">
            <h4 className="text-3xl font-black font-headline text-white uppercase tracking-tight">Stream Distribution</h4>
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockRevenue}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                     <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                     <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                     <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ backgroundColor: '#0a061c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                     />
                     <Bar dataKey="val" radius={[15, 15, 0, 0]}>
                        {mockRevenue.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="rounded-[4rem] glass-panel border-white/5 p-12 space-y-10 shadow-2xl bg-white/[0.01]">
            <h4 className="text-3xl font-black font-headline text-white uppercase tracking-tight">Financial Timeline</h4>
            <div className="space-y-8">
               {[
                 { label: "Subscription Payout", amt: "+₹4,200", id: "TXN-8422", type: "success" },
                 { label: "AdSense Payout", amt: "+₹1,840", id: "TXN-3211", type: "success" },
                 { label: "Cloud Node Cost", amt: "-₹124", id: "BILL-041", type: "expense" },
                 { label: "Agency Clearance", amt: "+₹499", id: "TXN-9021", type: "success" },
               ].map((txn, i) => (
                 <div key={i} className="flex items-center justify-between p-6 bg-black/40 rounded-[1.8rem] border border-white/5 hover:border-emerald-500/20 transition-all group">
                    <div className="flex items-center gap-6">
                       <div className={cn("p-4 rounded-2xl", txn.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500')}>
                          {txn.type === 'success' ? <TrendingUp size={20}/> : <ArrowDownRight size={20}/>}
                       </div>
                       <div className="space-y-1">
                          <p className="text-lg font-bold text-white uppercase tracking-tight">{txn.label}</p>
                          <p className="text-[9px] text-muted-foreground font-mono opacity-40">{txn.id}</p>
                       </div>
                    </div>
                    <span className={cn("text-2xl font-black font-headline", txn.type === 'success' ? 'text-emerald-500' : 'text-red-500')}>
                       {txn.amt}
                    </span>
                 </div>
               ))}
            </div>
            <button className="w-full text-center pt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-all">VIEW FULL LEDGER</button>
         </Card>
      </div>
    </main>
  );
}
