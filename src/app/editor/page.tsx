"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { 
  Pause, Play, SkipBack, SkipForward,
  Wand2, Download, Sparkles, ChevronLeft, Loader2, Video as VideoIcon,
  Plus, Palette, Music, 
  Trash2, Upload, Scissors, Film,
  Settings2, Type, Layout, Crown, Lock, Layers, Zap, Clock, Maximize, Move, Sliders
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
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface MediaAsset {
  id: string;
  url: string;
  type: 'video' | 'image' | 'audio';
  name: string;
  duration?: number;
}

function EditorContent() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("id");
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [projectId, setProjectId] = useState<string | null>(projectIdFromUrl);
  const [isNewProject, setIsNewProject] = useState(!projectIdFromUrl);
  const [mounted, setMounted] = useState(false);
  
  const [title, setTitle] = useState("Untitled Masterpiece");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("media");
  const [editorMode, setEditorMode] = useState<'normal' | 'advanced'>('normal');
  
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [videoData, setVideoData] = useState<string | null>(null);
  const [scriptTopic, setScriptTopic] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const projectRef = useMemoFirebase(() => {
    if (!user || !db || !projectId) return null;
    return doc(db, "users", user.uid, "projects", projectId);
  }, [user?.uid, db, projectId]);

  const { data: project } = useDoc(projectRef);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user?.uid, db]);

  const { data: profile } = useDoc(userProfileRef);

  useEffect(() => {
    if (project && mounted) {
      setTitle(project.title || "Untitled Masterpiece");
      setVideoData(project.videoDataUri || null);
      setMediaAssets(project.mediaAssets || []);
      setIsNewProject(false);
    }
  }, [project, mounted]);

  useEffect(() => {
    if (!projectId && !projectIdFromUrl && mounted) {
      const newId = "prj-" + Math.random().toString(36).substring(2, 9);
      setProjectId(newId);
    }
  }, [projectId, projectIdFromUrl, mounted]);

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
      updateDoc(projectRef, data).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: projectRef.path,
          operation: 'update',
          requestResourceData: data,
        }));
      });
    } else {
      setDoc(projectRef, {
        ...data,
        createdAt: serverTimestamp(),
        status: "draft",
      }).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: projectRef.path,
          operation: 'create',
          requestResourceData: { ...data, status: 'draft' },
        }));
      });
      setIsNewProject(false);
    }
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newAsset: MediaAsset = {
      id: Math.random().toString(36).substring(7),
      url: url,
      type: file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'image',
      name: file.name,
      duration: 5,
    };

    const updatedAssets = [...mediaAssets, newAsset];
    setMediaAssets(updatedAssets);
    if (newAsset.type !== 'audio') setVideoData(url);
    handleSave({ mediaAssets: updatedAssets });
    toast({ title: "Import Successful", description: `${file.name} added to neural library.` });
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic) return;
    setIsProcessing(true);
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      handleSave({ aiNotes: result.script });
      toast({ title: "Logic Engineered", description: "Viral narrative flow generated successfully." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: e.message });
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
      toast({ title: "Motion Rendered", description: "Visual sequence synchronized to timeline." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Render Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#020408] flex flex-col overflow-hidden text-[#e1e4e8] font-body selection:bg-primary/40">
      <Navbar />
      
      {/* 🚀 ELITE TOOLBAR */}
      <div className="h-24 border-b bg-[#05070a]/90 backdrop-blur-[60px] px-10 flex items-center justify-between z-40 border-white/5 shadow-2xl relative">
        <div className="absolute inset-0 shimmer opacity-[0.03] pointer-events-none" />
        <div className="flex items-center gap-10 relative z-10">
          <Link href="/dashboard" className="p-4 hover:bg-white/5 rounded-3xl transition-all border border-transparent hover:border-white/10 group shadow-inner">
            <ChevronLeft className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <div className="flex flex-col">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-black text-2xl focus:outline-none w-[400px] truncate text-white border-b border-transparent focus:border-primary/40 transition-all font-headline tracking-tighter"
            />
            <div className="flex items-center gap-2.5 mt-1.5">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2.5">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,1)]" />
                 {isSaving ? "SYNCHRONIZING..." : "NODE SECURE"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white/[0.02] p-1.5 rounded-3xl border border-white/5 relative z-10">
           <button 
             onClick={() => setEditorMode('normal')}
             className={cn("px-8 py-3 rounded-[1.4rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all", editorMode === 'normal' ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:text-white")}
           >
             Standard
           </button>
           <button 
             onClick={() => setEditorMode('advanced')}
             className={cn("px-8 py-3 rounded-[1.4rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3", editorMode === 'advanced' ? "bg-indigo-600 text-white shadow-glow" : "text-muted-foreground hover:text-white")}
           >
             {editorMode !== 'advanced' && <Crown className="w-4 h-4" />}
             Advanced
           </button>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <Button variant="ghost" size="sm" className="rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] text-muted-foreground hover:text-white h-14 px-8" onClick={() => handleSave()}>
            Store Node
          </Button>
          <Button className="h-16 px-14 rounded-[2rem] font-black uppercase tracking-[0.3em] bg-primary shadow-glow shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-[12px]">
            {profile?.isPremium ? <Download className="w-5 h-5 mr-3" /> : <Lock className="w-5 h-5 mr-3" />}
            {profile?.isPremium ? "MASTER EXPORT" : "UNLOCK 4K"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 🛠️ VN SIDEBAR */}
        <div className="w-32 bg-[#05070a] border-r border-white/5 flex flex-col items-center py-14 gap-16 relative">
           <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
           {[
             { icon: Film, id: 'media', label: 'Media' },
             { icon: Wand2, id: 'ai', label: 'AI Suite' },
             { icon: Music, id: 'audio', label: 'Tracks' },
             { icon: Type, id: 'text', label: 'Text' },
             { icon: Palette, id: 'style', label: 'Visuals' },
             { icon: Sliders, id: 'filters', label: 'Inspect' }
           ].map((item) => (
             <button 
               key={item.id} 
               className={cn("flex flex-col items-center gap-4 transition-all group", activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-white")} 
               onClick={() => setActiveTab(item.id)}
             >
               <div className={cn("p-5 rounded-[2rem] border-2 transition-all group-hover:scale-110 shadow-2xl", activeTab === item.id ? "bg-primary/15 border-primary/40 shadow-glow shadow-primary/20" : "bg-white/[0.01] border-transparent")}>
                 <item.icon className="w-7 h-7" />
               </div>
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">{item.label}</span>
             </button>
           ))}
        </div>

        {/* 📚 DRAWER */}
        <div className="w-[480px] bg-[#05070a]/60 backdrop-blur-[80px] border-r border-white/5 flex flex-col p-12 space-y-12 overflow-y-auto scrollbar-hide shadow-2xl">
           {activeTab === 'media' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center justify-between">
                   <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-white">Neural Assets</h3>
                   <Badge variant="outline" className="text-[10px] px-4 py-1 rounded-full uppercase tracking-[0.2em] font-black opacity-30">{mediaAssets.length} Units</Badge>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*,image/*,audio/*" onChange={handleFileUpload} />
                <Button className="w-full h-64 border-2 border-dashed border-white/10 rounded-[4rem] bg-white/[0.01] flex flex-col gap-6 group hover:bg-primary/5 hover:border-primary/40 transition-all duration-700 shadow-inner" onClick={() => fileInputRef.current?.click()}>
                   <div className="p-7 bg-primary/10 rounded-3xl text-primary group-hover:scale-110 transition-all shadow-2xl shadow-primary/10 border border-primary/20"><Upload className="w-10 h-10" /></div>
                   <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.5em] group-hover:text-primary transition-colors">Propagate Neural Data</span>
                </Button>
                <div className="grid grid-cols-2 gap-6">
                   {mediaAssets.map((asset) => (
                     <div key={asset.id} className="aspect-video rounded-[2.5rem] bg-black border-2 border-white/5 overflow-hidden relative group cursor-pointer hover:border-primary/40 transition-all shadow-xl">
                        {asset.type === 'video' ? <video src={asset.url} className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-all" /> : asset.type === 'audio' ? <div className="w-full h-full flex items-center justify-center bg-indigo-500/10"><Music className="w-10 h-10 text-indigo-400" /></div> : <img src={asset.url} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all" />}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/60 backdrop-blur-[2px]">
                           <Plus className="w-10 h-10 text-white" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'ai' && (
             <div className="space-y-14 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="space-y-10">
                   <div className="flex items-center gap-4 px-6 py-3 bg-primary/10 rounded-full border border-primary/20 w-fit shadow-glow shadow-primary/10">
                      <Zap className="w-5 h-5 text-primary animate-pulse" />
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">AI Engineering Suite</span>
                   </div>
                   
                   <div className="p-10 bg-white/[0.02] rounded-[4rem] border border-white/5 space-y-10 hover:bg-white/[0.04] transition-all duration-1000 shadow-2xl">
                      <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Viral Logic Engine</label>
                        <span className="text-[10px] text-muted-foreground font-bold italic opacity-40">Generate retention-optimized cinematic scripts.</span>
                      </div>
                      <textarea 
                        className="w-full bg-black/60 border border-white/5 rounded-3xl p-7 text-sm h-48 outline-none focus:border-primary/40 transition-all placeholder:opacity-20 leading-relaxed shadow-inner" 
                        placeholder="Define narrative goal... (e.g. 5 rules for modern dominance)" 
                        value={scriptTopic} 
                        onChange={(e) => setScriptTopic(e.target.value)} 
                      />
                      <Button className="w-full h-20 rounded-3xl font-black uppercase tracking-[0.3em] bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-[0_15px_40px_rgba(59,130,246,0.2)]" onClick={handleGenerateScript} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin mr-4" /> : <Wand2 className="w-6 h-6 mr-4" />}
                        INITIALIZE LOGIC
                      </Button>
                   </div>

                   <div className="p-10 bg-indigo-500/[0.03] rounded-[4rem] border border-indigo-500/10 space-y-10 hover:bg-indigo-500/[0.06] transition-all duration-1000 relative overflow-hidden group shadow-2xl">
                      <div className="absolute -top-16 -right-16 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000 pointer-events-none"><Film className="w-72 h-72" /></div>
                      <div className="flex flex-col gap-3 relative z-10">
                        <label className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400">Motion Renderer</label>
                        <span className="text-[10px] text-muted-foreground font-bold italic opacity-40">Propagate text into high-fidelity visual motion.</span>
                      </div>
                      <textarea 
                        className="w-full bg-black/60 border border-white/5 rounded-3xl p-7 text-sm h-48 outline-none focus:border-indigo-500/40 transition-all placeholder:opacity-20 leading-relaxed relative z-10 shadow-inner" 
                        placeholder="Describe visual sequence... (e.g. Cyberpunk architecture, 4k ultra)" 
                        value={videoPrompt} 
                        onChange={(e) => setVideoPrompt(e.target.value)} 
                      />
                      <Button className="w-full h-20 rounded-3xl font-black uppercase tracking-[0.3em] bg-indigo-600 shadow-[0_20px_50px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-95 transition-all relative z-10" onClick={handleGenerateVideo} disabled={isProcessing}>
                         {isProcessing ? <Loader2 className="w-6 h-6 animate-spin mr-4" /> : <Maximize className="w-6 h-6 mr-4" />}
                         RENDER SEQUENCE
                      </Button>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* 🎬 MONITOR */}
        <div className="flex-1 flex flex-col bg-[#020408] p-12 lg:p-20 space-y-12 relative overflow-hidden">
           <div className="absolute inset-0 hero-gradient opacity-40 pointer-events-none" />
           
           <div className="flex-1 relative aspect-video mx-auto bg-black rounded-[5rem] border-[16px] border-[#05070a] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,1)] group transition-all duration-1000 relative z-10">
              <div className="absolute top-12 left-12 z-20 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-[-20px] group-hover:translate-x-0">
                 <Badge className="bg-black/80 backdrop-blur-3xl border-white/10 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl border-primary/20">
                    {videoData ? "4K NEURAL STREAM ACTIVE" : "ENGINE IDLE"}
                 </Badge>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                {!videoData ? (
                  <div className="text-center space-y-10 opacity-[0.05]">
                     <div className="w-40 h-40 bg-white/5 rounded-[3.5rem] flex items-center justify-center mx-auto border-2 border-white/5 shadow-inner">
                        <VideoIcon className="w-16 h-16" />
                     </div>
                     <p className="text-[18px] font-black uppercase tracking-[0.6em]">Awaiting Data Feed</p>
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
              </div>

              <div className="absolute inset-x-0 bottom-16 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-10 group-hover:translate-y-0">
                 <div className="bg-black/90 backdrop-blur-3xl px-16 py-7 rounded-[3rem] border border-white/10 flex items-center gap-16 shadow-2xl shadow-black/80">
                    <button className="text-muted-foreground hover:text-white transition-all hover:scale-110 active:scale-90"><SkipBack className="w-8 h-8" /></button>
                    <button 
                      onClick={() => videoRef.current && (isPlaying ? videoRef.current.pause() : videoRef.current.play())} 
                      className="h-24 w-24 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(59,130,246,0.6)]"
                    >
                      {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1.5" />}
                    </button>
                    <button className="text-muted-foreground hover:text-white transition-all hover:scale-110 active:scale-90"><SkipForward className="w-8 h-8" /></button>
                 </div>
              </div>
           </div>

           {/* 🎞️ TIMELINE */}
           <div className="h-80 bg-[#05070a]/90 rounded-[5rem] border border-white/5 flex flex-col overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative transition-all duration-1000 z-10">
              <div className="h-16 border-b border-white/5 px-12 flex items-center justify-between bg-white/[0.01]">
                 <div className="flex items-center gap-12">
                    <div className="flex items-center gap-4 text-primary">
                       <Layers className="w-5 h-5 animate-pulse" />
                       <span className="text-[11px] font-black uppercase tracking-[0.4em]">Timeline Node v3.0</span>
                    </div>
                    <div className="h-6 w-[1px] bg-white/10" />
                    <div className="flex items-center gap-4 text-muted-foreground">
                       <Clock className="w-5 h-5" />
                       <span className="text-[12px] font-mono tracking-tighter text-white/60">{currentTime.toFixed(3)}s / 30.000s</span>
                    </div>
                 </div>
                 <div className="flex gap-8">
                    <button className="p-3 hover:bg-white/5 rounded-2xl text-muted-foreground hover:text-white transition-all hover:scale-110 active:scale-90"><Scissors className="w-6 h-6" /></button>
                    <button className="p-3 hover:bg-white/5 rounded-2xl text-rose-500/40 hover:text-rose-500 transition-all hover:scale-110 active:scale-90"><Trash2 className="w-6 h-6" /></button>
                 </div>
              </div>

              <div className="flex-1 overflow-x-auto p-8 space-y-6 scrollbar-hide">
                 {/* VN Style Tracks */}
                 <div className="vn-track">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 shadow-glow shadow-indigo-500/40" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] min-w-[120px]">Narrative</span>
                    {videoData && <div className="h-7 w-[400px] bg-indigo-500/15 border-2 border-indigo-500/30 rounded-full ml-10 shadow-inner shimmer" />}
                 </div>

                 <div className="vn-track h-24 bg-white/[0.03] border-white/10">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary shadow-glow shadow-primary/40" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] min-w-[120px]">Visuals</span>
                    <div className="flex gap-4 ml-10">
                       {videoData && (
                         <div className="h-16 w-80 bg-primary/20 border-2 border-primary/40 rounded-3xl overflow-hidden relative shadow-2xl">
                            <div className="absolute inset-0 shimmer opacity-20" />
                            <div className="absolute inset-y-0 right-0 w-2.5 bg-white/20 cursor-ew-resize hover:bg-primary transition-all shadow-glow" />
                         </div>
                       )}
                       {mediaAssets.map((m, i) => m.type !== 'audio' && (
                         <div key={i} className="h-16 w-32 bg-white/5 border-2 border-white/5 rounded-3xl shadow-inner transition-all hover:bg-white/10" />
                       ))}
                    </div>
                 </div>

                 <div className="vn-track h-16 bg-white/[0.01] border-dashed">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 shadow-glow shadow-emerald-500/40" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] min-w-[120px]">Audio</span>
                    {mediaAssets.map((m, i) => m.type === 'audio' && (
                       <div key={i} className="h-8 w-64 bg-emerald-500/15 border-2 border-emerald-500/30 rounded-2xl ml-10 flex items-center justify-center shadow-inner">
                          <div className="flex gap-1.5 items-end h-5">
                             {[1,2,3,4,3,2,3,4,2,3,4,3].map((h, j) => <div key={j} className="w-1.5 bg-emerald-400/50 rounded-full" style={{ height: `${h * 20}%` }} />)}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div 
                className="absolute top-16 bottom-0 w-[3px] bg-primary z-10 shadow-[0_0_20px_rgba(59,130,246,1)] pointer-events-none transition-all duration-100 ease-linear" 
                style={{ left: `${(currentTime / 30) * 100}%` }}
              />
           </div>
        </div>

        {/* 🎚️ INSPECTOR */}
        <div className="w-[480px] bg-[#05070a] border-l border-white/5 p-12 space-y-14 overflow-y-auto scrollbar-hide shadow-2xl">
           <div className="space-y-12">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-5 text-emerald-400">
                    <Settings2 className="w-8 h-8" />
                    <h4 className="text-[12px] font-black uppercase tracking-[0.5em]">Master Controller</h4>
                 </div>
                 {editorMode === 'advanced' && <Badge className="bg-indigo-600/20 text-indigo-400 border-indigo-400/30 text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-glow shadow-indigo-600/10">Pro Active</Badge>}
              </div>

              <Tabs defaultValue="adjust" className="w-full">
                 <TabsList className="grid w-full grid-cols-2 bg-white/[0.02] p-2 rounded-3xl mb-16 shadow-inner border border-white/5">
                    <TabsTrigger value="adjust" className="rounded-[1.4rem] text-[11px] font-black uppercase tracking-[0.3em] py-4">Adjust</TabsTrigger>
                    <TabsTrigger value="transform" className="rounded-[1.4rem] text-[11px] font-black uppercase tracking-[0.3em] py-4">Layout</TabsTrigger>
                 </TabsList>
                 
                 <TabsContent value="adjust" className="space-y-12 animate-in fade-in duration-1000">
                    <div className="space-y-10">
                       <div className="space-y-5">
                          <div className="flex justify-between text-[11px] uppercase font-black text-muted-foreground tracking-[0.4em]">
                             <span className="flex items-center gap-4"><Maximize className="w-5 h-5 text-primary" /> AI Upscale</span>
                             <span className="text-primary font-bold">100%</span>
                          </div>
                          <Slider defaultValue={[100]} max={100} step={1} className="[&_[role=slider]]:bg-primary [&_[role=slider]]:w-7 [&_[role=slider]]:h-7 shadow-2xl" />
                       </div>
                       <div className="space-y-5">
                          <div className="flex justify-between text-[11px] uppercase font-black text-muted-foreground tracking-[0.4em]">
                             <span className="flex items-center gap-4"><Clock className="w-5 h-5 text-indigo-400" /> Temporal Flow</span>
                             <span className="text-indigo-400 font-bold">1.0x</span>
                          </div>
                          <Slider defaultValue={[50]} max={100} step={1} className="[&_[role=slider]]:bg-indigo-600 [&_[role=slider]]:w-7 [&_[role=slider]]:h-7 shadow-2xl" />
                       </div>
                       <div className="space-y-5">
                          <div className="flex justify-between text-[11px] uppercase font-black text-muted-foreground tracking-[0.4em]">
                             <span className="flex items-center gap-4"><Sliders className="w-5 h-5 text-emerald-500" /> Saturation</span>
                             <span className="text-emerald-500 font-bold">85%</span>
                          </div>
                          <Slider defaultValue={[85]} max={100} step={1} className="[&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:w-7 [&_[role=slider]]:h-7 shadow-2xl" />
                       </div>
                    </div>

                    <div className="pt-14 border-t border-white/5 space-y-10">
                       <div className="flex items-center gap-4 text-indigo-400">
                          <Layout className="w-6 h-6" />
                          <h4 className="text-[11px] font-black uppercase tracking-[0.4em]">Aspect Matrix</h4>
                       </div>
                       <div className="grid grid-cols-3 gap-6">
                          {[
                            { id: '9:16', label: 'Vertical', active: true },
                            { id: '16:9', label: 'Cinema', active: false },
                            { id: '1:1', label: 'Square', active: false }
                          ].map((ratio) => (
                            <button 
                              key={ratio.id} 
                              className={cn("h-24 flex flex-col items-center justify-center gap-3 rounded-[2rem] border-2 transition-all duration-700 shadow-xl", ratio.active ? "border-primary bg-primary/10 text-white shadow-glow shadow-primary/20" : "border-white/5 bg-white/[0.01] text-muted-foreground hover:border-white/20")}
                            >
                               <span className="text-[13px] font-black tracking-tight font-headline">{ratio.id}</span>
                               <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">{ratio.label}</span>
                            </button>
                          ))}
                       </div>
                    </div>
                 </TabsContent>

                 <TabsContent value="transform" className="space-y-12 animate-in fade-in duration-1000">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="p-10 bg-white/[0.01] rounded-[3.5rem] border border-white/5 text-center space-y-5 hover:bg-white/[0.05] transition-all duration-700 cursor-pointer group shadow-inner">
                          <Move className="w-10 h-10 text-primary mx-auto group-hover:scale-125 transition-all" />
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Center Node</p>
                       </div>
                       <div className="p-10 bg-white/[0.01] rounded-[3.5rem] border border-white/5 text-center space-y-5 hover:bg-white/[0.05] transition-all duration-700 cursor-pointer group shadow-inner">
                          <Maximize className="w-10 h-10 text-primary mx-auto group-hover:scale-125 transition-all" />
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Auto Fit</p>
                       </div>
                    </div>
                 </TabsContent>
              </Tabs>
           </div>

           {/* 🚀 ACTION HUB */}
           <div className="pt-14 border-t border-white/5 space-y-8">
              <Button className="w-full h-28 rounded-[3rem] bg-indigo-600 hover:bg-indigo-700 font-black text-xl uppercase tracking-[0.4em] gap-6 shadow-[0_30px_70px_rgba(99,102,241,0.5)] hover:scale-[1.03] active:scale-95 transition-all">
                 <Maximize className="w-8 h-8 animate-pulse" /> MASTER EXPORT
              </Button>
              <p className="text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.8em] opacity-15">Build v3.0.0-Titan Node</p>
           </div>
        </div>
      </div>

      {/* 🔮 AI LOADING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-[#020408]/98 backdrop-blur-[120px] flex items-center justify-center animate-in fade-in duration-1000">
           <div className="text-center space-y-20">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/40 blur-[180px] rounded-full neural-pulse" />
                 <div className="w-48 h-48 bg-white/5 rounded-[4rem] flex items-center justify-center mx-auto border-4 border-primary/30 relative z-10 shadow-[0_0_100px_rgba(59,130,246,0.3)]">
                    <Loader2 className="w-20 h-20 animate-spin text-primary" />
                 </div>
              </div>
              <div className="space-y-8">
                 <h2 className="text-6xl font-headline font-bold text-white tracking-tighter uppercase leading-none text-gradient">Neural Sync Active</h2>
                 <p className="text-3xl text-muted-foreground italic font-medium opacity-50">Propagating creative logic across multi-dimensional nodes...</p>
                 <div className="w-96 h-1.5 bg-white/5 rounded-full mx-auto overflow-hidden shadow-inner">
                    <div className="h-full bg-primary animate-pulse shadow-[0_0_20px_rgba(59,130,246,1)]" style={{ width: '60%' }} />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#020408]"><Loader2 className="w-16 h-16 animate-spin text-primary" /></div>}>
      <EditorContent />
    </Suspense>
  );
}
