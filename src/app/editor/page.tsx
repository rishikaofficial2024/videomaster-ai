"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, Pause, Scissors, Type, Music, Smile, Wand2, Download, 
  ChevronLeft, Loader2, Video as VideoIcon, Plus, Layout, Settings2,
  Trash2, RotateCcw, RotateCw, Crop, Volume2, Sparkles, Youtube, 
  Smartphone, Monitor, Laptop, Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Editor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("media");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleAction = (action: string) => {
    toast({ title: `${action} initiated`, description: "This feature is currently processing your request." });
  };

  const handleExport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({ title: "Export Complete", description: "Your video has been saved to your dashboard." });
    }, 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Editor Header */}
      <header className="h-16 border-b px-4 flex items-center justify-between bg-card z-40">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/dashboard"><ChevronLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold truncate max-w-[200px]">My First Project</h1>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Draft • Auto-saved 2m ago</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full hidden md:flex items-center gap-2">
            <Layout className="h-4 w-4" /> Change Aspect Ratio
          </Button>
          <Button size="sm" className="rounded-full px-6 font-bold shadow-lg shadow-primary/20" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export 4K
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tool Tabs */}
        <aside className="w-80 border-r bg-card flex flex-col z-30 hidden lg:flex">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-5 h-14 bg-muted/50 rounded-none border-b p-0 px-2">
              <TabsTrigger value="media" title="Import" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full"><VideoIcon className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="edit" title="Edit" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full"><Scissors className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="text" title="Titles" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full"><Type className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="audio" title="Music" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full"><Music className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="ai" title="AI Tools" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full"><Sparkles className="h-4 w-4" /></TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              <TabsContent value="media" className="mt-0 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="border-2 border-dashed rounded-2xl h-32 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 cursor-pointer transition-colors group">
                    <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                    <span className="text-xs font-bold text-muted-foreground">Import Media</span>
                  </div>
                  <div className="space-y-3">
                     <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">My Assets</h3>
                     <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="aspect-square bg-muted rounded-xl relative overflow-hidden group cursor-pointer">
                             <img src={`https://picsum.photos/seed/ed${i}/200/200`} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" data-ai-hint="video frame" />
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <Plus className="h-5 w-5 text-white" />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="edit" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleAction("Trim")} className="big-icon-button"><Scissors className="h-5 w-5" /><span className="text-[10px] font-bold">Trim</span></button>
                    <button onClick={() => handleAction("Split")} className="big-icon-button"><Layout className="h-5 w-5" /><span className="text-[10px] font-bold">Split</span></button>
                    <button onClick={() => handleAction("Crop")} className="big-icon-button"><Crop className="h-5 w-5" /><span className="text-[10px] font-bold">Crop</span></button>
                    <button onClick={() => handleAction("Rotate")} className="big-icon-button"><RotateCw className="h-5 w-5" /><span className="text-[10px] font-bold">Rotate</span></button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Transform</h3>
                  <div className="grid grid-cols-1 gap-2">
                     <Button variant="outline" className="justify-start h-12 rounded-xl text-xs"><Volume2 className="mr-2 h-4 w-4" /> Volume & Fade</Button>
                     <Button variant="outline" className="justify-start h-12 rounded-xl text-xs"><Settings2 className="mr-2 h-4 w-4" /> Speed Control</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-0 space-y-6">
                <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Sparkles className="h-4 w-4" />
                    Neural Power Tools
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Let our AI handle the heavy lifting while you focus on creativity.</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                   <Button onClick={() => handleAction("Auto Enhance")} className="h-14 rounded-2xl flex items-center justify-start px-6 gap-3 font-bold group shadow-sm">
                     <Wand2 className="h-5 w-5 group-hover:animate-pulse" /> AI Auto-Enhance
                   </Button>
                   <Button variant="outline" onClick={() => handleAction("Subtitles")} className="h-14 rounded-2xl flex items-center justify-start px-6 gap-3 font-bold">
                     <Sparkles className="h-5 w-5 text-purple-500" /> Generate Subtitles
                   </Button>
                   <Button variant="outline" onClick={() => handleAction("Background Remover")} className="h-14 rounded-2xl flex items-center justify-start px-6 gap-3 font-bold">
                     <Monitor className="h-5 w-5 text-blue-500" /> Remove Background
                   </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </aside>

        {/* Main Preview Area */}
        <main className="flex-1 flex flex-col bg-muted/20 relative">
          {/* Viewport Preview */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-12 relative">
             <div className="relative aspect-video max-w-4xl w-full bg-black rounded-2xl shadow-2xl overflow-hidden group">
                <video 
                  ref={videoRef}
                  src="https://www.w3schools.com/html/mov_bbb.mp4" 
                  className="w-full h-full object-contain"
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                   <Button size="icon" variant="ghost" className="h-20 w-20 rounded-full text-white hover:bg-white/10" onClick={togglePlay}>
                     {isPlaying ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-1" />}
                   </Button>
                </div>
                
                {/* Visual Indicators Overlay (Simplified) */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white/80 text-[10px] font-bold font-mono px-4 py-2 bg-black/40 backdrop-blur-md rounded-full">
                   <span>00:0{Math.floor(currentTime)} / 00:10</span>
                   <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1"><Monitor className="h-3 w-3" /> 16:9</span>
                      <span className="flex items-center gap-1 text-emerald-400"><Zap className="h-3 w-3 fill-current" /> 4K Rendering</span>
                   </div>
                </div>
             </div>
             
             {/* Bottom Controls */}
             <div className="flex items-center gap-6 mt-8 p-4 bg-card border shadow-sm rounded-full px-8">
                <Button variant="ghost" size="icon" className="rounded-full"><RotateCcw className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-1" />}
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full"><RotateCw className="h-5 w-5" /></Button>
                <div className="h-6 w-px bg-border" />
                <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive/10"><Trash2 className="h-5 w-5" /></Button>
             </div>
          </div>

          {/* Timeline - Simplified for beginners */}
          <div className="h-56 bg-card border-t p-4 flex flex-col gap-4 z-20">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">
                <div className="flex items-center gap-4">
                   <span className="flex items-center gap-1"><Scissors className="h-3 w-3" /> Sequence</span>
                   <span className="flex items-center gap-1"><Music className="h-3 w-3" /> Audio</span>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="sm" className="h-6 text-[10px] rounded-full">Zoom In</Button>
                   <Button variant="ghost" size="sm" className="h-6 text-[10px] rounded-full">Zoom Out</Button>
                </div>
             </div>
             
             <div className="flex-1 space-y-2">
                {/* Video Track */}
                <div className="editor-timeline-track bg-primary/5 border-primary/20">
                   <div 
                    className="h-14 bg-primary/20 border-2 border-primary rounded-xl flex items-center px-4 gap-4 overflow-hidden relative shadow-inner"
                    style={{ width: '80%' }}
                   >
                      {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="shrink-0 w-12 h-10 bg-black/10 rounded-sm" />
                      ))}
                      <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-white shadow-xl z-10" />
                   </div>
                   <div className="ml-auto flex items-center gap-2 pr-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10"><Plus className="h-4 w-4" /></Button>
                   </div>
                </div>

                {/* Audio Track */}
                <div className="editor-timeline-track bg-purple-500/5 border-purple-500/20 h-12">
                   <div 
                    className="h-8 bg-purple-500/10 border-2 border-purple-500/30 rounded-lg flex items-center px-4 gap-1 overflow-hidden"
                    style={{ width: '60%', marginLeft: '10%' }}
                   >
                      <div className="flex-1 flex items-center gap-0.5 opacity-30">
                        {[...Array(40)].map((_, i) => (
                          <div key={i} className="w-0.5 bg-purple-500" style={{ height: `${Math.random() * 80 + 20}%` }} />
                        ))}
                      </div>
                   </div>
                   <div className="ml-auto flex items-center gap-2 pr-4">
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-purple-500/10"><Plus className="h-3 w-3" /></Button>
                   </div>
                </div>
             </div>
          </div>
        </main>
      </div>

      {/* Processing Modal Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center gap-6">
           <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse"></div>
           </div>
           <div className="text-center space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">Neural Rendering Active</h2>
              <p className="text-muted-foreground text-sm font-medium italic">Optimizing for 4K Ultra HD Export...</p>
           </div>
        </div>
      )}
    </div>
  );
}