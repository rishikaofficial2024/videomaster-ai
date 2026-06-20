
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { 
  Pause, Play, SkipBack, SkipForward,
  Wand2, Download, Sparkles, ChevronLeft, Loader2, Video as VideoIcon,
  Plus, RefreshCw, Palette, Mic2, 
  Trash2, TrendingUp, Tags, BarChart4, Music, Star, Volume2,
  Upload, Scissors, Layers, Film, Image as ImageIcon,
  Settings2, MoveHorizontal, Type, Layout, Crown, Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAiVideo } from "@/ai/flows/ai-video-generation-flow";
import { generateAiVoiceover } from "@/ai/flows/ai-voiceover-generation-flow";
import { generateAiScript } from "@/ai/flows/ai-script-writer-flow";
import { generateAiThumbnail } from "@/ai/flows/ai-thumbnail-designer-flow";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import Image from "next/image";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface MediaAsset {
  id: string;
  url: string;
  type: 'video' | 'image' | 'audio';
  name: string;
  duration?: number;
}

export default function EditorPage() {
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
  
  const [title, setTitle] = useState("Untitled Project");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [activeTab, setActiveTab] = useState("media");
  
  // Media State
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  // AI Form State
  const [scriptTopic, setScriptTopic] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [aiScript, setAiScript] = useState<any>(null);

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
    if (project) {
      setTitle(project.title || "Untitled Project");
      setVideoData(project.videoDataUri || null);
      setAudioData(project.audioDataUri || null);
      setThumbnailUrl(project.thumbnailUrl || null);
      setMediaAssets(project.mediaAssets || []);
      setIsNewProject(false);
    }
  }, [project]);

  useEffect(() => {
    if (!projectId && !projectIdFromUrl) {
      const newId = "prj-" + Math.random().toString(36).substring(2, 9);
      setProjectId(newId);
    }
  }, [projectId, projectIdFromUrl]);

  const checkCredits = (cost: number) => {
    if (profile?.isPremium) return true;
    if ((profile?.credits ?? 0) < cost) {
      toast({
        variant: "destructive",
        title: "Credits Khatam!",
        description: `Ye kaam karne ke liye ${cost} credits chahiye. Ad dekh kar earn karein ya Pro banein.`,
      });
      return false;
    }
    return true;
  };

  const deductCredits = (cost: number) => {
    if (profile?.isPremium || !userProfileRef) return;
    updateDoc(userProfileRef, { credits: increment(-cost) }).catch(() => {});
  };

  const handleSave = (extraData: any = {}) => {
    if (!user || !projectRef) return;
    setIsSaving(true);
    const data: any = {
      title,
      updatedAt: serverTimestamp(),
      mediaAssets,
      videoDataUri: videoData,
      audioDataUri: audioData,
      thumbnailUrl,
      ...extraData
    };
    
    if (!isNewProject) {
      updateDoc(projectRef, data).catch(() => {});
    } else {
      setDoc(projectRef, {
        ...data,
        createdAt: serverTimestamp(),
        status: "draft",
      }).catch(() => {});
      setIsNewProject(false);
      if (!projectIdFromUrl) router.replace(`/editor?id=${projectRef.id}`);
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
    
    if (newAsset.type !== 'audio') {
      setVideoData(url);
    }
    
    handleSave({ mediaAssets: updatedAssets });
    toast({ title: "Asset Imported", description: `${file.name} added to library.` });
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic || !checkCredits(2)) return;
    setIsProcessing(true);
    setProcessingMessage("Writing viral script...");
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      setAiScript(result);
      deductCredits(2);
      handleSave({ aiNotes: result.script });
      toast({ title: "Script Generated", description: "Aapki script AI tab mein ready hai." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt || !checkCredits(20)) return;
    setIsProcessing(true);
    setProcessingMessage("AI clip is being rendered...");
    try {
      const result = await generateAiVideo({ prompt: videoPrompt });
      setVideoData(result.videoDataUri);
      deductCredits(20);
      handleSave({ videoDataUri: result.videoDataUri });
      toast({ title: "Clip Ready", description: "AI clip timeline mein jodh di gayi hai." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Generation Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="h-screen bg-[#05070a] flex flex-col overflow-hidden text-[#e1e4e8] font-body">
      <Navbar />
      
      {/* Top Tool Bar */}
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
              {isSaving ? "Saving..." : "Project Saved"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-xl font-bold gap-2 text-muted-foreground hover:text-white" onClick={() => handleSave()}>
            Save Draft
          </Button>
          <Button className="h-10 px-8 rounded-xl font-bold bg-primary shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group">
            {profile?.isPremium ? <Download className="w-4 h-4 mr-2" /> : <Lock className="w-3 h-3 mr-2 text-white/50" />}
            {profile?.isPremium ? "Export Video" : "Unlock 4K Export"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <div className="w-20 bg-[#0a0d14] border-r border-white/5 flex flex-col items-center py-8 gap-10">
           {[
             { icon: Film, id: 'media', label: 'Media' },
             { icon: Wand2, id: 'ai', label: 'AI Tools' },
             { icon: Music, id: 'audio', label: 'Audio' },
             { icon: Type, id: 'text', label: 'Text' },
             { icon: Palette, id: 'style', label: 'Style' }
           ].map((item) => (
             <button 
               key={item.id} 
               className={cn(
                 "flex flex-col items-center gap-2 transition-all group",
                 activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-white"
               )} 
               onClick={() => setActiveTab(item.id)}
             >
               <div className={cn(
                 "p-3 rounded-2xl transition-all duration-300", 
                 activeTab === item.id ? "bg-primary/20 shadow-lg shadow-primary/10" : "bg-transparent group-hover:bg-white/5"
               )}>
                 <item.icon className="w-6 h-6" />
               </div>
               <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </div>

        {/* Content Panel - Dynamic Tools */}
        <div className="w-80 bg-[#0a0d14]/60 backdrop-blur-3xl border-r border-white/5 flex flex-col p-6 space-y-8 overflow-y-auto">
           {activeTab === 'media' && (
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-white">Media Library</h3>
                   <Button variant="ghost" size="icon" className="rounded-full" onClick={() => fileInputRef.current?.click()}>
                      <Plus className="w-4 h-4" />
                   </Button>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="video/*,image/*,audio/*" 
                  onChange={handleFileUpload}
                />

                <Button 
                  className="w-full h-32 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-3 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                   <div className="p-3 bg-primary/20 rounded-full text-primary">
                      <Upload className="w-6 h-6" />
                   </div>
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Import from Gallery</span>
                </Button>

                <div className="grid grid-cols-2 gap-4">
                   {mediaAssets.map((asset) => (
                     <div 
                       key={asset.id} 
                       className={cn(
                         "aspect-video rounded-xl bg-black border-2 cursor-pointer overflow-hidden transition-all group relative",
                         selectedAssetId === asset.id ? "border-primary shadow-lg shadow-primary/20" : "border-white/5 hover:border-white/20"
                       )}
                       onClick={() => {
                         setSelectedAssetId(asset.id);
                         if (asset.type !== 'audio') setVideoData(asset.url);
                         else setAudioData(asset.url);
                       }}
                     >
                        {asset.type === 'video' ? (
                          <video src={asset.url} className="w-full h-full object-cover opacity-60" />
                        ) : asset.type === 'image' ? (
                          <img src={asset.url} className="w-full h-full object-cover opacity-60" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                             <Music className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                           <span className="text-[8px] font-bold text-white uppercase">{asset.type}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'ai' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="space-y-4">
                   <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Content Suite</h4>
                   </div>
                   
                   <div className="p-4 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Script Topic</label>
                      <textarea 
                         className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs h-24 outline-none focus:border-primary/50 transition-all resize-none"
                         placeholder="What is your video about?"
                         value={scriptTopic}
                         onChange={(e) => setScriptTopic(e.target.value)}
                      />
                      <Button className="w-full h-11 rounded-xl font-bold bg-primary/20 text-primary hover:bg-primary/30" onClick={handleGenerateScript} disabled={isProcessing}>
                         {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Write Script (2 Cr)"}
                      </Button>
                   </div>

                   <div className="p-4 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 space-y-4">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-1">AI Video Generator</label>
                      <textarea 
                         className="w-full bg-black/40 border border-indigo-500/10 rounded-2xl p-4 text-xs h-24 outline-none focus:border-indigo-500/50 transition-all resize-none"
                         placeholder="Describe the cinematic scene..."
                         value={videoPrompt}
                         onChange={(e) => setVideoPrompt(e.target.value)}
                      />
                      <Button className="w-full h-11 rounded-xl font-bold bg-indigo-600 shadow-lg shadow-indigo-600/20" onClick={handleGenerateVideo} disabled={isProcessing}>
                         {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Render AI Clip (20 Cr)"}
                      </Button>
                   </div>
                </div>

                {!profile?.isPremium && (
                  <Link href="/premium">
                    <Card className="p-6 bg-gradient-to-br from-primary/20 to-indigo-500/20 border-primary/30 rounded-[2rem] hover:scale-105 transition-all group">
                       <div className="flex items-center gap-3 mb-2">
                          <Crown className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
                          <h5 className="text-xs font-bold uppercase tracking-widest">Go Pro Studio</h5>
                       </div>
                       <p className="text-[9px] text-muted-foreground italic font-medium">Remove watermark & get unlimited AI credits.</p>
                    </Card>
                  </Link>
                )}
             </div>
           )}
        </div>

        {/* Editor Central Workspace */}
        <div className="flex-1 flex flex-col bg-[#0c0f17] relative p-8">
           {/* Canvas View */}
           <div className="flex-1 relative aspect-video h-[60%] mx-auto bg-black rounded-[3.5rem] border-[12px] border-[#0a0d14] overflow-hidden shadow-2xl blue-glow group">
              <div className="absolute inset-0 flex items-center justify-center">
                {!videoData && !thumbnailUrl ? (
                  <div className="text-center space-y-4 opacity-20">
                     <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <VideoIcon className="w-10 h-10" />
                     </div>
                     <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Ready for Creation</p>
                  </div>
                ) : (
                  <>
                    {thumbnailUrl && !isPlaying && <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />}
                    {videoData && (
                      <video 
                        ref={videoRef}
                        src={videoData} 
                        className="w-full h-full object-contain"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                    )}
                    {!profile?.isPremium && (
                      <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10">
                         <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.3em]">VideoMaster AI Watermark</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Canvas Overlay Controls */}
              <div className="absolute inset-x-0 bottom-10 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                 <div className="bg-black/60 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10 flex items-center gap-8 shadow-2xl">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white/10"><SkipBack className="w-5 h-5" /></Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={togglePlayback} 
                      className="h-14 w-14 rounded-full bg-primary text-white shadow-xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all"
                    >
                      {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white/10"><SkipForward className="w-5 h-5" /></Button>
                 </div>
              </div>
           </div>

           {/* Pro Timeline Interface */}
           <div className="h-64 bg-[#0a0d14] mt-8 rounded-[3rem] border border-white/5 flex flex-col overflow-hidden shadow-inner">
              <div className="h-12 border-b border-white/5 px-8 flex items-center justify-between bg-white/[0.02]">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <Film className="w-4 h-4 text-primary" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-white">Project Timeline</span>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-[10px] font-mono text-muted-foreground">00:00:00 / 00:00:15</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Scissors className="w-4 h-4 text-muted-foreground" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Trash2 className="w-4 h-4 text-rose-500/60" /></Button>
                 </div>
              </div>

              <div className="flex-1 overflow-x-auto p-4 space-y-3 scrollbar-hide">
                 <div className="h-14 bg-white/[0.03] rounded-2xl flex items-center px-4 relative group border border-dashed border-white/5">
                    <span className="absolute left-4 -top-5 text-[8px] font-bold text-primary/40 uppercase tracking-widest">Video Track 1</span>
                    {videoData && (
                      <div className="h-10 w-48 bg-primary/20 border border-primary/30 rounded-xl flex items-center px-4 gap-3 cursor-grab active:cursor-grabbing">
                         <div className="w-8 h-6 bg-black/40 rounded-md" />
                         <span className="text-[9px] font-bold text-white uppercase truncate">Clip_01_AI_Render</span>
                      </div>
                    )}
                 </div>

                 <div className="h-14 bg-white/[0.03] rounded-2xl flex items-center px-4 relative group border border-dashed border-white/5">
                    <span className="absolute left-4 -top-5 text-[8px] font-bold text-indigo-400/40 uppercase tracking-widest">Audio Track 1</span>
                    {audioData && (
                      <div className="h-10 w-64 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center px-4 gap-3 cursor-grab">
                         <Music className="w-3 h-3 text-indigo-400" />
                         <span className="text-[9px] font-bold text-white uppercase truncate">Voiceover_Main_Track</span>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* Right Inspector - Properties & Adjustments */}
        <div className="w-80 bg-[#0a0d14] border-l border-white/5 p-6 flex flex-col gap-10 overflow-y-auto">
           <div className="space-y-6">
              <div className="flex items-center gap-2">
                 <Settings2 className="w-4 h-4 text-emerald-400" />
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Clip Inspector</h4>
              </div>
              
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase">Opacity</span>
                       <span className="text-[10px] font-mono text-primary">100%</span>
                    </div>
                    <Slider defaultValue={[100]} max={100} step={1} className="w-full" />
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase">Volume</span>
                       <span className="text-[10px] font-mono text-primary">80%</span>
                    </div>
                    <Slider defaultValue={[80]} max={100} step={1} className="w-full" />
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2">
                       <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">Speed</span>
                       <div className="h-11 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center font-bold text-xs">1.0x</div>
                    </div>
                    <div className="space-y-2">
                       <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">Scale</span>
                       <div className="h-11 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center font-bold text-xs">Fit</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="pt-8 border-t border-white/5 space-y-6">
              <div className="flex items-center gap-2">
                 <Layout className="w-4 h-4 text-indigo-400" />
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Canvas Settings</h4>
              </div>
              <div className="grid grid-cols-3 gap-2">
                 {['9:16', '16:9', '1:1'].map((ratio) => (
                   <Button key={ratio} variant="outline" className={cn(
                     "h-12 rounded-xl text-[10px] font-bold border-white/5",
                     ratio === '9:16' && "border-primary/50 text-primary bg-primary/5"
                   )}>
                     {ratio}
                   </Button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-500">
           <div className="text-center space-y-8 max-w-sm px-10">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <Loader2 className="w-20 h-20 animate-spin text-primary mx-auto relative z-10" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold font-headline text-white tracking-tight">{processingMessage}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] animate-pulse">Encoding Neural Assets</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
