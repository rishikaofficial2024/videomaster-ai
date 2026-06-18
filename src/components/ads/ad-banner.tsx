
"use client";

import { MonitorPlay, Info } from "lucide-react";

interface AdBannerProps {
  provider?: string;
}

/**
 * AdBanner component for displaying advertisements from multiple providers.
 * In a real-world scenario, you would replace the placeholder with the 
 * actual ad script/tag provided by Google AdSense, AdMob, or other companies.
 */
export function AdBanner({ provider = "Google AdSense" }: AdBannerProps) {
  return (
    <div className="w-full bg-[#0a0d14] border border-white/5 rounded-[2.5rem] p-6 md:p-10 my-8 relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <MonitorPlay className="w-24 h-24" />
      </div>
      
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
           <Info className="w-3 h-3 text-muted-foreground" />
           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sponsored by {provider}</span>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-xl font-bold font-headline text-white/40">Premium Ad Slot</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">This space is monetized using {provider}. Real ads will appear here once your account is approved.</p>
        </div>
        
        <div className="w-full max-w-2xl aspect-[32/5] bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
           <span className="text-[10px] font-mono text-muted-foreground uppercase">Advertisement (728 x 90)</span>
        </div>
      </div>
    </div>
  );
}
