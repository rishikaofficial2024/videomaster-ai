
"use client";

import { useEffect } from "react";
import { MonitorPlay, Info } from "lucide-react";

interface AdBannerProps {
  provider?: string;
  adSlot?: string;
}

/**
 * Professional AdSense Banner Component
 * Once your site is approved, real ads will automatically appear here.
 */
export function AdBanner({ provider = "Google AdSense", adSlot = "default" }: AdBannerProps) {
  useEffect(() => {
    try {
      // Trigger Google AdSense to push the ad into the placeholder
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn("AdSense could not load yet. Site may be in review.");
    }
  }, []);

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
        
        {/* Real AdSense HTML Structure */}
        <div className="w-full flex justify-center overflow-hidden min-h-[90px]">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-8946933317699938"
               data-ad-slot={adSlot}
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>

        <div className="space-y-1">
          <h4 className="text-[10px] font-bold font-headline text-white/20 uppercase tracking-[0.2em]">AdSense Monitoring Node: Active</h4>
          <p className="text-[9px] text-muted-foreground max-w-sm mx-auto italic">Note: Real ads will appear here only after Google approves your domain.</p>
        </div>
      </div>
    </div>
  );
}
