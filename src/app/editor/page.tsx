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
  Check, Save, Trash2, Gauge, Palette
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
 * 🎨 ELITE STUDIO CORE: Static Export Compatible
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
  
  const [title, setTitle] = useState("Untitled Project");
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
    // ✅ HYDRATION SHIELD: Ensure ID generation only happens on client mount
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
    toast({ title: "Asset Synchronized" });
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic) return;
    setIsProcessing(true);
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      handleSave({ aiNotes: result.script });
      toast({ title: "Script Engineered", description: "Narrative node linked." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: "Neural sync interrupted." });
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
      toast({ title: "Video Synthesized", description: "Motion core output verified." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: "Motion core busy." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#020408] flex flex-col overflow-hidden text-[#e1e4e8]">
      <Navbar />
      
      <div className="h-20 border-b bg-[#05070a]/90 backdrop-blur-3xl px-6 flex items-center justify-between z-40 border-white/5 mt-20">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex flex-col">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-bold text-xl focus:outline-none w-[300px] truncate text-white uppercase tracking-tight"
              placeholder="Project ID..."
            />
            <div className="flex items-center gap-2 mt-1">
              <div className={cn("w-2 h-2 rounded-full shadow-glow", isSaving ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                {isSaving ? "Syncing Workspace..." : "Node Synchronized"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <Button variant="outline" className="h-12 rounded-xl bg-white/5 border-white/10 text-white font-bold" onClick={() => handleSave()}>
             <Save className="w-4 h-4 mr-2" /> Save Draft
           </Button>
           <Button className="h-12 px-10 rounded-xl font-black uppercase tracking-widest bg-primary shadow-glow text-[10px] gap-2 hover:scale-105 transition-all">
            <Download className="w-4 h-4" />
            Export 4K
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-24 bg-[#05070a] border-r border-white/5 flex flex-col items-center py-10 gap-10">
           {[
             { icon: Wand2, id: 'ai', label: 'AI' },
             { icon: Film, id: 'media', label: 'ASSETS' },
             { icon: Palette, id: 'fx', label: 'FILTERS' },
             { icon: Type, id: 'text', label: 'TITLES' },
             { icon: Settings2, id: 'tools', label: 'RESIZE' }
           ].map((item) => (
             <button 
               key={item.id} 
               className={cn("flex flex-col items-center gap-2 transition-all", activeTab === item.id ? "text-primary" : "text-muted-foreground")} 
               onClick={() => setActiveTab(item.id)}
             >
               <div className={cn("p-4 rounded-[1.2rem] border-2 transition-all", activeTab === item.id ? "bg-primary/10 border-primary/40 scale-110 shadow-glow" : "bg-transparent border-transparent hover:bg-white/5")}>
                 <item.icon className="w-6 h-6" />
               </div>
               <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </div>

        <div className="w-[420px] bg-[#0a0d14] border-r border-white/5 flex flex-col p-8 space-y-10 overflow-y-auto scrollbar-hide hidden lg:flex">
           {activeTab === 'ai' && (
             <div className="space-y-10 animate-in fade-in slide-in-from-left-4">
                <div className="space-y-5">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Viral Narrative Core</p>
                   <textarea 
                     className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-6 text-sm h-32 outline-none focus:border-primary/40 transition-all placeholder:opacity-20" 
                     placeholder="Topic for your next viral hit..." 
                     value={scriptTopic} 
                     onChange={(e) => setScriptTopic(e.target.value)} 
                   />
                   <Button className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20" onClick={handleGenerateScript} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Wand2 className="w-4 h-4 mr-3" />}
                      Write Viral Script
                   </Button>
                </div>

                <div className="space-y-5">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Veo Motion Synthesis</p>
                   <textarea 
                     className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-6 text-sm h-32 outline-none focus:border-indigo-400/40 transition-all placeholder:opacity-20" 
                     placeholder="Describe the cinematic clip..." 
                     value={videoPrompt} 
                     onChange={(e) => setVideoPrompt(e.target.value)} 
                   />
                   <Button className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-indigo-600 shadow-2xl hover:bg-indigo-700" onClick={handleGenerateVideo} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <VideoIcon className="w-4 h-4 mr-3" />}
                      Generate Clip
                   </Button>
                </div>
             </div>
           )}

           {activeTab === 'media' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileUpload} />
                <Button className="w-full h-48 border-4 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02] flex flex-col gap-5 hover:bg-white/[0.05] hover:border-primary/20 transition-all group" onClick={() => fileInputRef.current?.click()}>
                   <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-all shadow-inner">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                   </div>
                   <div className="text-center">
                     <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] block">Import Media</span>
                     <span className="text-[8px] text-muted-foreground uppercase mt-2 block">Support 4K MP4 / MOV</span>
                   </div>
                </Button>
             </div>
           )}
        </div>

        <div className="flex-1 flex flex-col bg-[#020408] p-6 md:p-12 space-y-10 relative overflow-hidden">
           <div className="flex-1 relative aspect-video mx-auto bg-black rounded-[4rem] border-[12px] border-[#0a0d14] overflow-hidden shadow-2xl group flex flex-col items-center justify-center">
              {!videoData ? (
                <div className="text-center space-y-6 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Monitor size={80} className="mx-auto" />
                   <p className="text-[12px] font-black uppercase tracking-[0.6em]">Waiting for Output Node</p>
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
                   className={cn("w-24 h-24 rounded-full bg-primary/20 backdrop-blur-xl border-4 border-primary/40 transition-all pointer-events-auto shadow-2xl", isPlaying ? "opacity-0 scale-90" : "opacity-100 scale-100 hover:scale-110")}
                 >
                   {isPlaying ? <Pause className="fill-primary w-8 h-8" /> : <Play className="fill-primary w-8 h-8 ml-2" />}
                 </Button>
              </div>
           </div>

           <div className="h-64 bg-[#0a0d14] rounded-[3.5rem] border border-white/5 flex flex-col overflow-hidden relative shadow-2xl">
              <div className="h-14 border-b border-white/5 px-10 flex items-center justify-between bg-white/[0.03]">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                       <Film className="w-4 h-4 text-primary" />
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Project Matrix</h4>
                    </div>
                    <span className="text-[12px] font-mono text-white/40">{currentTime.toFixed(2)}s / {duration.toFixed(2)}s</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-40 hover:opacity-100"><Scissors size={14}/></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-40 hover:opacity-100"><Timer size={14}/></Button>
                 </div>
              </div>

              <div 
                ref={timelineRef}
                className="flex-1 p-10 space-y-5 relative cursor-crosshair scrollbar-hide overflow-hidden"
              >
                 <div className="h-14 bg-primary/10 border border-primary/20 rounded-2xl relative flex items-center px-6">
                    <Film className="w-4 h-4 text-primary mr-5 opacity-40" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Primary Track</span>
                    {videoData && (
                      <div className="absolute left-0 h-full bg-primary/25 border-x-2 border-primary w-[90%] rounded-2xl animate-in slide-in-from-left duration-1000" />
                    )}
                 </div>

                 <div className="h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl relative flex items-center px-6 opacity-30">
                    <Music className="w-3 h-3 text-indigo-400 mr-5 opacity-40" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Audio Overlay</span>
                 </div>

                 <div 
                   className="absolute top-0 bottom-0 w-1 bg-white z-20 shadow-glow" 
                   style={{ left: `${(currentTime / duration) * 100}%` }}
                 >
                    <div className="absolute -top-1 -left-[6px] w-4 h-4 bg-white rounded-full border-4 border-black" />
                 </div>
              </div>
           </div>
        </div>

        <div className="w-[360px] bg-[#05070a] border-l border-white/5 p-10 space-y-10 hidden xl:flex flex-col">
           <header className="flex items-center gap-4 text-primary">
              <Cpu size={22} className="animate-pulse" />
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em]">Node Diagnostics</h4>
           </header>

           <div className="space-y-8 flex-1">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4 shadow-inner">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Neural Health</p>
                 <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold font-headline text-white">Elite Tier</span>
                    <Zap className="text-emerald-500 w-5 h-5 animate-pulse" />
                 </div>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[96%] shadow-glow" />
                 </div>
              </div>

              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">System Node</p>
                 <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[10px] font-bold">
                       <span className="text-muted-foreground uppercase">Region</span>
                       <span className="text-white">Global CDN</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                       <span className="text-muted-foreground uppercase">Latency</span>
                       <span className="text-emerald-400">0.4s</span>
                    </div>
                 </div>
              </div>
           </div>

           <Button variant="outline" className="w-full h-16 rounded-2xl border-white/10 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-white/5" onClick={() => handleSave()}>
              <RefreshCw className="w-4 h-4 mr-3" /> Sync Workspace
           </Button>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-[100px] flex items-center justify-center">
           <div className="text-center space-y-12 max-w-lg px-8">
              <div className="relative mx-auto">
                 <Loader2 className="w-24 h-24 animate-spin text-primary mx-auto" />
                 <div className="absolute inset-0 blur-3xl bg-primary/30 rounded-full" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-4xl font-headline font-black text-white uppercase tracking-tighter">GEMINI CORE ACTIVE</h2>
                 <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.5em] animate-pulse">Establishing High-Speed Neural Link...</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#020408]"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
      <EditorContent />
    </Suspense>
  );
}
