
"use client";

import { useEffect } from "react";
import { SquarePlay, Info, Sparkles, TrendingUp } from "lucide-react";

interface AdBannerProps {
  provider?: string;
  adSlot?: string;
  variant?: 'banner' | 'large' | 'native';
}

/**
 * Professional AdSense & AdMob Banner Component.
 * Optimized for high-CTR placements in VideoMaster AI.
 */
export function AdBanner({ provider = "AdSense Premium Network", adSlot = "default", variant = 'banner' }: AdBannerProps) {
  useEffect(() => {
    try {
      // Trigger Google AdSense
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // Silent catch for ad-blockers
    }
  }, []);

  return (
    <div className={`w-full bg-[#0a0d14]/90 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-6 md:p-10 my-8 relative overflow-hidden group hover:border-primary/40 transition-all duration-700 shadow-2xl blue-glow ${variant === 'large' ? 'py-16' : ''}`}>
      <div className="absolute top-0 right-0 p-8 opacity-[0.05] rotate-12 group-hover:rotate-0 transition-transform duration-1000 hidden md:block">
        <TrendingUp className="w-48 h-48 text-primary" />
      </div>
      
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
           <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Sponsored • {provider}</span>
        </div>
        
        {/* Ad Placement Container */}
        <div className={`w-full flex justify-center overflow-hidden border-y border-white/5 py-8 ${variant === 'large' ? 'min-h-[280px]' : 'min-h-[100px]'}`}>
          <ins className="adsbygoogle"
               style={{ display: 'block', minWidth: '320px', width: '100%' }}
               data-ad-client="ca-pub-8946933317699938"
               data-ad-slot={adSlot}
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>

        <div className="flex items-center gap-2 opacity-40">
           <Info className="w-3 h-3" />
           <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
             Ads help keep VideoMaster AI free for everyone.
           </p>
        </div>
      </div>
    </div>
  );
}
