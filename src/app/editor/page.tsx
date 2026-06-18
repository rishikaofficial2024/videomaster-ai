
"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pause, Play, SkipBack, SkipForward,
  Wand2, Download, Sparkles, ChevronLeft, Loader2, Video,
  Coins, Plus, RefreshCw, Cloud, Info,
  LayoutTemplate, Type, Box, Upload, Palette,
  Volume2, Image as ImageIcon, PenTool, Layers,
  Subtitles, BarChart4, TrendingUp, Tags, Music, Trash2, X, AlertTriangle, CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiVideoContentOptimization } from "@/ai/flows/ai-video-content-optimization-flow";
import { generateAiVideo } from "@/ai/flows/ai-video-generation-flow";
import { generateAiVoiceover } from "@/ai/flows/ai-voiceover-generation-flow";
import { generateAiScript } from "@/ai/flows/ai-script-writer-flow";
import { generateAiThumbnail } from "@/ai/flows/ai-thumbnail-designer-flow";
import { generateAutoCaptionsAndSubtitles } from "@/ai/flows/ai-auto-caption-and-subtitle-generation-flow";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import Image from "next/image";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { cn } from "@/lib/utils";
import audioDataPlaceholder from "@/app/lib/placeholder-audio.json";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("id");
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  
  const [projectId, setProjectId] = useState<string | null>(projectIdFromUrl);
  const [isNewProject, setIsNewProject] = useState(!projectIdFromUrl);
  
  const [title, setTitle] = useState("Untitled Design");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [activeTab, setActiveTab] = useState("ai");
  const [activeInspectorTab, setActiveInspectorTab] = useState("ai");
  
  const [videoData, setVideoData] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [bgMusicUrl, setBgMusicUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState<string | null>(null);
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  
  const [scriptTopic, setScriptTopic] = useState("");
  const [thumbnailPrompt, setThumbnailPrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [voiceText, setVoiceText] = useState("");
  
  const [aiScript, setAiScript] = useState<any>(null);
  const [seoData, setSeoData] = useState<any>(null);

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
      setTitle(project.title || "Untitled Design");
      setVideoData(project.videoDataUri || null);
      setAudioData(project.audioDataUri || null);
      setBgMusicUrl(project.backgroundMusicUrl || null);
      setThumbnailUrl(project.thumbnailUrl || null);
      setSubtitles(project.subtitles || null);
      setMediaAssets(project.mediaAssets || []);
      setAiScript(project.aiNotes ? { script: project.aiNotes } : null);
      if (project.optimizedTitle) {
        setSeoData({
          title: project.optimizedTitle,
          description: project.optimizedDescription,
          hashtags: project.hashtags
        });
      }
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
        title: "Credits Required",
        description: `This action costs ${cost} credits. Please watch an ad or upgrade.`,
        action: <Button variant="secondary" size="sm" onClick={() => router.push("/premium")}>Upgrade</Button>
      });
      return false;
    }
    return true;
  };

  const deductCredits = (cost: number) => {
    if (profile?.isPremium || !userProfileRef) return;
    const updateData = { credits: increment(-cost) };
    updateDoc(userProfileRef, updateData)
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userProfileRef.path,
          operation: 'update',
          requestResourceData: updateData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleSave = (extraData: any = {}) => {
    if (!user || !projectRef) return;
    setIsSaving(true);
    const data: any = {
      title,
      updatedAt: serverTimestamp(),
      status: "draft",
      ...extraData
    };
    
    if (!isNewProject) {
      updateDoc(projectRef, data)
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: projectRef.path,
            operation: 'update',
            requestResourceData: data
          } satisfies SecurityRuleContext);
          errorEmitter.emit("permission-error", permissionError);
        });
    } else {
      const createData = {
        ...data,
        createdAt: serverTimestamp(),
        thumbnailUrl: data.thumbnailUrl || thumbnailUrl || `https://picsum.photos/seed/${projectRef.id}/600/400`,
      };
      setDoc(projectRef, createData)
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: projectRef.path,
            operation: 'create',
            requestResourceData: createData
          } satisfies SecurityRuleContext);
          errorEmitter.emit("permission-error", permissionError);
        });
      setIsNewProject(false);
      if (!projectIdFromUrl) router.replace(`/editor?id=${projectRef.id}`);
    }
    
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic || !checkCredits(2)) return;
    setIsProcessing(true);
    setProcessingMessage("AI is crafting your viral script...");
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      setAiScript(result);
      deductCredits(2);
      handleSave({ aiNotes: result.script });
      toast({ title: "Success!", description: "Professional script generated." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Generation Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!thumbnailPrompt || !checkCredits(5)) return;
    setIsProcessing(true);
    setProcessingMessage("Designing cinematic thumbnail...");
    try {
      const result = await generateAiThumbnail({ prompt: thumbnailPrompt });
      setThumbnailUrl(result.thumbnailDataUri);
      deductCredits(5);
      handleSave({ thumbnailUrl: result.thumbnailDataUri });
      
      if (result.isAiGenerated === false) {
        toast({ 
          title: "Premium Fallback Used", 
          description: "Free Jugaad: AI model paid tha, isliye maine aapko Unsplash se professional photo dhund di hai!",
          duration: 5000 
        });
      } else {
        toast({ title: "Masterpiece Ready", description: "Your thumbnail has been designed by AI." });
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Design Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt || !checkCredits(20)) return;
    setIsProcessing(true);
    setProcessingMessage("Veo 2.0 is rendering your cinematic clip...");
    try {
      const result = await generateAiVideo({ prompt: videoPrompt });
      setVideoData(result.videoDataUri);
      deductCredits(20);
      handleSave({ videoDataUri: result.videoDataUri });
      toast({ title: "Clip Rendered", description: "Video successfully added." });
    } catch (e: any) {
      const msg = e.message || "";
      if (msg.includes("billing") || msg.includes("400")) {
        toast({ 
          variant: "destructive", 
          title: "⚠️ Billing Required for Video", 
          description: "Video generation (Veo 2.0) ke liye Google Cloud par Billing chalu karna zaroori hai. Please check INSTRUCTIONS_HINDI.md for steps.",
          duration: 10000
        });
      } else {
        toast({ variant: "destructive", title: "Rendering Failed", description: msg });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVoiceover = async () => {
    if (!voiceText || !checkCredits(5)) return;
    setIsProcessing(true);
    setProcessingMessage("Synthesizing narration...");
    try {
      const result = await generateAiVoiceover({ text: voiceText, voiceName: 'Algenib' });
      setAudioData(result.audioDataUri);
      deductCredits(5);
      handleSave({ audioDataUri: result.audioDataUri });
      toast({ title: "Audio Ready", description: "Voiceover track generated." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Audio Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptimizeContent = async () => {
    const transcript = aiScript?.script || voiceText || "General video content";
    if (!checkCredits(2)) return;
    setIsProcessing(true);
    setProcessingMessage("Analyzing content for viral SEO...");
    try {
      const result = await aiVideoContentOptimization({ videoTranscript: transcript });
      setSeoData(result);
      deductCredits(2);
      handleSave({ 
        optimizedTitle: result.title,
        optimizedDescription: result.description,
        hashtags: result.hashtags
      });
      toast({ title: "SEO Optimized", description: "Viral tags and titles added." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "SEO Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoCaption = async () => {
    if (!audioData || !checkCredits(10)) {
       toast({ title: "Audio Required", description: "Please generate a voiceover first." });
       return;
    }
    setIsProcessing(true);
    setProcessingMessage("AI Transcriber is generating subtitles...");
    try {
      const result = await generateAutoCaptionsAndSubtitles({ audioDataUri: audioData });
      setSubtitles(result.subtitles);
      deductCredits(10);
      handleSave({ subtitles: result.subtitles });
      toast({ title: "Subtitles Generated", description: "WebVTT track added to project." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Subtitle Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      const newAsset = {
        id: "asset-" + Math.random().toString(36).substring(2, 9),
        url: dataUri,
        type: file.type.startsWith('image') ? 'image' : 'video',
        label: file.name
      };
      const updatedAssets = [...mediaAssets, newAsset];
      setMediaAssets(updatedAssets);
      handleSave({ mediaAssets: updatedAssets });
      toast({ title: "Uploaded", description: `${file.name} added to library.` });
    };
    reader.readAsDataURL(file);
  };

  const deleteAsset = (id: string) => {
    const updatedAssets = mediaAssets.filter(a => a.id !== id);
    setMediaAssets(updatedAssets);
    handleSave({ mediaAssets: updatedAssets });
  };

  const addMusic = (url: string) => {
    setBgMusicUrl(url);
    handleSave({ backgroundMusicUrl: url });
    toast({ title: "Music Added", description: "Background track synchronized." });
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        audioRef.current?.pause();
        bgMusicRef.current?.pause();
      } else {
        videoRef.current.play();
        audioRef.current?.play();
        bgMusicRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="h-screen bg-[#05070a] flex flex-col overflow-hidden text-[#e1e4e8] font-body selection:bg-primary/30">
      <Navbar />
      
      <div className="h-14 border-b bg-[#0a0d14]/95 backdrop-blur-2xl px-4 flex items-center justify-between z-40 shrink-0 border-white/5">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-1.5 hover:bg-white/5 rounded-lg transition-colors group">
            <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleSave()}
                className="bg-transparent font-bold text-sm focus:outline-none border-b border-transparent focus:border-primary/50 w-48 truncate"
              />
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-muted-foreground font-mono">1080x1920</span>
            </div>
            <div className="flex items-center gap-2">
               {isSaving ? (
                 <div className="flex items-center gap-1">
                   <RefreshCw className="w-2.5 h-2.5 animate-spin text-primary" />
                   <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Auto-Saving</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-1">
                   <Cloud className="w-2.5 h-2.5 text-emerald-500" />
                   <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Cloud Sync Active</span>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className={cn("hidden md:flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20")}>
              <Coins className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold text-primary tracking-widest">{profile?.credits ?? 0} CREDITS</span>
           </div>
           <Button size="sm" className="h-9 px-6 rounded-xl font-bold bg-primary shadow-xl shadow-primary/20 gap-2 hover:scale-105 transition-all">
             <Download className="w-4 h-4" /> Export Video
           </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-20 bg-[#0a0d14] border-r border-white/5 flex flex-col items-center py-6 gap-6 z-30 shrink-0">
           {[
             { icon: Wand2, id: 'ai', label: 'AI Magic' },
             { icon: LayoutTemplate, id: 'templates', label: 'Designs' },
             { icon: Box, id: 'elements', label: 'Elements' },
             { icon: Music, id: 'audio', label: 'Audio' },
             { icon: Upload, id: 'uploads', label: 'Uploads' },
             { icon: Layers, id: 'layers', label: 'Layers' }
           ].map((item) => (
             <button key={item.id} className={cn(
               "flex flex-col items-center gap-1 w-full py-2 transition-all relative group",
               activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-white"
             )} onClick={() => setActiveTab(item.id)}>
               <div className={cn(
                 "p-2 rounded-xl transition-all",
                 activeTab === item.id ? "bg-primary/10" : "group-hover:bg-white/5"
               )}>
                 <item.icon className="w-5 h-5" />
               </div>
               <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
               {activeTab === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}
             </button>
           ))}
        </div>

        <div className="w-72 bg-[#0a0d14]/50 backdrop-blur-xl border-r border-white/5 flex flex-col shrink-0 overflow-hidden">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">{activeTab} Studio</h3>
              {activeTab === 'uploads' && (
                <label className="cursor-pointer">
                  <Plus className="w-4 h-4 text-primary" />
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
                </label>
              )}
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {activeTab === 'ai' && (
                 <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                       <div className="flex items-center gap-3">
                          <PenTool className="w-4 h-4 text-primary" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Viral Script AI</h4>
                       </div>
                       <textarea 
                          placeholder="What is your video about? (e.g., Comedy, Tech, Vlog)" 
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] h-24 focus:ring-1 focus:ring-primary outline-none resize-none transition-all placeholder:text-muted-foreground/30"
                          value={scriptTopic}
                          onChange={(e) => setScriptTopic(e.target.value)}
                       />
                       <Button className="w-full h-10 rounded-xl font-bold bg-primary text-[10px] uppercase" onClick={handleGenerateScript} disabled={isProcessing || !scriptTopic}>
                          {isProcessing && processingMessage.includes("script") ? <Loader2 className="animate-spin mr-2 w-3 h-3" /> : "Write Script"}
                       </Button>
                    </div>

                    <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-4">
                       <div className="flex items-center gap-3">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Cinematic Veo 2.0</h4>
                       </div>
                       <div className="bg-orange-500/10 border border-orange-500/20 p-2 rounded-lg flex items-start gap-2 mb-2">
                          <AlertTriangle className="w-3 h-3 text-orange-400 shrink-0 mt-0.5" />
                          <span className="text-[8px] text-orange-200">Veo 2.0 requires active GCP Billing.</span>
                       </div>
                       <textarea 
                          placeholder="Describe your scene for video generation..." 
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] h-24 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all"
                          value={videoPrompt}
                          onChange={(e) => setVideoPrompt(e.target.value)}
                       />
                       <Button className="w-full h-10 rounded-xl font-bold bg-indigo-600 text-[10px] uppercase" onClick={handleGenerateVideo} disabled={isProcessing || !videoPrompt}>
                          {isProcessing && processingMessage.includes("rendering") ? <Loader2 className="animate-spin mr-2 w-3 h-3" /> : "Generate Clip"}
                       </Button>
                    </div>
                 </div>
              )}

              {activeTab === 'audio' && (
                <div className="space-y-3">
                  {audioDataPlaceholder.tracks.map((track) => (
                    <div key={track.id} className="group p-3 rounded-xl bg-white/5 border border-transparent hover:border-primary/20 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20">
                          <Music className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-white truncate w-32">{track.title}</span>
                          <span className="text-[8px] text-muted-foreground uppercase">{track.genre} • {track.duration}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100" onClick={() => addMusic(track.url)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'uploads' && (
                <div className="grid grid-cols-2 gap-3">
                  {mediaAssets.map((asset) => (
                    <div key={asset.id} className="group relative aspect-square rounded-xl overflow-hidden border border-white/5 bg-black/40">
                      {asset.type === 'image' ? (
                        <Image src={asset.url} alt={asset.label} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Video className="w-6 h-6 text-muted-foreground opacity-20" />
                        </div>
                      )}
                      <button className="absolute top-1 right-1 p-1 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteAsset(asset.id)}>
                        <X className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all">
                    <Plus className="w-5 h-5 text-muted-foreground" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Upload</span>
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
                  </label>
                </div>
              )}
           </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-[#0c0f17] relative">
          <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden">
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             
             <div className="aspect-[9/16] h-[90%] bg-black rounded-lg shadow-[0_0_120px_rgba(0,0,0,0.8)] border-4 border-white/5 relative overflow-hidden flex items-center justify-center group/canvas">
                {!videoData && !thumbnailUrl ? (
                  <div className="text-center space-y-4 z-10">
                     <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-primary/20 animate-float">
                        <Video className="w-8 h-8 text-primary" />
                     </div>
                     <h3 className="text-sm font-bold font-headline uppercase tracking-[0.3em] text-white">Neural Canvas Ready</h3>
                  </div>
                ) : (
                  <>
                    {thumbnailUrl && !isPlaying && (
                      <Image src={thumbnailUrl} alt="Thumbnail" fill className="object-cover" />
                    )}
                    {videoData && (
                      <video 
                        ref={videoRef}
                        src={videoData} 
                        className={cn("w-full h-full object-cover", (!isPlaying && thumbnailUrl) ? "hidden" : "block")}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onClick={togglePlayback}
                      />
                    )}
                    {audioData && <audio ref={audioRef} src={audioData} hidden />}
                    {bgMusicUrl && <audio ref={bgMusicRef} src={bgMusicUrl} loop hidden />}
                  </>
                )}

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full opacity-0 group-hover/canvas:opacity-100 transition-all duration-300">
                   <Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><SkipBack className="w-4 h-4" /></Button>
                   <button onClick={togglePlayback} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110">
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                   </button>
                   <Button variant="ghost" size="icon" className="text-white/60 hover:text-white"><SkipForward className="w-4 h-4" /></Button>
                </div>
             </div>
          </div>

          <div className="h-48 bg-[#0a0d14] border-t border-white/5 flex flex-col shrink-0 z-40">
             <div className="h-10 bg-[#111621]/90 px-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Processing Engine: Operational</span>
                   </div>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground font-bold tracking-widest bg-white/5 px-3 py-1 rounded-lg">00:00:00:00</div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
                {[
                  { label: "V1: AI VIDEO", active: !!videoData, icon: Sparkles, color: "bg-primary/20 border-primary/40 text-primary" },
                  { label: "A1: VOICE OVER", active: !!audioData, icon: Volume2, color: "bg-indigo-500/20 border-indigo-500/40 text-indigo-400" },
                  { label: "A2: BG MUSIC", active: !!bgMusicUrl, icon: Music, color: "bg-purple-500/20 border-purple-500/40 text-purple-400" },
                  { label: "S1: SUBTITLES", active: !!subtitles, icon: Subtitles, color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" }
                ].map((track, i) => (
                  <div key={i} className="flex gap-3 h-10">
                     <div className="w-32 shrink-0 bg-[#161a25]/60 rounded-lg border border-white/5 flex items-center px-3 gap-2">
                        <track.icon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[8px] font-bold uppercase tracking-widest truncate">{track.label}</span>
                     </div>
                     <div className="flex-1 bg-black/20 rounded-lg relative border border-white/5">
                        {track.active && (
                          <div className={cn("absolute inset-y-1 left-4 right-12 rounded border-x-2 flex items-center px-3", track.color)}>
                             <div className="flex items-center gap-1 opacity-50 w-full">
                                {[...Array(40)].map((_, j) => (
                                  <div key={j} className="w-0.5 h-3 bg-current rounded-full" style={{ height: `${Math.random() * 80 + 20}%` }} />
                                ))}
                             </div>
                             <button className="absolute right-2 opacity-40 hover:opacity-100" onClick={() => {
                               if (track.label.includes("MUSIC")) { setBgMusicUrl(null); handleSave({ backgroundMusicUrl: null }); }
                               if (track.label.includes("VIDEO")) { setVideoData(null); handleSave({ videoDataUri: null }); }
                               if (track.label.includes("VOICE")) { setAudioData(null); handleSave({ audioDataUri: null }); }
                               if (track.label.includes("SUBTITLES")) { setSubtitles(null); handleSave({ subtitles: null }); }
                             }}>
                               <Trash2 className="w-3 h-3" />
                             </button>
                          </div>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="w-80 bg-[#0a0d14] border-l border-white/5 shrink-0 flex flex-col overflow-hidden">
           <Tabs value={activeInspectorTab} onValueChange={setActiveInspectorTab} className="flex-1 flex flex-col">
              <TabsList className="w-full h-14 bg-transparent border-b border-white/5 rounded-none grid grid-cols-2 p-0">
                 <TabsTrigger value="ai" className="rounded-none font-bold text-[9px] tracking-widest data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all uppercase">Design Tools</TabsTrigger>
                 <TabsTrigger value="seo" className="rounded-none font-bold text-[9px] tracking-widest uppercase">Viral SEO</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                 <TabsContent value="ai" className="mt-0 space-y-8">
                    <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/20 space-y-4">
                       <div className="flex items-center gap-3">
                          <Palette className="w-4 h-4 text-indigo-400" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Thumbnail Design AI</h4>
                       </div>
                       <div className="bg-primary/10 border border-primary/20 p-2 rounded-lg flex items-start gap-2 mb-2">
                          <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                          <span className="text-[8px] text-primary">Free Jugaad Active: Fallback images enabled.</span>
                       </div>
                       <textarea 
                          placeholder="Visual prompt for thumbnail generation..." 
                          className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-[11px] h-24 focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all"
                          value={thumbnailPrompt}
                          onChange={(e) => setThumbnailPrompt(e.target.value)}
                       />
                       <Button className="w-full h-12 rounded-2xl font-bold bg-indigo-600 text-[11px] uppercase" onClick={handleGenerateThumbnail} disabled={isProcessing || !thumbnailPrompt}>
                          {isProcessing && processingMessage.includes("designing") ? <Loader2 className="animate-spin mr-2" /> : "Generate Thumbnail"}
                       </Button>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 space-y-4">
                       <div className="flex items-center gap-3">
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">AI Voiceover</h4>
                       </div>
                       <textarea 
                          placeholder="Paste text for professional narration..." 
                          className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-[11px] h-24 focus:ring-1 focus:ring-emerald-500 outline-none resize-none transition-all"
                          value={voiceText}
                          onChange={(e) => setVoiceText(e.target.value)}
                       />
                       <Button className="w-full h-12 rounded-2xl font-bold bg-emerald-600 text-[11px] uppercase" onClick={handleGenerateVoiceover} disabled={isProcessing || !voiceText}>
                          {isProcessing && processingMessage.includes("synthesizing") ? <Loader2 className="animate-spin mr-2" /> : "Generate Voiceover"}
                       </Button>
                    </div>
                 </TabsContent>

                 <TabsContent value="seo" className="mt-0 space-y-8">
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Viral Hub</h4>
                          <Button size="sm" variant="outline" className="h-8 rounded-full text-[10px] font-bold uppercase border-primary/20 text-primary hover:bg-primary/5" onClick={handleOptimizeContent}>
                             <TrendingUp className="w-3 h-3 mr-2" /> Run AI Audit
                          </Button>
                       </div>

                       {seoData ? (
                         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="p-5 rounded-[1.5rem] bg-primary/5 border border-primary/20 space-y-3">
                               <div className="flex items-center gap-2">
                                  <BarChart4 className="w-3.5 h-3.5 text-primary" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Viral Title Suggestion</span>
                               </div>
                               <p className="text-xs font-bold leading-relaxed">{seoData.title}</p>
                            </div>

                            <div className="p-5 rounded-[1.5rem] bg-white/5 border border-white/10 space-y-3">
                               <div className="flex items-center gap-2">
                                  <Tags className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hashtags</span>
                               </div>
                               <div className="flex flex-wrap gap-2">
                                  {seoData.hashtags?.map((tag: string, i: number) => (
                                    <span key={i} className="text-[9px] bg-white/5 px-2 py-1 rounded-full border border-white/5 text-muted-foreground font-mono">#{tag}</span>
                                  ))}
                               </div>
                            </div>
                         </div>
                       ) : (
                         <div className="p-12 text-center space-y-4 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                            <BarChart4 className="w-10 h-10 text-muted-foreground mx-auto opacity-20" />
                            <p className="text-[10px] text-muted-foreground font-medium italic">Audit needs a script or voiceover to analyze.</p>
                         </div>
                       )}
                    </div>
                 </TabsContent>
              </div>
           </Tabs>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-12">
           <div className="max-w-md w-full text-center space-y-10">
             <div className="relative w-40 h-40 mx-auto">
                <Loader2 className="w-40 h-40 animate-spin text-primary opacity-10" />
                <div className="absolute inset-0 m-auto w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-[0_0_100px_rgba(59,130,246,0.5)]">
                   <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>
             </div>
             <div className="space-y-4">
               <h3 className="text-4xl font-headline font-bold text-white tracking-tighter uppercase italic">Neural Processing</h3>
               <p className="text-muted-foreground font-medium text-lg italic">{processingMessage}</p>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
