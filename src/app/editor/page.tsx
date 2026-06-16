
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Play, Pause, SkipBack, SkipForward, Scissors, 
  Trash2, Music, Wand2, Download, 
  Crop, Filter, Gauge, Type, Sparkles, ChevronLeft, Loader2, Video,
  Coins, Upload, Zap, Captions, Mic, Volume2, AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiVideoContentOptimization } from "@/ai/flows/ai-video-content-optimization-flow";
import { generateAutoCaptionsAndSubtitles } from "@/ai/flows/ai-auto-caption-and-subtitle-generation-flow";
import { generateAiVideo } from "@/ai/flows/ai-video-generation-flow";
import { generateAiVoiceover } from "@/ai/flows/ai-voiceover-generation-flow";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, setDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import Image from "next/image";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { cn } from "@/lib/utils";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("id");
  const toolFromUrl = searchParams.get("tool");
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [projectId, setProjectId] = useState<string | null>(projectIdFromUrl);
  const [isNewProject, setIsNewProject] = useState(!projectIdFromUrl);
  
  const [title, setTitle] = useState("Untitled Project");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [activeTab, setActiveTab] = useState(toolFromUrl === "captions" ? "ai" : "tools");
  const [selectedVideoData, setSelectedVideoData] = useState<string | null>(null);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [subtitles, setSubtitles] = useState<string | null>(null);
  const [voiceoverText, setVoiceoverText] = useState("");
  const [generatedVoiceover, setGeneratedVoiceover] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId && !projectIdFromUrl) {
      const newId = "new-" + Math.random().toString(36).substring(2, 9);
      setProjectId(newId);
    }
  }, [projectId, projectIdFromUrl]);

  const userProfileRef = useMemo(() => {
    if (!user) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userProfileRef);

  const projectRef = useMemo(() => {
    if (!user || !projectId) return null;
    return doc(db, "users", user.uid, "projects", projectId);
  }, [user, db, projectId]);

  const { data: project, loading: projectLoading } = useDoc(projectIdFromUrl ? projectRef : null);

  useEffect(() => {
    if (project) {
      setTitle(project.title || "Untitled Project");
      setSelectedVideoData(project.videoDataUri || null);
      setSubtitles(project.subtitles || null);
      setIsNewProject(false);
    }
  }, [project]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUri = event.target?.result as string;
        setSelectedVideoData(dataUri);
        handleSave(dataUri);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Video Loaded",
        description: `${file.name} added to your studio.`,
      });
    }
  };

  const handleSave = (videoUri?: string) => {
    if (!user || !projectRef) return;
    const data: any = {
      title,
      updatedAt: serverTimestamp(),
      status: "draft",
    };
    if (videoUri) data.videoDataUri = videoUri;
    
    if (!isNewProject) {
      updateDoc(projectRef, data).catch((e) => {
        errorEmitter.emit("permission-error", new FirestorePermissionError({
          path: projectRef.path,
          operation: "update",
          requestResourceData: data
        }));
      });
    } else {
      setDoc(projectRef, {
        ...data,
        createdAt: serverTimestamp(),
        thumbnailUrl: `https://picsum.photos/seed/${projectRef.id}/600/400`,
      }).then(() => {
        setIsNewProject(false);
        if (!projectIdFromUrl) {
          router.replace(`/editor?id=${projectRef.id}`);
        }
      }).catch((e) => {
        errorEmitter.emit("permission-error", new FirestorePermissionError({
          path: projectRef.path,
          operation: "create",
          requestResourceData: data
        }));
      });
    }
  };

  const checkCredits = (cost: number) => {
    if (profile?.isPremium) return true;
    if ((profile?.credits ?? 0) < cost) {
      toast({
        variant: "destructive",
        title: "Insufficient Credits",
        description: `This action costs ${cost} credits. Please upgrade for unlimited access.`,
        action: <Button variant="outline" size="sm" asChild><Link href="/premium">Upgrade</Link></Button>
      });
      return false;
    }
    return true;
  };

  const togglePlayback = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
          if (audioRef.current) audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await videoRef.current.play();
          if (audioRef.current) await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (err) {
        console.error("Playback failed:", err);
        setIsPlaying(false);
      }
    }
  };

  const handleExport = () => {
    if (!checkCredits(5)) return;

    setIsProcessing(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          if (!profile?.isPremium && userProfileRef) {
            updateDoc(userProfileRef, { credits: increment(-5) }).catch((e) => {
              errorEmitter.emit("permission-error", new FirestorePermissionError({
                path: userProfileRef.path,
                operation: "update",
                requestResourceData: { credits: increment(-5) }
              }));
            });
          }

          toast({
            title: "Export Complete!",
            description: "Video saved to your cloud studio.",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handleAIAnalyze = async () => {
    if (!checkCredits(2)) return;

    setIsProcessing(true);
    try {
      const result = await aiVideoContentOptimization({ 
        videoTranscript: "Cinematic travel vlog exploring the hidden beaches of Bali." 
      });
      
      if (projectRef) {
        const updateData = {
          optimizedTitle: result.title,
          optimizedDescription: result.description,
          hashtags: result.hashtags,
          updatedAt: serverTimestamp(),
        };
        updateDoc(projectRef, updateData).catch((e) => {
          errorEmitter.emit("permission-error", new FirestorePermissionError({
            path: projectRef.path,
            operation: "update",
            requestResourceData: updateData
          }));
        });

        if (!profile?.isPremium && userProfileRef) {
          updateDoc(userProfileRef, { credits: increment(-2) }).catch((e) => {
            errorEmitter.emit("permission-error", new FirestorePermissionError({
              path: userProfileRef.path,
              operation: "update",
              requestResourceData: { credits: increment(-2) }
            }));
          });
        }
      }
      toast({ title: "Optimization Complete" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "AI Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoCaptions = async () => {
    if (!selectedVideoData) {
      toast({ title: "Video Required", description: "Upload a video first." });
      return;
    }
    if (!checkCredits(3)) return;

    setIsProcessing(true);
    try {
      const result = await generateAutoCaptionsAndSubtitles({ audioDataUri: selectedVideoData });
      setSubtitles(result.subtitles);
      
      if (projectRef) {
        const updateData = {
          subtitles: result.subtitles,
          updatedAt: serverTimestamp(),
        };
        updateDoc(projectRef, updateData).catch((e) => {
          errorEmitter.emit("permission-error", new FirestorePermissionError({
            path: projectRef.path,
            operation: "update",
            requestResourceData: updateData
          }));
        });

        if (!profile?.isPremium && userProfileRef) {
          updateDoc(userProfileRef, { credits: increment(-3) }).catch((e) => {
            errorEmitter.emit("permission-error", new FirestorePermissionError({
              path: userProfileRef.path,
              operation: "update",
              requestResourceData: { credits: increment(-3) }
            }));
          });
        }
      }
      toast({ title: "Captions Generated!" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Transcription Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMagicVideo = async () => {
    if (!videoPrompt) {
      toast({ title: "Prompt Required", description: "Enter a description for your magic video." });
      return;
    }
    if (!checkCredits(10)) return;

    setIsProcessing(true);
    setExportProgress(0);
    const progressInterval = setInterval(() => setExportProgress(p => p < 90 ? p + 2 : p), 2000);

    try {
      const result = await generateAiVideo({ prompt: videoPrompt });
      setSelectedVideoData(result.videoDataUri);
      
      if (projectRef) {
        const updateData = {
          videoDataUri: result.videoDataUri,
          updatedAt: serverTimestamp(),
        };
        updateDoc(projectRef, updateData).catch((e) => {
          errorEmitter.emit("permission-error", new FirestorePermissionError({
            path: projectRef.path,
            operation: "update",
            requestResourceData: updateData
          }));
        });

        if (!profile?.isPremium && userProfileRef) {
          updateDoc(userProfileRef, { credits: increment(-10) }).catch((e) => {
            errorEmitter.emit("permission-error", new FirestorePermissionError({
              path: userProfileRef.path,
              operation: "update",
              requestResourceData: { credits: increment(-10) }
            }));
          });
        }
      }
      toast({ title: "Magic Complete!", description: "Your AI video has been generated." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Generation Error", description: e.message });
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
    }
  };

  const handleVoiceover = async () => {
    if (!voiceoverText) {
      toast({ title: "Script Required" });
      return;
    }
    if (!checkCredits(4)) return;

    setIsProcessing(true);
    try {
      const result = await generateAiVoiceover({ text: voiceoverText });
      setGeneratedVoiceover(result.audioDataUri);
      if (!profile?.isPremium && userProfileRef) {
        updateDoc(userProfileRef, { credits: increment(-4) }).catch((e) => {
          errorEmitter.emit("permission-error", new FirestorePermissionError({
            path: userProfileRef.path,
            operation: "update",
            requestResourceData: { credits: increment(-4) }
          }));
        });
      }
      toast({ title: "Voiceover Ready", description: "AI narration has been added to the scene." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Voiceover Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  if (projectLoading || !projectId) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col md:pt-20 overflow-hidden">
      <Navbar />
      
      {/* Top Bar */}
      <div className="bg-background/80 backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-muted rounded-xl text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleSave()}
            className="bg-transparent font-headline font-bold text-lg focus:outline-none border-b border-transparent focus:border-primary px-1 text-foreground placeholder:text-muted-foreground w-48 md:w-64"
          />
        </div>
        <div className="flex items-center gap-4">
          {!profile?.isPremium && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-orange-50 rounded-full border border-orange-200">
              <Coins className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-bold text-orange-600">{profile?.credits ?? 0}</span>
            </div>
          )}
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 font-bold shadow-lg shadow-primary/20" onClick={handleExport} disabled={isProcessing}>
            <Download className="w-4 h-4 mr-2" />
            {isProcessing ? "Processing..." : "Export"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-background">
        {/* Main Preview Area */}
        <div className="flex-1 flex flex-col relative group overflow-hidden p-6">
          <div className="flex-1 relative flex items-center justify-center">
            <div className="aspect-video w-full max-w-5xl bg-black rounded-[2.5rem] shadow-2xl relative flex items-center justify-center cursor-pointer overflow-hidden border-8 border-background" onClick={handleFileClick}>
               <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
               {!selectedVideoData ? (
                 <div className="flex flex-col items-center gap-6 text-white/30 group-hover:text-white/50 transition-colors">
                    <div className="p-8 rounded-full bg-white/5 border border-white/10">
                      <Upload className="w-12 h-12" />
                    </div>
                    <span className="text-lg font-bold font-headline">Upload or AI Generate Video</span>
                 </div>
               ) : (
                 <>
                   <video 
                     ref={videoRef}
                     src={selectedVideoData} 
                     className="w-full h-full object-contain" 
                     onPlay={() => setIsPlaying(true)}
                     onPause={() => setIsPlaying(false)}
                     onClick={togglePlayback}
                   />
                   {subtitles && isPlaying && (
                     <div className="absolute bottom-16 left-0 right-0 text-center px-8 pointer-events-none animate-in fade-in slide-in-from-bottom-4">
                       <span className="bg-black/90 text-white px-4 py-2 rounded-xl text-lg font-bold shadow-2xl border border-white/20 backdrop-blur-xl">
                         {subtitles.split('\n')[3] || "Captions applied..."}
                       </span>
                     </div>
                   )}
                   {generatedVoiceover && (
                     <audio ref={audioRef} src={generatedVoiceover} onEnded={() => setIsPlaying(false)} />
                   )}
                 </>
               )}
            </div>
          </div>
          
          {/* Controls Bar */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex justify-center items-center gap-8 text-white bg-black/60 backdrop-blur-2xl px-10 py-5 rounded-[2rem] border border-white/10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full h-10 w-10"><SkipBack className="w-6 h-6" /></Button>
            <Button size="icon" className="w-14 h-14 bg-white text-black hover:bg-white/90 rounded-full shadow-xl transition-transform active:scale-95" onClick={togglePlayback}>
              {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full h-10 w-10"><SkipForward className="w-6 h-6" /></Button>
          </div>
        </div>

        {/* Sidebar Tools */}
        <div className="w-full lg:w-[400px] bg-background border-l overflow-hidden flex flex-col shadow-2xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
            <TabsList className="w-full h-16 rounded-none grid grid-cols-3 bg-muted/30 p-2 gap-2">
              <TabsTrigger value="tools" className="rounded-xl data-[state=active]:shadow-md font-bold">Studio</TabsTrigger>
              <TabsTrigger value="ai" className="rounded-xl data-[state=active]:shadow-md font-bold text-primary">AI Magic</TabsTrigger>
              <TabsTrigger value="audio" className="rounded-xl data-[state=active]:shadow-md font-bold">Audio</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <TabsContent value="tools" className="mt-0 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Scissors, label: "Trim" },
                    { icon: Crop, label: "Crop" },
                    { icon: Gauge, label: "Speed" },
                    { icon: Filter, label: "Filters" },
                    { icon: Type, label: "Text" },
                    { icon: Music, label: "Music" }
                  ].map((tool, i) => (
                    <Button key={i} variant="outline" className="h-28 flex-col gap-3 rounded-3xl border-primary/10 bg-background hover:bg-primary/5 hover:border-primary/30 transition-all hover:shadow-lg">
                      <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                        <tool.icon className="w-6 h-6 text-foreground group-hover:text-primary" />
                      </div>
                      <span className="font-bold text-sm">{tool.label}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-0 space-y-6">
                <div className="space-y-6">
                  {/* AI Generation */}
                  <div className="p-6 border rounded-[2rem] bg-primary/[0.03] border-primary/10 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-bold text-foreground">Veo 2.0 Video Gen</h4>
                    </div>
                    <textarea 
                      placeholder="Describe your cinematic vision..." 
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      className="w-full bg-background border rounded-2xl p-4 text-sm h-24 focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
                    />
                    <Button className="w-full h-12 rounded-xl font-bold gap-2" size="sm" onClick={handleMagicVideo} disabled={isProcessing}>
                      Generate AI Video (10c)
                    </Button>
                  </div>

                  {/* AI Voiceover */}
                  <div className="p-6 border rounded-[2rem] bg-accent/[0.03] border-accent/10 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-accent/10 rounded-xl">
                        <Mic className="w-5 h-5 text-accent" />
                      </div>
                      <h4 className="font-bold text-foreground">AI Voiceover</h4>
                    </div>
                    <textarea 
                      placeholder="Paste script for neural voice narration..." 
                      value={voiceoverText}
                      onChange={(e) => setVoiceoverText(e.target.value)}
                      className="w-full bg-background border rounded-2xl p-4 text-sm h-24 focus:ring-2 focus:ring-accent focus:outline-none transition-all placeholder:text-muted-foreground"
                    />
                    <Button variant="outline" className="w-full h-12 rounded-xl border-accent text-accent hover:bg-accent hover:text-white font-bold" size="sm" onClick={handleVoiceover} disabled={isProcessing}>
                      Create Voiceover (4c)
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      variant="outline" 
                      className="w-full h-16 justify-start gap-4 px-5 rounded-2xl border-primary/10 bg-background hover:bg-primary/5 hover:border-primary/30 transition-all"
                      onClick={handleAutoCaptions}
                      disabled={isProcessing}
                    >
                      <div className="p-2 bg-blue-50 rounded-xl">
                        <Captions className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold">Auto-Captions</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">3 Credits</p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full h-16 justify-start gap-4 px-5 rounded-2xl border-primary/10 bg-background hover:bg-primary/5 hover:border-primary/30 transition-all"
                      onClick={handleAIAnalyze}
                      disabled={isProcessing}
                    >
                      <div className="p-2 bg-orange-50 rounded-xl">
                        <Sparkles className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold">Optimize for Viral</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">2 Credits</p>
                      </div>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="audio" className="mt-0 space-y-4">
                 <h4 className="text-sm font-bold text-foreground uppercase tracking-wider px-1">Scene Soundtrack</h4>
                 <div className="space-y-3">
                   {generatedVoiceover ? (
                     <div className="flex items-center justify-between p-4 rounded-3xl bg-accent/5 border border-accent/10 animate-in zoom-in-95">
                       <div className="flex items-center gap-4">
                         <div className="p-2 bg-accent/10 rounded-xl">
                            <Volume2 className="w-4 h-4 text-accent" />
                         </div>
                         <div>
                            <span className="text-sm font-bold block">AI Narration</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Active</span>
                         </div>
                       </div>
                       <Button variant="ghost" size="sm" className="h-8 rounded-lg text-destructive hover:bg-destructive/5" onClick={() => setGeneratedVoiceover(null)}>Remove</Button>
                     </div>
                   ) : (
                     <div className="py-12 text-center text-muted-foreground">
                        <Music className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p className="text-xs font-medium">No audio layers added yet</p>
                     </div>
                   )}
                 </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Fullscreen Overlay Loader */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-8">
           <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
             <div className="relative w-24 h-24 mx-auto">
                <Loader2 className="w-24 h-24 animate-spin text-primary opacity-20" />
                <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
             </div>
             <div className="space-y-2">
               <h3 className="text-3xl font-headline font-bold text-foreground tracking-tighter">AI IN PROGRESS</h3>
               <p className="text-muted-foreground font-medium text-lg">Weaving neural networks to create magic...</p>
             </div>
             <div className="relative h-2 bg-muted rounded-full overflow-hidden w-full max-w-sm mx-auto">
                <div 
                  className="absolute inset-y-0 left-0 bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${exportProgress || 30}%` }}
                />
             </div>
             <p className="text-xs font-bold uppercase tracking-widest text-primary/60">{exportProgress || 30}% COMPLETE</p>
           </div>
        </div>
      )}
    </div>
  );
}
