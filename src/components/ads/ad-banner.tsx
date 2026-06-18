"use client";

import { useEffect } from "react";
import { MonitorPlay, Info, Sparkles } from "lucide-react";

interface AdBannerProps {
  provider?: string;
  adSlot?: string;
}

/**
 * Professional AdSense Banner Component for VideoMaster AI.
 * This component is ready for Google AdSense. Once your domain is approved,
 * actual ads will replace these placeholders.
 */
export function AdBanner({ provider = "Google AdSense Network", adSlot = "default" }: AdBannerProps) {
  useEffect(() => {
    try {
      // Trigger Google AdSense to push the ad into the placeholder
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn("AdSense script not fully loaded or blocked by browser.");
    }
  }, []);

  return (
    <div className="w-full bg-[#0a0d14]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-12 my-10 relative overflow-hidden group hover:border-primary/30 transition-all duration-700 shadow-2xl">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
        <MonitorPlay className="w-48 h-48" />
      </div>
      
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
           <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sponsored Content • {provider}</span>
        </div>
        
        {/* Real AdSense HTML Structure */}
        <div className="w-full flex justify-center overflow-hidden min-h-[100px] border-y border-white/5 py-4">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-8946933317699938"
               data-ad-slot={adSlot}
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>

        <div className="space-y-2">
          <h4 className="text-[11px] font-bold font-headline text-white/40 uppercase tracking-[0.3em]">Network Node: Active</h4>
          <p className="text-[10px] text-muted-foreground max-w-sm mx-auto italic opacity-60">
            Real-time monetization engine. Ads help us keep VideoMaster AI free for everyone.
          </p>
        </div>
      </div>
    </div>
  );
}
