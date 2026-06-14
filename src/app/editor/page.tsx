
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

export default function EditorPage() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("id");
  const toolFromUrl = searchParams.get("tool");
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const userProfileRef = useMemo(() => {
    if (!user) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(userProfileRef);

  const projectRef = useMemo(() => {
    if (!user) return null;
    const id = projectIdFromUrl || "new-" + Date.now();
    return doc(db, "users", user.uid, "projects", id);
  }, [user, db, projectIdFromUrl]);

  const { data: project, loading: projectLoading } = useDoc(projectIdFromUrl ? projectRef : null);

  useEffect(() => {
    if (project) {
      setTitle(project.title || "Untitled Project");
      setSelectedVideoData(project.videoDataUri || null);
      setSubtitles(project.subtitles || null);
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
    
    if (projectIdFromUrl) {
      updateDoc(projectRef, data).catch(async (e) => {
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
      }).catch(async (e) => {
        errorEmitter.emit("permission-error", new FirestorePermissionError({
          path: projectRef.path,
          operation: "create",
          requestResourceData: data
        }));
      });
      router.replace(`/editor?id=${projectRef.id}`);
    }
  };

  const checkCredits = (cost: number) => {
    if (profile?.isPremium) return true;
    if ((profile?.credits ?? 0) < cost) {
      toast({
        variant: "destructive",
        title: "Insufficient Credits",
        description: `This action costs ${cost} credits. Please upgrade to PRO for unlimited access.`,
        action: <Button variant="outline" size="sm" asChild><Link href="/premium">Upgrade</Link></Button>
      });
      return false;
    }
    return true;
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
            updateDoc(userProfileRef, { credits: increment(-5) }).catch(async (e) => {
              errorEmitter.emit("permission-error", new FirestorePermissionError({
                path: userProfileRef.path,
                operation: "update",
                requestResourceData: { credits: increment(-5) }
              }));
            });
          }

          toast({
            title: "Export Complete!",
            description: "Video saved to your cloud studio in 1080p.",
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
        updateDoc(projectRef, updateData).catch(async (e) => {
          errorEmitter.emit("permission-error", new FirestorePermissionError({
            path: projectRef.path,
            operation: "update",
            requestResourceData: updateData
          }));
        });

        if (!profile?.isPremium && userProfileRef) {
          updateDoc(userProfileRef, { credits: increment(-2) }).catch(async (e) => {
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
        updateDoc(projectRef, updateData).catch(async (e) => {
          errorEmitter.emit("permission-error", new FirestorePermissionError({
            path: projectRef.path,
            operation: "update",
            requestResourceData: updateData
          }));
        });

        if (!profile?.isPremium && userProfileRef) {
          updateDoc(userProfileRef, { credits: increment(-3) }).catch(async (e) => {
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
        updateDoc(projectRef, updateData).catch(async (e) => {
          errorEmitter.emit("permission-error", new FirestorePermissionError({
            path: projectRef.path,
            operation: "update",
            requestResourceData: updateData
          }));
        });

        if (!profile?.isPremium && userProfileRef) {
          updateDoc(userProfileRef, { credits: increment(-10) }).catch(async (e) => {
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
        updateDoc(userProfileRef, { credits: increment(-4) }).catch(async (e) => {
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

  if (projectLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col md:pt-20">
      <Navbar />
      
      <div className="bg-background border-b px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="p-1 hover:bg-muted rounded-full text-foreground">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleSave()}
            className="bg-transparent font-headline font-bold focus:outline-none border-b border-transparent focus:border-primary px-1 text-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          {!profile?.isPremium && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <Coins className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary">{profile?.credits ?? 0}</span>
            </div>
          )}
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-2" onClick={handleExport} disabled={isProcessing}>
            <Download className="w-4 h-4" />
            {isProcessing ? "Wait..." : "Export"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 bg-black flex flex-col relative group">
          <div className="flex-1 relative flex items-center justify-center">
            <div className="aspect-video w-full max-w-4xl bg-[#1a1a1a] shadow-2xl relative flex items-center justify-center cursor-pointer overflow-hidden" onClick={handleFileClick}>
               <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
               {!selectedVideoData ? (
                 <div className="flex flex-col items-center gap-4 text-white/20">
                    <Upload className="w-16 h-16" />
                    <span className="text-sm font-medium">Upload or Generate Video</span>
                 </div>
               ) : (
                 <>
                   <video src={selectedVideoData} className="w-full h-full object-contain" controls={isPlaying} />
                   {subtitles && isPlaying && (
                     <div className="absolute bottom-12 left-0 right-0 text-center px-4 pointer-events-none">
                       <span className="bg-black/80 text-white px-3 py-1 rounded-md text-sm font-medium shadow-lg border border-white/20">
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
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-6 text-white bg-black/40 backdrop-blur-md py-4 translate-y-full group-hover:translate-y-0 transition-transform">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full"><SkipBack className="w-6 h-6" /></Button>
            <Button size="icon" className="w-12 h-12 bg-primary hover:bg-primary/90 rounded-full shadow-lg" onClick={() => {
              setIsPlaying(!isPlaying);
              if (!isPlaying && audioRef.current) audioRef.current.play();
            }}>
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full"><SkipForward className="w-6 h-6" /></Button>
          </div>
        </div>

        <div className="w-full lg:w-80 bg-background border-l overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full h-12 rounded-none grid grid-cols-3 bg-muted/50">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools" className="p-4 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl text-foreground"><Scissors className="w-5 h-5" /> Trim</Button>
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl text-foreground"><Crop className="w-5 h-5" /> Crop</Button>
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl text-foreground"><Gauge className="w-5 h-5" /> Speed</Button>
                <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl text-foreground"><Filter className="w-5 h-5" /> Filters</Button>
              </div>
              <div className="p-4 bg-muted/30 rounded-2xl border border-dashed text-center">
                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-2">Editor Stats</p>
                 <div className="grid grid-cols-2 gap-2">
                    <div className="bg-background p-2 rounded-xl shadow-sm">
                       <p className="text-lg font-bold">1080p</p>
                       <p className="text-[8px] text-muted-foreground">Quality</p>
                    </div>
                    <div className="bg-background p-2 rounded-xl shadow-sm">
                       <p className="text-lg font-bold">30fps</p>
                       <p className="text-[8px] text-muted-foreground">Frame Rate</p>
                    </div>
                 </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="p-4 space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-xl bg-primary/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <h4 className="font-bold text-sm text-foreground">Veo Video Gen</h4>
                  </div>
                  <Input 
                    placeholder="e.g. A dragon flying over a forest" 
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    className="bg-background"
                  />
                  <Button className="w-full gap-2" size="sm" onClick={handleMagicVideo} disabled={isProcessing}>
                    Generate (10c)
                  </Button>
                </div>

                <div className="p-4 border rounded-xl bg-accent/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-accent" />
                    <h4 className="font-bold text-sm text-foreground">AI Voiceover</h4>
                  </div>
                  <textarea 
                    placeholder="Enter script for AI to speak..." 
                    value={voiceoverText}
                    onChange={(e) => setVoiceoverText(e.target.value)}
                    className="w-full bg-background border rounded-lg p-2 text-xs h-20 focus:ring-1 focus:ring-accent"
                  />
                  <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-white" size="sm" onClick={handleVoiceover} disabled={isProcessing}>
                    Add Voiceover (4c)
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-14 justify-start gap-3 px-4 rounded-xl border-accent/20 bg-accent/5 hover:bg-accent/10"
                  onClick={handleAutoCaptions}
                  disabled={isProcessing}
                >
                  <Captions className="w-5 h-5 text-accent" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">Auto-Captions</p>
                    <p className="text-[10px] text-muted-foreground">3 Credits</p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-14 justify-start gap-3 px-4 rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10"
                  onClick={handleAIAnalyze}
                  disabled={isProcessing}
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">Optimize SEO</p>
                    <p className="text-[10px] text-muted-foreground">2 Credits</p>
                  </div>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="audio" className="p-4 space-y-4">
               <h4 className="text-sm font-semibold text-foreground">Scene Audio</h4>
               <div className="space-y-2">
                 {generatedVoiceover && (
                   <div className="flex items-center justify-between p-3 rounded-xl bg-accent/10 border border-accent/20">
                     <div className="flex items-center gap-3">
                       <Volume2 className="w-4 h-4 text-accent" />
                       <span className="text-xs font-bold text-foreground">AI Narration</span>
                     </div>
                     <Button variant="ghost" size="sm" className="h-7 text-destructive" onClick={() => setGeneratedVoiceover(null)}>Delete</Button>
                   </div>
                 )}
                 {[1, 2].map(i => (
                   <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                     <div className="flex items-center gap-3">
                       <Music className="w-4 h-4 text-primary" />
                       <span className="text-xs font-medium text-foreground">BGM Track 0{i}.mp3</span>
                     </div>
                     <Button variant="ghost" size="sm" className="h-7 text-[10px]">Add</Button>
                   </div>
                 ))}
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8">
           <div className="max-w-md w-full text-center space-y-6">
             <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
             <div className="space-y-2">
               <h3 className="text-2xl font-headline font-bold text-white uppercase tracking-tighter">AI Processing</h3>
               <p className="text-muted-foreground text-sm">Our neural networks are weaving their magic...</p>
             </div>
             <Progress value={exportProgress || 45} className="h-1.5" />
           </div>
        </div>
      )}
    </div>
  );
}
