"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { 
  Pause, Play,
  Wand2, Download, ChevronLeft, Loader2, Video as VideoIcon,
  Plus, Music, 
  Upload, Film,
  Settings2, Type, Crown, Zap, Volume2,
  Monitor, RefreshCw, Cpu, Smartphone, Scissors, Timer, 
  Layers, Smile, Undo2, Redo2, Maximize, Crop, RotateCcw, 
  Check, Save, Trash2, Gauge, Palette, ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAiVideo } from "@/ai/flows/ai-video-generation-flow";
import { generateAiScript } from "@/ai/flows/ai-script-writer-flow";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { cn } from "@/lib/utils";

/**
 * 🎬 PROFESSIONAL EDITOR: VN/CapCut Style Architecture.
 * Optimized for high-speed multi-track editing on all nodes.
 */
function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectIdFromUrl = searchParams.get("id");
  const toolFromUrl = searchParams.get("tool");
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isNewProject, setIsNewProject] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [title, setTitle] = useState("MASTERPIECE_NODE_01");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(toolFromUrl || 'ai');
  
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  const [videoData, setVideoData] = useState<string | null>(null);
  const [scriptTopic, setScriptTopic] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    setMounted(true);
    if (projectIdFromUrl) {
      setProjectId(projectIdFromUrl);
      setIsNewProject(false);
    } else {
      setProjectId("prj-" + Math.random().toString(36).substring(7));
    }
  }, [projectIdFromUrl]);

  const projectRef = useMemoFirebase(() => {
    if (!user || !db || !projectId) return null;
    return doc(db, "users", user.uid, "projects", projectId);
  }, [user?.uid, db, projectId]);

  const { data: project } = useDoc(projectRef);

  useEffect(() => {
    if (project && mounted) {
      setTitle(project.title || "Untitled Project");
      setVideoData(project.videoDataUri || null);
      setMediaAssets(project.mediaAssets || []);
    }
  }, [project, mounted]);

  const handleSave = (extraData: any = {}) => {
    if (!user || !projectRef || !mounted) return;
    setIsSaving(true);
    const data: any = {
      title,
      updatedAt: serverTimestamp(),
      mediaAssets,
      videoDataUri: videoData,
      ...extraData
    };
    
    if (!isNewProject) {
      updateDoc(projectRef, data).catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: projectRef.path,
          operation: 'update',
          requestResourceData: data,
        } satisfies SecurityRuleContext));
      });
    } else {
      setDoc(projectRef, {
        ...data,
        createdAt: serverTimestamp(),
        status: "draft",
      }).then(() => setIsNewProject(false));
    }
    
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoData(url);
    handleSave({ videoDataUri: url });
    toast({ title: "Media Node Synced", description: "Asset ready for production." });
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic) return;
    setIsProcessing(true);
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      handleSave({ aiNotes: result.script });
      toast({ title: "Narrative Engineered", description: "Viral script generated." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Neural Timeout", description: "Retry link protocol." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt) return;
    setIsProcessing(true);
    try {
      const result = await generateAiVideo({ prompt: videoPrompt });
      setVideoData(result.videoDataUri);
      handleSave({ videoDataUri: result.videoDataUri });
      toast({ title: "Synthesis Complete", description: "Video clip rendered." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Motion Core Busy", description: "Re-initiating link..." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#020108] flex flex-col overflow-hidden text-[#e1e4e8]">
      {/* TOP NAV BAR */}
      <div className="h-24 bg-[#050314]/80 backdrop-blur-3xl px-8 flex items-center justify-between z-40 border-b border-white/5">
        <div className="flex items-center gap-10">
          <Link href="/dashboard" className="p-4 hover:bg-white/5 rounded-3xl transition-all border border-transparent hover:border-white/10 group">
            <ChevronLeft className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <div className="flex flex-col">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-black text-3xl focus:outline-none w-[400px] truncate text-white uppercase tracking-tighter"
              placeholder="PROJECT_ID..."
            />
            <div className="flex items-center gap-3 mt-1">
              <div className={cn("w-2 h-2 rounded-full", isSaving ? "bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]")} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
                {isSaving ? "Syncing Workspace..." : "Node Operational"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <Button variant="ghost" className="h-14 px-8 rounded-full border border-white/5 bg-white/5 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10" onClick={() => handleSave()}>
             <Save className="w-4 h-4 mr-3" /> Save Draft
           </Button>
           <Button className="h-14 px-12 rounded-full font-black uppercase tracking-[0.2em] bg-primary text-white shadow-glow text-[10px] gap-3 hover:scale-105 transition-all active:scale-95">
            <Download className="w-4 h-4" />
            Export 4K
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR TOOLBAR */}
        <div className="w-28 bg-[#050314] border-r border-white/5 flex flex-col items-center py-12 gap-12">
           {[
             { icon: Wand2, id: 'ai', label: 'AI' },
             { icon: Film, id: 'media', label: 'ASSETS' },
             { icon: Palette, id: 'fx', label: 'EFFECTS' },
             { icon: Type, id: 'text', label: 'TITLES' },
             { icon: Settings2, id: 'tools', label: 'CONFIG' }
           ].map((item) => (
             <button 
               key={item.id} 
               className={cn("flex flex-col items-center gap-3 transition-all", activeTab === item.id ? "text-primary scale-110" : "text-muted-foreground hover:text-white")} 
               onClick={() => setActiveTab(item.id)}
             >
               <div className={cn("p-5 rounded-[2rem] border-2 transition-all duration-500", activeTab === item.id ? "bg-primary/15 border-primary shadow-glow" : "bg-transparent border-transparent hover:bg-white/5")}>
                 <item.icon className="w-7 h-7" />
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </div>

        {/* SIDE PANEL (DRAWER) */}
        <div className="w-[450px] bg-[#0a061c] border-r border-white/5 flex flex-col p-10 space-y-12 overflow-y-auto scrollbar-hide hidden xl:flex shadow-2xl relative z-10">
           {activeTab === 'ai' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-left-6 duration-700">
                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg text-primary"><Wand2 size={16} /></div>
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Neural Narrative</p>
                   </div>
                   <textarea 
                     className="w-full bg-black/40 border border-white/10 rounded-[2.5rem] p-8 text-sm h-48 outline-none focus:border-primary/40 transition-all placeholder:opacity-20 leading-relaxed font-medium" 
                     placeholder="Design your viral hook..." 
                     value={scriptTopic} 
                     onChange={(e) => setScriptTopic(e.target.value)} 
                   />
                   <Button className="w-full h-16 rounded-full font-black text-[10px] uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all" onClick={handleGenerateScript} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Zap className="w-4 h-4 mr-3 fill-current" />}
                      Execute AI Logic
                   </Button>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-3 text-accent">
                      <div className="p-2 bg-accent/20 rounded-lg"><VideoIcon size={16} /></div>
                      <p className="text-[11px] font-black uppercase tracking-[0.4em]">Motion Synthesis</p>
                   </div>
                   <textarea 
                     className="w-full bg-black/40 border border-white/10 rounded-[2.5rem] p-8 text-sm h-48 outline-none focus:border-accent/40 transition-all placeholder:opacity-20 leading-relaxed font-medium" 
                     placeholder="Describe the cinematic action..." 
                     value={videoPrompt} 
                     onChange={(e) => setVideoPrompt(e.target.value)} 
                   />
                   <Button className="w-full h-16 rounded-full font-black text-[10px] uppercase tracking-widest bg-accent hover:bg-accent/90 shadow-glow transition-all" onClick={handleGenerateVideo} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <VideoIcon className="w-4 h-4 mr-3" />}
                      Generate Motion
                   </Button>
                </div>
             </div>
           )}

           {activeTab === 'media' && (
             <div className="space-y-10 animate-in fade-in slide-in-from-left-6 duration-700">
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileUpload} />
                <div 
                   className="w-full h-60 border-4 border-dashed border-white/5 rounded-[4rem] bg-white/[0.02] flex flex-col items-center justify-center gap-6 hover:bg-white/[0.05] hover:border-primary/20 transition-all group cursor-pointer" 
                   onClick={() => fileInputRef.current?.click()}
                >
                   <div className="p-6 bg-white/5 rounded-full group-hover:scale-110 group-hover:rotate-12 transition-all shadow-2xl">
                      <Upload className="w-10 h-10 text-muted-foreground" />
                   </div>
                   <div className="text-center space-y-2">
                     <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] block">Import Local Node</span>
                     <span className="text-[8px] text-muted-foreground uppercase tracking-widest opacity-40 block">4K MP4 • MOV • WebM</span>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* MAIN VIEWER AREA */}
        <div className="flex-1 flex flex-col bg-[#03010a] p-8 lg:p-12 space-y-12 relative overflow-hidden">
           {/* VIDEO PREVIEW CONTAINER */}
           <div className="flex-1 relative aspect-video mx-auto w-full max-w-6xl bg-black rounded-[5rem] border-[12px] border-[#0a061c] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] group flex flex-col items-center justify-center">
              {!videoData ? (
                <div className="text-center space-y-8 opacity-10 group-hover:opacity-20 transition-opacity">
                   <div className="relative mx-auto">
                      <Monitor size={100} className="mx-auto" />
                      <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full" />
                   </div>
                   <p className="text-sm font-black uppercase tracking-[0.8em]">Waiting for Feed</p>
                </div>
              ) : (
                <video 
                  ref={videoRef} 
                  src={videoData} 
                  className="w-full h-full object-contain" 
                  onPlay={() => setIsPlaying(true)} 
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                />
              )}
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <Button 
                   size="icon" 
                   onClick={() => isPlaying ? videoRef.current?.pause() : videoRef.current?.play()} 
                   className={cn("w-32 h-32 rounded-full bg-primary/20 backdrop-blur-3xl border-4 border-primary/50 transition-all pointer-events-auto shadow-[0_0_50px_rgba(109,40,217,0.5)]", isPlaying ? "opacity-0 scale-90" : "opacity-100 scale-100 hover:scale-110 hover:shadow-[0_0_80px_rgba(109,40,217,0.8)]")}
                 >
                   {isPlaying ? <Pause className="fill-primary w-10 h-10" /> : <Play className="fill-primary w-10 h-10 ml-2" />}
                 </Button>
              </div>
           </div>

           {/* TIMELINE AREA */}
           <div className="h-72 glass-panel rounded-[4rem] border-white/5 flex flex-col overflow-hidden relative shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
              <div className="h-16 border-b border-white/5 px-12 flex items-center justify-between bg-white/[0.03]">
                 <div className="flex items-center gap-10">
                    <div className="flex items-center gap-4">
                       <div className="p-2 bg-primary/20 rounded-lg text-primary"><Film size={16} /></div>
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Timeline Node</h4>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <span className="text-[13px] font-mono font-bold text-primary tracking-widest">{currentTime.toFixed(2)}s <span className="opacity-20 text-white">/ {duration.toFixed(2)}s</span></span>
                 </div>
                 <div className="flex items-center gap-6">
                    {[Scissors, Timer, Layers, Smile].map((Icon, i) => (
                      <Button key={i} variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-white hover:bg-white/5 transition-all"><Icon size={18}/></Button>
                    ))}
                    <div className="h-8 w-px bg-white/10 mx-2" />
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-white"><Undo2 size={18}/></Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-white"><Redo2 size={18}/></Button>
                 </div>
              </div>

              <div 
                ref={timelineRef}
                className="flex-1 p-12 space-y-6 relative cursor-crosshair scrollbar-hide overflow-hidden bg-black/20"
              >
                 {/* TRACK 1 */}
                 <div className="h-16 bg-primary/10 border border-primary/20 rounded-[1.5rem] relative flex items-center px-8 group/track transition-all hover:bg-primary/15">
                    <Film className="w-5 h-5 text-primary mr-6 opacity-30 group-hover/track:opacity-60 transition-opacity" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-primary opacity-50">Master Visual Track</span>
                    {videoData && (
                      <div className="absolute left-0 h-full bg-primary/30 border-x-4 border-primary w-[85%] rounded-[1.5rem] animate-in slide-in-from-left duration-1000 shadow-glow relative">
                         <div className="absolute inset-0 shimmer-effect opacity-10" />
                      </div>
                    )}
                 </div>

                 {/* TRACK 2 */}
                 <div className="h-12 bg-accent/5 border border-accent/10 rounded-2xl relative flex items-center px-8 opacity-30 group/track2">
                    <Music className="w-4 h-4 text-accent mr-6 opacity-30" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent opacity-40">Audio Sequence</span>
                 </div>

                 {/* PLAYHEAD */}
                 <div 
                   className="absolute top-0 bottom-0 w-1 bg-white z-20 shadow-[0_0_20px_rgba(255,255,255,0.8)]" 
                   style={{ left: `${(currentTime / duration) * 100}%` }}
                 >
                    <div className="absolute -top-1 -left-[10px] w-6 h-6 bg-white rounded-full border-[6px] border-[#0a061c] shadow-2xl" />
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT DIAGNOSTICS PANEL */}
        <div className="w-[380px] bg-[#050314] border-l border-white/5 p-12 space-y-12 hidden 2xl:flex flex-col">
           <header className="flex items-center gap-4 text-primary">
              <div className="p-2 bg-primary/10 rounded-lg animate-pulse"><Cpu size={20} /></div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.5em]">Node Statistics</h4>
           </header>

           <div className="space-y-10 flex-1">
              <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 space-y-6 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Neural Health</p>
                 <div className="flex items-center justify-between">
                    <span className="text-3xl font-black font-headline text-white uppercase tracking-tight">Active</span>
                    <div className="p-3 bg-emerald-500/20 rounded-2xl"><Zap className="text-emerald-500 w-6 h-6 fill-current animate-pulse" /></div>
                 </div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-primary w-[98%] shadow-glow" />
                 </div>
              </div>

              <div className="glass-panel p-10 rounded-[3.5rem] border-white/5 space-y-6">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Export Profile</p>
                 <div className="space-y-4">
                    {[
                      { label: "Standard", val: "1080p", color: "text-white" },
                      { label: "Elite", val: "4K Master", color: "text-primary" },
                      { label: "Audio", val: "320kbps", color: "text-emerald-500" }
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center pb-3 border-b border-white/5 last:border-0">
                         <span className="text-[10px] font-bold uppercase text-muted-foreground opacity-60">{row.label}</span>
                         <span className={cn("text-[11px] font-black uppercase tracking-widest", row.color)}>{row.val}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <Button variant="outline" className="w-full h-20 rounded-full border-white/10 text-white font-black text-[11px] uppercase tracking-widest hover:bg-white/5 hover:border-primary/40 transition-all group" onClick={() => handleSave()}>
              <RefreshCw className="w-4 h-4 mr-4 group-hover:rotate-180 transition-transform duration-700" /> Propagate Changes
           </Button>
        </div>
      </div>

      {/* OVERLAY LOADER */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-[#020108]/95 backdrop-blur-[50px] flex items-center justify-center">
           <div className="text-center space-y-16 max-w-2xl px-10">
              <div className="relative mx-auto w-32 h-32">
                 <Loader2 className="w-full h-full animate-spin text-primary relative z-10" />
                 <div className="absolute inset-0 blur-[50px] bg-primary/40 rounded-full scale-150 animate-pulse" />
              </div>
              <div className="space-y-6">
                 <h2 className="text-6xl font-headline font-black text-white uppercase tracking-tighter">Neural Hub Active</h2>
                 <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.8em] animate-pulse">Establishing High-Speed Production Link...</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#020108]"><div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
      <EditorContent />
    </Suspense>
  );
}