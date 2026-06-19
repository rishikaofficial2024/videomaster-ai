
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
  Subtitles, BarChart4, TrendingUp, Tags, Music, Trash2, X, AlertTriangle, CheckCircle2,
  Tv, MessageSquare, Mic2, Star
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
  
  const [title, setTitle] = useState("Naya Design");
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
      setTitle(project.title || "Naya Design");
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
        title: "Credits Khatam!",
        description: `Ye kaam karne ke liye ${cost} credits chahiye. Ad dekho ya upgrade karo.`,
        action: <Button variant="secondary" size="sm" onClick={() => router.push("/premium")}>Paisa Bachao</Button>
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

  const formatAiError = (error: any) => {
    const msg = error.message || "";
    if (msg.includes("503") || msg.includes("UNAVAILABLE")) {
      return "⚠️ Google servers busy hain. Please 1 minute baad try karein.";
    }
    if (msg.includes("400") || msg.includes("billing")) {
      return "⚠️ Video ke liye Google Billing zaroori hai. Instructions dekhein.";
    }
    return msg || "AI generator mein kuch dikkat aayi.";
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic || !checkCredits(2)) return;
    setIsProcessing(true);
    setProcessingMessage("Mast viral script likh raha hoon...");
    try {
      const result = await generateAiScript({ topic: scriptTopic, platform: 'YouTube' });
      setAiScript(result);
      deductCredits(2);
      handleSave({ aiNotes: result.script });
      toast({ title: "Sikhlo!", description: "AI ne gazab script likhi hai." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: formatAiError(e) });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!thumbnailPrompt || !checkCredits(5)) return;
    setIsProcessing(true);
    setProcessingMessage("Filmi thumbnail design ho raha hai...");
    try {
      const result = await generateAiThumbnail({ prompt: thumbnailPrompt });
      setThumbnailUrl(result.thumbnailDataUri);
      deductCredits(5);
      handleSave({ thumbnailUrl: result.thumbnailDataUri });
      
      if (result.isAiGenerated === false) {
        toast({ 
          title: "Free Jugaad Zindabad!", 
          description: "Maine Unsplash se ek professional photo dhund di hai!",
          duration: 5000 
        });
      } else {
        toast({ title: "Gazab!", description: "Thumbnail ekdum ready hai." });
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: formatAiError(e) });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt || !checkCredits(20)) return;
    setIsProcessing(true);
    setProcessingMessage("AI clip render ho rahi hai...");
    try {
      const result = await generateAiVideo({ prompt: videoPrompt });
      setVideoData(result.videoDataUri);
      deductCredits(20);
      handleSave({ videoDataUri: result.videoDataUri });
      toast({ title: "Video Ready!", description: "Clip ban gayi hai." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: formatAiError(e) });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVoiceover = async () => {
    if (!voiceText || !checkCredits(5)) return;
    setIsProcessing(true);
    setProcessingMessage("Awaaz generate ho rahi hai...");
    try {
      const result = await generateAiVoiceover({ text: voiceText, voiceName: 'Algenib' });
      setAudioData(result.audioDataUri);
      deductCredits(5);
      handleSave({ audioDataUri: result.audioDataUri });
      toast({ title: "Voice Ready!", description: "Awaaz track jud gaya hai." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: formatAiError(e) });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptimizeContent = async () => {
    const transcript = aiScript?.script || voiceText || "General content";
    if (!checkCredits(2)) return;
    setIsProcessing(true);
    setProcessingMessage("Viral hone ke liye SEO audit...");
    try {
      const result = await aiVideoContentOptimization({ videoTranscript: transcript });
      setSeoData(result);
      deductCredits(2);
      handleSave({ 
        optimizedTitle: result.title,
        optimizedDescription: result.description,
        hashtags: result.hashtags
      });
      toast({ title: "Viral Ready!", description: "SEO tags aur titles jud gaye." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: formatAiError(e) });
    } finally {
      setIsProcessing(false);
    }
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
      
      {/* Top Bar - Simplified */}
      <div className="h-16 border-b bg-[#0a0d14]/95 backdrop-blur-2xl px-6 flex items-center justify-between z-40 shrink-0 border-white/5 shadow-lg">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-2xl transition-all group">
            <ChevronLeft className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
          <div className="flex flex-col">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleSave()}
              className="bg-transparent font-bold text-lg focus:outline-none border-b border-transparent focus:border-primary/50 w-64 truncate"
              placeholder="Design ka naam"
            />
            <div className="flex items-center gap-2">
               {isSaving ? (
                 <span className="text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">Save ho raha hai...</span>
               ) : (
                 <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">Saved in Cloud</span>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden lg:flex items-center gap-3 bg-primary/10 px-5 py-2 rounded-2xl border border-primary/20">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary tracking-widest uppercase">{profile?.credits ?? 0} Credits</span>
           </div>
           <Button size="lg" className="h-12 px-8 rounded-2xl font-bold bg-primary shadow-2xl shadow-primary/30 gap-2 hover:scale-105 transition-all">
             <Download className="w-5 h-5" /> Export Karein
           </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Simplified Sidebar */}
        <div className="w-24 bg-[#0a0d14] border-r border-white/5 flex flex-col items-center py-8 gap-8 z-30 shrink-0 shadow-2xl">
           {[
             { icon: Wand2, id: 'ai', label: 'AI Magic' },
             { icon: LayoutTemplate, id: 'templates', label: 'Designs' },
             { icon: Music, id: 'audio', label: 'Audio' },
             { icon: Upload, id: 'uploads', label: 'Upload' },
             { icon: Layers, id: 'layers', label: 'Perat' }
           ].map((item) => (
             <button key={item.id} className={cn(
               "flex flex-col items-center gap-2 w-full py-2 transition-all relative group",
               activeTab === item.id ? "text-primary scale-110" : "text-muted-foreground hover:text-white"
             )} onClick={() => setActiveTab(item.id)}>
               <div className={cn(
                 "p-3 rounded-2xl transition-all shadow-sm",
                 activeTab === item.id ? "bg-primary/20 text-primary border border-primary/20" : "group-hover:bg-white/5"
               )}>
                 <item.icon className="w-6 h-6" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
               {activeTab === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-r-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />}
             </button>
           ))}
        </div>

        {/* Content Panel - Easier to read */}
        <div className="w-80 bg-[#0a0d14]/50 backdrop-blur-3xl border-r border-white/5 flex flex-col shrink-0 overflow-hidden shadow-xl">
           <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white italic">{activeTab} Tools</h3>
              {activeTab === 'uploads' && (
                <label className="cursor-pointer p-2 bg-primary/10 rounded-xl hover:bg-primary/20 transition-all">
                  <Plus className="w-5 h-5 text-primary" />
                  <input type="file" className="hidden" onChange={(e) => {}} accept="image/*,video/*" />
                </label>
              )}
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {activeTab === 'ai' && (
                 <div className="space-y-8">
                    {/* Step 1 */}
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold">1</div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Mast Script Likho</h4>
                       </div>
                       <div className="p-5 rounded-[2rem] bg-primary/5 border border-primary/20 space-y-4 hover:bg-primary/10 transition-all">
                          <textarea 
                             placeholder="Video kis baare mein hai? (e.g. Cooking, Tech, Vlog)" 
                             className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs h-28 focus:ring-2 focus:ring-primary/50 outline-none resize-none transition-all placeholder:text-muted-foreground/40"
                             value={scriptTopic}
                             onChange={(e) => setScriptTopic(e.target.value)}
                          />
                          <Button className="w-full h-12 rounded-2xl font-bold bg-primary text-xs uppercase shadow-lg shadow-primary/20" onClick={handleGenerateScript} disabled={isProcessing || !scriptTopic}>
                             {isProcessing && processingMessage.includes("script") ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : "Script Banao"}
                          </Button>
                       </div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">2</div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-white">AI Video Banao</h4>
                       </div>
                       <div className="p-5 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/20 space-y-4 hover:bg-indigo-500/10 transition-all">
                          <textarea 
                             placeholder="Scene describe karo (e.g. Robot dancing in jungle)" 
                             className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs h-28 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none transition-all"
                             value={videoPrompt}
                             onChange={(e) => setVideoPrompt(e.target.value)}
                          />
                          <Button className="w-full h-12 rounded-2xl font-bold bg-indigo-600 text-xs uppercase shadow-lg shadow-indigo-600/20" onClick={handleGenerateVideo} disabled={isProcessing || !videoPrompt}>
                             {isProcessing && processingMessage.includes("rendering") ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : "Clip Generate"}
                          </Button>
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === 'audio' && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Mast Music Select Karein</h4>
                  <div className="space-y-3">
                    {audioDataPlaceholder.tracks.map((track) => (
                      <div key={track.id} className="group p-4 rounded-[1.5rem] bg-white/5 border border-transparent hover:border-primary/20 transition-all flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                            <Music className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white truncate w-32">{track.title}</span>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-widest">{track.genre} • {track.duration}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="w-5 h-5 text-primary" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
           </div>
        </div>

        {/* Neural Canvas - Big & Clear Preview */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0c0f17] relative">
          <div className="flex-1 relative flex items-center justify-center p-8 md:p-16 overflow-hidden">
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }} />
             
             <div className="aspect-[9/16] h-full max-h-[85vh] bg-black rounded-[3rem] shadow-[0_0_120px_rgba(0,0,0,1)] border-[8px] border-white/5 relative overflow-hidden flex items-center justify-center group/canvas transition-transform duration-500 hover:scale-[1.02]">
                {!videoData && !thumbnailUrl ? (
                  <div className="text-center space-y-6 z-10 p-12">
                     <div className="w-24 h-24 bg-primary/20 rounded-[3rem] flex items-center justify-center mx-auto mb-8 border border-primary/20 animate-float shadow-2xl">
                        <Video className="w-10 h-10 text-primary" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-lg font-bold font-headline uppercase tracking-[0.4em] text-white">Yahan Video Dikhegi</h3>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-40 italic">Pehle AI se kuch generate karein</p>
                     </div>
                  </div>
                ) : (
                  <>
                    {thumbnailUrl && !isPlaying && (
                      <Image src={thumbnailUrl} alt="Thumbnail" fill className="object-cover" priority />
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
                  </>
                )}

                {/* Simplified Playback Controls */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-black/70 backdrop-blur-3xl border border-white/10 px-8 py-4 rounded-[2.5rem] opacity-0 group-hover/canvas:opacity-100 transition-all duration-500 translate-y-4 group-hover/canvas:translate-y-0 shadow-2xl">
                   <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:scale-110 transition-transform"><SkipBack className="w-5 h-5" /></Button>
                   <button onClick={togglePlayback} className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(59,130,246,0.5)] transition-all hover:scale-110 active:scale-95">
                      {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                   </button>
                   <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:scale-110 transition-transform"><SkipForward className="w-5 h-5" /></Button>
                </div>
             </div>
          </div>

          {/* Simplified Timeline */}
          <div className="h-44 bg-[#0a0d14] border-t border-white/5 flex flex-col shrink-0 z-40 shadow-2xl">
             <div className="h-12 bg-[#111621]/90 px-8 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-slow shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">System Ready</span>
                   </div>
                </div>
                <div className="text-xs font-mono text-muted-foreground font-bold tracking-widest bg-white/5 px-4 py-1.5 rounded-xl border border-white/5">00:00:00:00</div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                {[
                  { label: "V1: AI CLIP", active: !!videoData, icon: Sparkles, color: "bg-primary/20 border-primary/30 text-primary" },
                  { label: "A1: VOICE OVER", active: !!audioData, icon: Volume2, color: "bg-indigo-500/20 border-indigo-500/30 text-indigo-400" },
                  { label: "A2: MUSIC", active: !!bgMusicUrl, icon: Music, color: "bg-purple-500/20 border-purple-500/30 text-purple-400" }
                ].map((track, i) => (
                  <div key={i} className="flex gap-4 h-12">
                     <div className="w-40 shrink-0 bg-[#161a25]/60 rounded-2xl border border-white/5 flex items-center px-4 gap-3 shadow-sm">
                        <track.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-[9px] font-bold uppercase tracking-widest truncate">{track.label}</span>
                     </div>
                     <div className="flex-1 bg-black/20 rounded-2xl relative border border-white/5 overflow-hidden">
                        {track.active && (
                          <div className={cn("absolute inset-y-1.5 left-4 right-12 rounded-xl border flex items-center px-4 shadow-lg animate-in fade-in slide-in-from-left-4 duration-500", track.color)}>
                             <div className="flex items-center gap-1.5 opacity-30 w-full">
                                {[...Array(60)].map((_, j) => (
                                  <div key={j} className="w-0.5 bg-current rounded-full" style={{ height: `${Math.random() * 60 + 20}%` }} />
                                ))}
                             </div>
                             <button className="absolute right-4 p-2 bg-black/20 rounded-xl hover:bg-black/40 transition-colors" onClick={() => {}}>
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Panel - Design & SEO */}
        <div className="w-80 bg-[#0a0d14] border-l border-white/5 shrink-0 flex flex-col overflow-hidden shadow-2xl">
           <Tabs value={activeInspectorTab} onValueChange={setActiveInspectorTab} className="flex-1 flex flex-col">
              <TabsList className="w-full h-16 bg-transparent border-b border-white/5 rounded-none grid grid-cols-2 p-0">
                 <TabsTrigger value="ai" className="rounded-none font-bold text-[10px] tracking-widest data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all uppercase">3. Design & Awaaz</TabsTrigger>
                 <TabsTrigger value="seo" className="rounded-none font-bold text-[10px] tracking-widest uppercase">Viral Hone Ke Tips</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                 <TabsContent value="ai" className="mt-0 space-y-10">
                    {/* Thumbnail Step */}
                    <div className="p-6 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/20 space-y-5 shadow-sm">
                       <div className="flex items-center gap-3">
                          <Palette className="w-5 h-5 text-indigo-400" />
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 italic">3a. Thumbnail Banao</h4>
                       </div>
                       <textarea 
                          placeholder="Photo mein kya dikhna chahiye? (e.g. A happy boy with money)" 
                          className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs h-28 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none transition-all"
                          value={thumbnailPrompt}
                          onChange={(e) => setThumbnailPrompt(e.target.value)}
                       />
                       <Button className="w-full h-14 rounded-2xl font-bold bg-indigo-600 text-xs uppercase shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all" onClick={handleGenerateThumbnail} disabled={isProcessing || !thumbnailPrompt}>
                          {isProcessing && processingMessage.includes("designing") ? <Loader2 className="animate-spin mr-2" /> : "Thumbnail Banao"}
                       </Button>
                    </div>

                    {/* Voiceover Step */}
                    <div className="p-6 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 space-y-5 shadow-sm">
                       <div className="flex items-center gap-3">
                          <Mic2 className="w-5 h-5 text-emerald-400" />
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 italic">3b. AI Voice Daalo</h4>
                       </div>
                       <textarea 
                          placeholder="Video mein kya bolna hai? Yahan paste karein..." 
                          className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs h-28 focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none transition-all"
                          value={voiceText}
                          onChange={(e) => setVoiceText(e.target.value)}
                       />
                       <Button className="w-full h-14 rounded-2xl font-bold bg-emerald-600 text-xs uppercase shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all" onClick={handleGenerateVoiceover} disabled={isProcessing || !voiceText}>
                          {isProcessing && processingMessage.includes("synthesizing") ? <Loader2 className="animate-spin mr-2" /> : "Awaaz Daalo"}
                       </Button>
                    </div>
                 </TabsContent>

                 <TabsContent value="seo" className="mt-0 space-y-10">
                    <div className="space-y-8">
                       <div className="flex items-center justify-between">
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">SEO Master</h4>
                          <Button size="sm" variant="outline" className="h-10 rounded-full text-[10px] font-bold uppercase border-primary/30 text-primary hover:bg-primary/10 px-5" onClick={handleOptimizeContent}>
                             <TrendingUp className="w-4 h-4 mr-2" /> Check Karo
                          </Button>
                       </div>

                       {seoData ? (
                         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/20 space-y-4 shadow-sm">
                               <div className="flex items-center gap-3">
                                  <Star className="w-4 h-4 text-primary fill-current" />
                                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Viral Title Suggestion</span>
                               </div>
                               <p className="text-sm font-bold leading-relaxed text-white italic">"{seoData.title}"</p>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-4 shadow-sm">
                               <div className="flex items-center gap-3">
                                  <Tags className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Best Hashtags</span>
                               </div>
                               <div className="flex flex-wrap gap-2.5">
                                  {seoData.hashtags?.map((tag: string, i: number) => (
                                    <span key={i} className="text-[10px] bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-muted-foreground font-mono font-bold">#{tag}</span>
                                  ))}
                               </div>
                            </div>
                         </div>
                       ) : (
                         <div className="p-16 text-center space-y-6 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 opacity-60">
                            <BarChart4 className="w-12 h-12 text-muted-foreground mx-auto opacity-30" />
                            <p className="text-xs text-muted-foreground font-medium italic">SEO tips ke liye pehle script generate karein.</p>
                         </div>
                       )}
                    </div>
                 </TabsContent>
              </div>
           </Tabs>
        </div>
      </div>

      {/* Simplified Processing Screen */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-12">
           <div className="max-w-md w-full text-center space-y-12">
             <div className="relative w-48 h-48 mx-auto">
                <Loader2 className="w-48 h-48 animate-spin text-primary opacity-10" />
                <div className="absolute inset-0 m-auto w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-[0_0_120px_rgba(59,130,246,0.6)] animate-float">
                   <Sparkles className="w-12 h-12 text-white" />
                </div>
             </div>
             <div className="space-y-6">
               <h3 className="text-5xl font-headline font-bold text-white tracking-tighter uppercase italic">Thoda Rukiye...</h3>
               <p className="text-muted-foreground font-medium text-xl italic animate-pulse">{processingMessage}</p>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
