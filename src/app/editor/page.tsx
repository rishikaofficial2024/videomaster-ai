
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { 
  Pause, Play, SkipBack, SkipForward,
  Wand2, Download, Sparkles, ChevronLeft, Loader2, Video as VideoIcon,
  Plus, Palette, Music, 
  Trash2, Upload, Scissors, Film,
  Settings2, Type, Layout, Crown, Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAiVideo } from "@/ai/flows/ai-video-generation-flow";
import { generateAiScript } from "@/ai/flows/ai-script-writer-flow";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface MediaAsset {
  id: string;
  url: string;
  type: 'video' | 'image' | 'audio';
  name: string;
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
  
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [videoData, setVideoData] = useState<string | null>(null);
  const [scriptTopic, setScriptTopic] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");

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
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newAsset: MediaAsset = {
      id: Math.random().toString(36).substring(7),
      url: url,
      type: file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'image',
      name: file.name
    };

    const updatedAssets = [...mediaAssets, newAsset];
    setMediaAssets(updatedAssets);
    if (newAsset.type !== 'audio') setVideoData(url);
    handleSave({ mediaAssets: updatedAssets });
    toast({ title: "Import Successful" });
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic) return;
    setIsProcessing(true);
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      handleSave({ aiNotes: result.script });
      toast({ title: "Script Engineered" });
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
      toast({ title: "Clip Rendered" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Render Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#05070a] flex flex-col overflow-hidden text-[#e1e4e8] font-body">
      <Navbar />
      
      <div className="h-16 border-b bg-[#0a0d14]/95 backdrop-blur-2xl px-6 flex items-center justify-between z-40 border-white/5 shadow-lg">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-2xl transition-colors">
            <ChevronLeft className="w-6 h-6 text-muted-foreground" />
          </Link>
          <div className="flex flex-col">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent font-bold text-lg focus:outline-none w-64 truncate text-white border-b border-transparent focus:border-primary/50 transition-all"
            />
            <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">
              {isSaving ? "Syncing..." : "Cloud Verified"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-xl font-bold text-muted-foreground" onClick={() => handleSave()}>
            Save Draft
          </Button>
          <Button className="h-10 px-8 rounded-2xl font-bold bg-primary shadow-xl shadow-primary/20">
            {profile?.isPremium ? <Download className="w-4 h-4 mr-2" /> : <Lock className="w-3 h-3 mr-2" />}
            {profile?.isPremium ? "Master HD" : "Unlock 4K"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-20 bg-[#0a0d14] border-r border-white/5 flex flex-col items-center py-8 gap-10">
           {[
             { icon: Film, id: 'media', label: 'Media' },
             { icon: Wand2, id: 'ai', label: 'AI Suite' },
             { icon: Music, id: 'audio', label: 'Audio' },
             { icon: Type, id: 'text', label: 'Text' },
             { icon: Palette, id: 'style', label: 'Styles' }
           ].map((item) => (
             <button 
               key={item.id} 
               className={cn("flex flex-col items-center gap-2 transition-all", activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-white")} 
               onClick={() => setActiveTab(item.id)}
             >
               <div className={cn("p-3 rounded-2xl", activeTab === item.id ? "bg-primary/20" : "hover:bg-white/5")}>
                 <item.icon className="w-6 h-6" />
               </div>
               <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </div>

        <div className="w-80 bg-[#0a0d14]/60 backdrop-blur-3xl border-r border-white/5 flex flex-col p-6 space-y-8 overflow-y-auto">
           {activeTab === 'media' && (
             <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">Project Library</h3>
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*,image/*,audio/*" onChange={handleFileUpload} />
                <Button className="w-full h-32 border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5 flex flex-col gap-3" onClick={() => fileInputRef.current?.click()}>
                   <div className="p-3 bg-primary/20 rounded-full text-primary"><Upload className="w-6 h-6" /></div>
                   <span className="text-xs font-bold text-muted-foreground uppercase">Import Media</span>
                </Button>
                <div className="grid grid-cols-2 gap-4">
                   {mediaAssets.map((asset) => (
                     <div key={asset.id} className="aspect-video rounded-xl bg-black border-2 border-white/5 overflow-hidden">
                        {asset.type === 'video' ? <video src={asset.url} className="w-full h-full object-cover opacity-60" /> : <div className="w-full h-full flex items-center justify-center"><Music className="w-6 h-6" /></div>}
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'ai' && (
             <div className="space-y-8">
                <div className="p-4 bg-white/5 rounded-[2rem] border border-white/5 space-y-4">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-primary">Viral Script Topic</label>
                  <textarea className="w-full bg-black/40 rounded-2xl p-4 text-xs h-24 outline-none focus:border-primary/50" placeholder="Topic..." value={scriptTopic} onChange={(e) => setScriptTopic(e.target.value)} />
                  <Button className="w-full h-11 rounded-2xl font-bold bg-primary/20 text-primary" onClick={handleGenerateScript} disabled={isProcessing}>Engineer Script</Button>
                </div>
                <div className="p-4 bg-indigo-500/5 rounded-[2rem] border border-indigo-500/10 space-y-4">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">AI Visual Prompt</label>
                  <textarea className="w-full bg-black/40 rounded-2xl p-4 text-xs h-24 outline-none focus:border-indigo-500/50" placeholder="Visuals..." value={videoPrompt} onChange={(e) => setVideoPrompt(e.target.value)} />
                  <Button className="w-full h-11 rounded-2xl font-bold bg-indigo-600" onClick={handleGenerateVideo} disabled={isProcessing}>Render AI Clip</Button>
                </div>
             </div>
           )}
        </div>

        <div className="flex-1 flex flex-col bg-[#0c0f17] p-8">
           <div className="flex-1 relative aspect-video mx-auto bg-black rounded-[3.5rem] border-[12px] border-[#0a0d14] overflow-hidden shadow-2xl blue-glow">
              <div className="absolute inset-0 flex items-center justify-center">
                {!videoData ? (
                  <div className="text-center opacity-20"><VideoIcon className="w-10 h-10 mx-auto mb-2" /><p className="text-[10px] font-bold uppercase tracking-[0.3em]">Studio Ready</p></div>
                ) : (
                  <video ref={videoRef} src={videoData} className="w-full h-full object-contain" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                )}
              </div>
              <div className="absolute inset-x-0 bottom-10 flex justify-center opacity-0 hover:opacity-100 transition-all">
                 <div className="bg-black/60 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10 flex items-center gap-8">
                    <Button variant="ghost" size="icon"><SkipBack className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => videoRef.current && (isPlaying ? videoRef.current.pause() : videoRef.current.play())} className="h-14 w-14 rounded-full bg-primary text-white">
                      {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                    </Button>
                    <Button variant="ghost" size="icon"><SkipForward className="w-5 h-5" /></Button>
                 </div>
              </div>
           </div>

           <div className="h-48 bg-[#0a0d14] mt-8 rounded-[3rem] border border-white/5 flex flex-col overflow-hidden">
              <div className="h-10 border-b border-white/5 px-8 flex items-center justify-between">
                 <div className="flex items-center gap-4"><Film className="w-4 h-4 text-primary" /><span className="text-[10px] font-bold uppercase text-white">Timeline</span></div>
                 <div className="flex gap-2"><Scissors className="w-4 h-4 text-muted-foreground" /><Trash2 className="w-4 h-4 text-rose-500/60" /></div>
              </div>
              <div className="flex-1 p-4 space-y-4">
                 <div className="h-12 bg-white/[0.03] rounded-xl flex items-center px-4 border border-dashed border-white/5">
                    {videoData && <div className="h-8 w-40 bg-primary/20 border border-primary/30 rounded-lg" />}
                 </div>
              </div>
           </div>
        </div>

        <div className="w-80 bg-[#0a0d14] border-l border-white/5 p-6 space-y-8 overflow-y-auto">
           <div className="space-y-6">
              <div className="flex items-center gap-2 text-emerald-400"><Settings2 className="w-4 h-4" /><h4 className="text-[10px] font-bold uppercase tracking-widest">Inspector</h4></div>
              <div className="space-y-6">
                 <div className="space-y-2"><div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground"><span>Alpha</span><span>100%</span></div><Slider defaultValue={[100]} max={100} step={1} /></div>
                 <div className="space-y-2"><div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground"><span>Gain</span><span>80%</span></div><Slider defaultValue={[80]} max={100} step={1} /></div>
              </div>
           </div>
           <div className="pt-8 border-t border-white/5 space-y-6">
              <div className="flex items-center gap-2 text-indigo-400"><Layout className="w-4 h-4" /><h4 className="text-[10px] font-bold uppercase tracking-widest">Canvas</h4></div>
              <div className="grid grid-cols-3 gap-2">
                 {['9:16', '16:9', '1:1'].map((ratio) => (
                   <Button key={ratio} variant="outline" className={cn("h-10 rounded-xl text-[10px] font-bold border-white/5", ratio === '9:16' && "border-primary/50 text-primary bg-primary/5")}>{ratio}</Button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center">
           <div className="text-center space-y-4"><Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" /><p className="text-xl font-bold font-headline text-white">AI Sync in Progress...</p></div>
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#05070a]"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
      <EditorContent />
    </Suspense>
  );
}
