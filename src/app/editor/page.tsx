"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { 
  Pause, Play, SkipBack, SkipForward,
  Wand2, Download, Sparkles, ChevronLeft, Loader2, Video as VideoIcon,
  Plus, Palette, Music, 
  Trash2, Upload, Scissors, Film,
  Settings2, Type, Layout, Crown, Lock, Layers, Zap, Clock, Maximize, Move, Sliders,
  Target, Ghost, MonitorPlay, Pipette, HelpCircle, ArrowRight, Save
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
  
  const [title, setTitle] = useState("Meri Nayi Video");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("ai");
  const [editorMode, setEditorMode] = useState<'easy' | 'pro'>('easy');
  
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [videoData, setVideoData] = useState<string | null>(null);
  const [scriptTopic, setScriptTopic] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  
  const [magicHook, setMagicHook] = useState("");
  const [colorMood, setColorMood] = useState("");

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
      setTitle(project.title || "Meri Nayi Video");
      setVideoData(project.videoDataUri || null);
      setMediaAssets(project.mediaAssets || []);
      setMagicHook(project.magicHook || "");
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
      magicHook,
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
    toast({ title: "Video Aa Gayi!", description: `${file.name} ko editor mein jodh diya gaya hai.` });
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic) return;
    setIsProcessing(true);
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      handleSave({ aiNotes: result.script, magicHook: result.hook });
      setMagicHook(result.hook);
      toast({ title: "Kahani Taiyar!", description: "AI ne aapke liye ek badhiya script likh di hai." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Rukawat!", description: "AI abhi busy hai, thodi der baad try karein." });
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
      toast({ title: "Video Ban Gayi!", description: "Aapki AI video ab timeline par hai." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#020408] flex flex-col overflow-hidden text-[#e1e4e8] font-body selection:bg-primary/40">
      <Navbar />
      
      {/* 🚀 MAIN TOOLBAR */}
      <div className="h-24 border-b bg-[#05070a]/90 backdrop-blur-[80px] px-8 flex items-center justify-between z-40 border-white/5 shadow-2xl">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="p-3 hover:bg-white/5 rounded-2xl transition-all group">
            <ChevronLeft className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
          </Link>
          <div className="flex flex-col">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-bold text-xl focus:outline-none w-[300px] truncate text-white border-b border-transparent focus:border-primary/40"
              placeholder="Apni Video ka Naam Likhein"
            />
            <div className="flex items-center gap-2 mt-1">
              <div className={cn("w-2 h-2 rounded-full", isSaving ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                {isSaving ? "Saving..." : "Safe & Saved"}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/10">
           <button 
             onClick={() => setEditorMode('easy')}
             className={cn("px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all", editorMode === 'easy' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white")}
           >
             Aasaan Mode
           </button>
           <button 
             onClick={() => setEditorMode('pro')}
             className={cn("px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2", editorMode === 'pro' ? "bg-indigo-600 text-white shadow-lg" : "text-muted-foreground hover:text-white")}
           >
             <Crown className="w-3.5 h-3.5" /> Pro Mode
           </button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="rounded-xl font-bold text-xs uppercase tracking-widest h-12 px-6" onClick={() => handleSave()}>
            <Save className="w-4 h-4 mr-2" /> Bachayein
          </Button>
          <Button className="h-12 px-8 rounded-xl font-black uppercase tracking-widest bg-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs gap-2">
            {profile?.isPremium ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            Download
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 🛠️ EASY SIDE NAV */}
        <div className="w-24 bg-[#05070a] border-r border-white/5 flex flex-col items-center py-10 gap-12">
           {[
             { icon: Wand2, id: 'ai', label: 'AI Magic' },
             { icon: Film, id: 'media', label: 'Media' },
             { icon: Music, id: 'audio', label: 'Awaaz' },
             { icon: Type, id: 'text', label: 'Likhai' },
             { icon: Settings2, id: 'settings', label: 'Setting' }
           ].map((item) => (
             <button 
               key={item.id} 
               className={cn("flex flex-col items-center gap-3 transition-all", activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-white")} 
               onClick={() => setActiveTab(item.id)}
             >
               <div className={cn("p-4 rounded-2xl border-2 transition-all", activeTab === item.id ? "bg-primary/10 border-primary/30" : "bg-transparent border-transparent")}>
                 <item.icon className="w-6 h-6" />
               </div>
               <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </div>

        {/* 📚 DRAWER */}
        <div className="w-[400px] bg-[#0a0d14] border-r border-white/5 flex flex-col p-8 space-y-10 overflow-y-auto scrollbar-hide">
           {activeTab === 'ai' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-3">
                   <Sparkles className="w-5 h-5 text-primary" />
                   <p className="text-xs font-bold text-primary uppercase tracking-widest">AI Se Video Banayein</p>
                </div>

                {/* STEP 1: SCRIPT */}
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">1</div>
                      <h3 className="text-sm font-bold uppercase tracking-widest">Pehle Kahani Likhein</h3>
                   </div>
                   <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                      <textarea 
                        className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm h-32 outline-none focus:border-primary/40 resize-none" 
                        placeholder="Video kis baare mein hai? (e.g. 5 Paise kamane ke tarike)" 
                        value={scriptTopic} 
                        onChange={(e) => setScriptTopic(e.target.value)} 
                      />
                      <Button className="w-full h-12 rounded-xl font-bold bg-primary/20 text-primary hover:bg-primary hover:text-white" onClick={handleGenerateScript} disabled={isProcessing}>
                         {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                         Kahani Likhein
                      </Button>
                   </div>
                </div>

                {/* STEP 2: VIDEO */}
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">2</div>
                      <h3 className="text-sm font-bold uppercase tracking-widest">AI Video Banayein</h3>
                   </div>
                   <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                      <textarea 
                        className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm h-32 outline-none focus:border-primary/40 resize-none" 
                        placeholder="Video mein kya dikhna chahiye? (e.g. Ek sundar pahad ka drishya)" 
                        value={videoPrompt} 
                        onChange={(e) => setVideoPrompt(e.target.value)} 
                      />
                      <Button className="w-full h-12 rounded-xl font-bold bg-indigo-600 shadow-lg shadow-indigo-600/20" onClick={handleGenerateVideo} disabled={isProcessing}>
                         {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <VideoIcon className="w-4 h-4 mr-2" />}
                         Video Render Karein
                      </Button>
                   </div>
                </div>

                {/* MAGIC HOOK */}
                {magicHook && (
                  <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 space-y-4">
                     <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Aapka Viral Hook ✨</p>
                     <p className="text-sm italic text-white/80 leading-relaxed">"{magicHook}"</p>
                  </div>
                )}
             </div>
           )}

           {activeTab === 'media' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <h3 className="text-sm font-bold uppercase tracking-widest">Apni Files Dalein</h3>
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*,image/*,audio/*" onChange={handleFileUpload} />
                <Button className="w-full h-40 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02] flex flex-col gap-4 hover:bg-primary/5 transition-all" onClick={() => fileInputRef.current?.click()}>
                   <Upload className="w-8 h-8 text-muted-foreground" />
                   <span className="text-xs font-bold text-muted-foreground uppercase">Upload Karein</span>
                </Button>
                <div className="grid grid-cols-2 gap-4">
                   {mediaAssets.map((asset) => (
                     <div key={asset.id} className="aspect-video rounded-xl bg-black border border-white/10 overflow-hidden relative group cursor-pointer">
                        {asset.type === 'video' ? <video src={asset.url} className="w-full h-full object-cover opacity-60" /> : <img src={asset.url} className="w-full h-full object-cover opacity-60" />}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/60">
                           <Plus className="w-6 h-6 text-white" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        {/* 🎬 MAIN MONITOR */}
        <div className="flex-1 flex flex-col bg-[#020408] p-8 lg:p-12 space-y-8 relative">
           <div className="flex-1 relative aspect-video mx-auto bg-black rounded-[2.5rem] border-[12px] border-[#0a0d14] overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 flex items-center justify-center">
                {!videoData ? (
                  <div className="text-center space-y-6 opacity-10">
                     <VideoIcon className="w-20 h-20 mx-auto" />
                     <p className="text-lg font-bold uppercase tracking-[0.4em]">Video Yahan Dikhegi</p>
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

              <div className="absolute inset-x-0 bottom-10 flex justify-center opacity-0 group-hover:opacity-100 transition-all">
                 <div className="bg-black/80 backdrop-blur-xl px-10 py-4 rounded-full border border-white/10 flex items-center gap-12 shadow-2xl">
                    <button className="text-muted-foreground hover:text-white transition-all"><SkipBack size={24} /></button>
                    <button 
                      onClick={() => videoRef.current && (isPlaying ? videoRef.current.pause() : videoRef.current.play())} 
                      className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                    >
                      {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                    </button>
                    <button className="text-muted-foreground hover:text-white transition-all"><SkipForward size={24} /></button>
                 </div>
              </div>
           </div>

           {/* 🎞️ SIMPLE TIMELINE */}
           <div className="h-48 bg-[#0a0d14] rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden shadow-xl">
              <div className="h-12 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.02]">
                 <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Aapki Timeline</span>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-[12px] font-mono text-white/50">{currentTime.toFixed(2)}s / 30.00s</span>
                 </div>
                 <div className="flex gap-4">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-rose-500/50 hover:text-rose-500"><Trash2 size={18} /></button>
                 </div>
              </div>

              <div className="flex-1 overflow-x-auto p-6 space-y-4">
                 <div className="h-12 bg-primary/10 border border-primary/20 rounded-xl relative flex items-center px-4 group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary mr-6">Visuals</span>
                    {videoData && <div className="h-6 w-60 bg-primary/30 border border-primary/40 rounded-lg animate-pulse" />}
                 </div>
                 <div className="h-10 bg-indigo-500/5 border border-indigo-500/10 rounded-xl relative flex items-center px-4">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-full" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 mr-6">Audio</span>
                    {mediaAssets.some(m => m.type === 'audio') && <div className="h-4 w-40 bg-indigo-500/20 rounded-full" />}
                 </div>
              </div>
              
              <div 
                className="absolute top-12 bottom-0 w-0.5 bg-primary z-10 shadow-glow" 
                style={{ left: `${(currentTime / 30) * 100}%` }}
              />
           </div>
        </div>

        {/* 🎚️ SIMPLE INSPECTOR */}
        <div className="w-[350px] bg-[#05070a] border-l border-white/5 p-8 space-y-10 overflow-y-auto scrollbar-hide">
           <div className="space-y-8">
              <div className="flex items-center gap-3 text-primary">
                 <Settings2 size={20} />
                 <h4 className="text-xs font-black uppercase tracking-widest">Adjust Karein</h4>
              </div>

              <div className="space-y-10">
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                       <span>Safaai (Quality)</span>
                       <span className="text-primary">High</span>
                    </div>
                    <Slider defaultValue={[100]} max={100} step={1} className="[&_[role=slider]]:bg-primary" />
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                       <span>Speed</span>
                       <span className="text-indigo-400">Normal</span>
                    </div>
                    <Slider defaultValue={[50]} max={100} step={1} className="[&_[role=slider]]:bg-indigo-600" />
                 </div>
              </div>

              <div className="pt-10 border-t border-white/10 space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Frame Ka Size</h4>
                 <div className="grid grid-cols-2 gap-4">
                    {['9:16', '16:9'].map((ratio) => (
                      <button 
                        key={ratio} 
                        className={cn("h-16 flex items-center justify-center rounded-xl border transition-all text-xs font-bold", ratio === '9:16' ? "border-primary bg-primary/10 text-white" : "border-white/5 bg-white/[0.02] text-muted-foreground")}
                      >
                         {ratio === '9:16' ? "Mobile (Reels)" : "Cinema (YT)"}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="pt-10 space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3">
                 <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                 <p className="text-[10px] text-amber-200 leading-relaxed italic">
                    <b>Tip:</b> Agar AI video pasand na aaye, toh prompt badal kar firse "Render" dabayein.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* 🔮 AI LOADING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-500">
           <div className="text-center space-y-12">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
                 <div className="w-32 h-32 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 relative z-10 shadow-2xl">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                 </div>
              </div>
              <div className="space-y-4">
                 <h2 className="text-4xl font-headline font-bold text-white tracking-tighter uppercase leading-none">AI Jaadu Kar Raha Hai...</h2>
                 <p className="text-lg text-muted-foreground italic font-medium opacity-60">Bas kuch hi seconds mein aapki video taiyar ho jayegi.</p>
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
