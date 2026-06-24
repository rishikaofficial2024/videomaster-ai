
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Pause, Play, SkipBack, SkipForward,
  Wand2, Download, ChevronLeft, Loader2, Video as VideoIcon,
  Plus, Music, 
  Upload, Film,
  Settings2, Type, Crown, Lock, Zap, Volume2,
  Monitor, Smartphone, RefreshCw, Cpu
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
  const toolFromUrl = searchParams.get("tool");
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const [projectId, setProjectId] = useState<string | null>(projectIdFromUrl);
  const [isNewProject, setIsNewProject] = useState(!projectIdFromUrl);
  const [mounted, setMounted] = useState(false);
  
  const [title, setTitle] = useState("New Gemini Project");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(toolFromUrl || 'ai');
  
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [videoData, setVideoData] = useState<string | null>(null);
  const [scriptTopic, setScriptTopic] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  
  const [magicHook, setMagicHook] = useState("");
  const [subtitles, setSubtitles] = useState("");

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
      setTitle(project.title || "New Gemini Project");
      setVideoData(project.videoDataUri || null);
      setMediaAssets(project.mediaAssets || []);
      setMagicHook(project.magicHook || "");
      setSubtitles(project.subtitles || "");
      setIsNewProject(false);
    }
  }, [project, mounted]);

  useEffect(() => {
    // Generate ID only on client to avoid hydration mismatch
    if (mounted && !projectId && !projectIdFromUrl) {
      const newId = "prj-" + Math.random().toString(36).substring(2, 9);
      setProjectId(newId);
    }
  }, [mounted, projectId, projectIdFromUrl]);

  const handleSave = (extraData: any = {}) => {
    if (!user || !projectRef || !mounted) return;
    setIsSaving(true);
    const data: any = {
      title,
      updatedAt: serverTimestamp(),
      mediaAssets,
      videoDataUri: videoData,
      magicHook,
      subtitles,
      ...extraData
    };
    
    if (!isNewProject) {
      updateDoc(projectRef, data).catch(async () => {
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
      }).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: projectRef.path,
          operation: 'create',
          requestResourceData: { ...data, status: 'draft' },
        } satisfies SecurityRuleContext));
      });
      setIsNewProject(false);
    }
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'image';
    
    const newAsset: MediaAsset = {
      id: Math.random().toString(36).substring(7),
      url: url,
      type: type,
      name: file.name,
      duration: 5,
    };

    const updatedAssets = [...mediaAssets, newAsset];
    setMediaAssets(updatedAssets);
    if (newAsset.type !== 'audio') setVideoData(url);
    handleSave({ mediaAssets: updatedAssets });
    toast({ title: "Asset Injected", description: `${file.name} added to project.` });
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic) return;
    setIsProcessing(true);
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      handleSave({ aiNotes: result.script, magicHook: result.hook });
      setMagicHook(result.hook);
      toast({ title: "Narrative Ready", description: "Script engineered via Gemini Fast AI." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Sync Alert", description: "Neural engine link was interrupted." });
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
      toast({ title: "Motion Synthesis Complete", description: "Cinematic clip generated via Gemini Video Engine." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Motion Hub Offline", description: "Motion synthesis limit reached or engine busy." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    setCurrentTime(newTime);
    if (videoRef.current) videoRef.current.currentTime = newTime;
  };

  const isImageData = videoData && (videoData.startsWith('data:image') || videoData.includes('picsum.photos') || videoData.includes('unsplash.com'));

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#020408] flex flex-col overflow-hidden text-[#e1e4e8]">
      <Navbar />
      
      <div className="h-24 border-b bg-[#05070a]/90 backdrop-blur-3xl px-8 flex items-center justify-between z-40 border-white/5 mt-24">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-3 hover:bg-white/5 rounded-2xl group transition-all">
            <ChevronLeft className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
          </Link>
          <div className="flex flex-col">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-bold text-xl focus:outline-none w-[300px] truncate text-white"
            />
            <div className="flex items-center gap-2 mt-1">
              <div className={cn("w-2 h-2 rounded-full", isSaving ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                {isSaving ? "Syncing..." : "Gemini Cloud Active"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button className="h-14 px-10 rounded-xl font-black uppercase tracking-[0.2em] bg-primary shadow-glow text-[11px] gap-3">
            {profile?.isPremium ? <Download className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            Export Project
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-24 bg-[#05070a] border-r border-white/5 flex flex-col items-center py-10 gap-10">
           {[
             { icon: Wand2, id: 'ai', label: 'GEMINI' },
             { icon: Film, id: 'media', label: 'MEDIA' },
             { icon: Music, id: 'audio', label: 'AUDIO' },
             { icon: Type, id: 'text', label: 'TEXT' },
             { icon: Settings2, id: 'settings', label: 'CONFIG' }
           ].map((item) => (
             <button 
               key={item.id} 
               className={cn("flex flex-col items-center gap-2 transition-all group", activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-white")} 
               onClick={() => setActiveTab(item.id)}
             >
               <div className={cn("p-4 rounded-3xl border-2 transition-all", activeTab === item.id ? "bg-primary/10 border-primary/30" : "bg-transparent border-transparent")}>
                 <item.icon className="w-6 h-6" />
               </div>
               <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </div>

        <div className="w-[420px] bg-[#0a0d14] border-r border-white/5 flex flex-col p-8 space-y-8 overflow-y-auto scrollbar-hide">
           {activeTab === 'ai' && (
             <div className="space-y-10 animate-in fade-in slide-in-from-left-4">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Gemini Fast AI</h3>
                
                <div className="space-y-6">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Narrative Strategist</p>
                   <textarea 
                     className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm h-32 outline-none focus:border-primary/40 resize-none" 
                     placeholder="What's your viral topic?" 
                     value={scriptTopic} 
                     onChange={(e) => setScriptTopic(e.target.value)} 
                   />
                   <Button className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all" onClick={handleGenerateScript} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Wand2 className="w-4 h-4 mr-3" />}
                      Generate Script
                   </Button>
                </div>

                <div className="space-y-6">
                   <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-60">Motion Engine</p>
                   <textarea 
                     className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm h-32 outline-none focus:border-primary/40 resize-none" 
                     placeholder="Describe cinematic scene..." 
                     value={videoPrompt} 
                     onChange={(e) => setVideoPrompt(e.target.value)} 
                   />
                   <Button className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-indigo-600 shadow-xl shadow-indigo-600/20" onClick={handleGenerateVideo} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <VideoIcon className="w-4 h-4 mr-3" />}
                      Synthesize Clip
                   </Button>
                </div>
             </div>
           )}

           {activeTab === 'media' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Media Assets</h3>
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*,image/*,audio/*" onChange={handleFileUpload} />
                <Button className="w-full h-44 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02] flex flex-col gap-6 hover:bg-primary/5 hover:border-primary/40 transition-all group" onClick={() => fileInputRef.current?.click()}>
                   <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                   </div>
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Inject Asset</span>
                </Button>
                <div className="grid grid-cols-2 gap-4">
                   {mediaAssets.map((asset) => (
                     <div key={asset.id} className="aspect-video rounded-2xl bg-black border border-white/10 overflow-hidden relative group cursor-pointer">
                        {asset.type === 'video' ? <video src={asset.url} className="w-full h-full object-cover opacity-60" /> : <img src={asset.url} className="w-full h-full object-cover opacity-60" />}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/60">
                           <Plus className="w-6 h-6 text-white" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
           
           {activeTab === 'settings' && (
             <div className="space-y-10 animate-in fade-in slide-in-from-left-4">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Project Config</h3>
                <div className="space-y-8">
                   <div className="space-y-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Neural Precision</p>
                      <Slider defaultValue={[100]} max={100} step={1} className="[&_[role=slider]]:bg-primary" />
                   </div>
                   <div className="space-y-6 pt-6 border-t border-white/5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Studio Aspect Ratio</p>
                      <div className="grid grid-cols-2 gap-4">
                         <button className="h-16 rounded-2xl border border-primary bg-primary/10 flex flex-col items-center justify-center gap-2">
                            <Smartphone size={16} className="text-primary" />
                            <span className="text-[8px] font-black uppercase tracking-widest">9:16 Portrait</span>
                         </button>
                         <button className="h-16 rounded-2xl border border-white/5 bg-white/5 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Monitor size={16} />
                            <span className="text-[8px] font-black uppercase tracking-widest">16:9 Landscape</span>
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>

        <div className="flex-1 flex flex-col bg-[#020408] p-8 lg:p-12 space-y-8 relative overflow-hidden">
           <div className="flex-1 relative aspect-video mx-auto bg-black rounded-[3rem] border-[12px] border-[#0a0d14] overflow-hidden shadow-2xl group flex flex-col">
              <div className="flex-1 relative flex items-center justify-center">
                {!videoData ? (
                  <div className="text-center space-y-4 opacity-10">
                     <Monitor size={48} className="mx-auto" />
                     <p className="text-xs font-black uppercase tracking-[0.4em]">Neural Output Link Offline</p>
                  </div>
                ) : isImageData ? (
                  <img src={videoData} className="w-full h-full object-contain" alt="Preview" />
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

                {videoData && !isImageData && (
                  <div className="absolute inset-x-0 bottom-10 flex justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <div className="bg-[#05070a]/90 backdrop-blur-3xl px-12 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-12 shadow-2xl">
                        <button className="text-muted-foreground hover:text-primary transition-all" onClick={() => videoRef.current && (videoRef.current.currentTime -= 5)}><SkipBack size={24} /></button>
                        <button 
                          onClick={() => videoRef.current && (isPlaying ? videoRef.current.pause() : videoRef.current.play())} 
                          className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center shadow-glow"
                        >
                          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                        </button>
                        <button className="text-muted-foreground hover:text-primary transition-all" onClick={() => videoRef.current && (videoRef.current.currentTime += 5)}><SkipForward size={24} /></button>
                    </div>
                  </div>
                )}
              </div>
           </div>

           <div className="h-60 bg-[#0a0d14] rounded-[3rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl relative">
              <div className="h-12 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.03]">
                 <div className="flex items-center gap-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Gemini Neural Timeline</h4>
                    <span className="text-[12px] font-mono text-white/40">{currentTime.toFixed(2)}s / {duration.toFixed(2)}s</span>
                 </div>
              </div>

              <div 
                ref={timelineRef}
                className="flex-1 overflow-x-auto p-8 space-y-4 relative cursor-crosshair"
                onClick={handleTimelineClick}
              >
                 <div className="h-12 bg-primary/10 border border-primary/20 rounded-2xl relative flex items-center px-6 overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    <Film className="w-4 h-4 text-primary mr-6 opacity-40" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Primary Neural Track</span>
                 </div>

                 <div className="h-10 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl relative flex items-center px-6 overflow-hidden opacity-40">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                    <Volume2 className="w-4 h-4 text-indigo-400 mr-6 opacity-40" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Audio Sync Node</span>
                 </div>
                 
                 <div 
                   className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-glow" 
                   style={{ left: `${(currentTime / duration) * 100}%` }}
                 />
              </div>
           </div>
        </div>

        <div className="w-[380px] bg-[#05070a] border-l border-white/5 p-8 space-y-12">
           <div className="space-y-10">
              <header className="flex items-center gap-4 text-primary">
                 <Cpu size={20} />
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Analytics</h4>
              </header>

              <div className="space-y-10">
                 <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Engine Performance</p>
                    <div className="flex items-center justify-between">
                       <span className="text-2xl font-bold font-headline uppercase">Flash Tier</span>
                       <Zap className="text-emerald-500 w-5 h-5 animate-pulse" />
                    </div>
                 </div>
                 
                 <div className="space-y-6 pt-6 border-t border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Export Resolution</p>
                    <div className="space-y-3">
                       <button className="w-full p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all">
                          <span className="text-xs font-bold uppercase tracking-tight">Standard HD</span>
                          <span className="text-[8px] font-black opacity-40">1080P</span>
                       </button>
                       <button className="w-full p-5 rounded-2xl bg-primary/10 border border-primary/40 flex items-center justify-between">
                          <span className="text-xs font-bold text-primary uppercase tracking-tight">Elite 4K</span>
                          <Crown className="w-3 h-3 text-primary fill-current" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-[100px] flex items-center justify-center animate-in fade-in duration-700">
           <div className="text-center space-y-12 max-w-xl">
              <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
              <div className="space-y-4">
                 <h2 className="text-4xl font-headline font-black text-white tracking-tighter uppercase">GEMINI NEURAL PROCESSING</h2>
                 <p className="text-xl text-muted-foreground italic font-medium opacity-60">Leveraging high-speed Gemini Flash architecture for cinematic synthesis.</p>
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
