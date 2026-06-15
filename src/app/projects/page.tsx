
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Plus, Play, Search, Filter, MoreVertical, 
  Trash2, Copy, Edit3, Loader2, Video 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { useMemo, useState } from "react";
import Image from "next/image";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function ProjectsPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const projectsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "users", user.uid, "projects"),
      orderBy("createdAt", "desc")
    );
  }, [db, user]);

  const { data: projects, loading: projectsLoading } = useCollection(projectsQuery);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(p => 
      p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  const handleDelete = async (projectId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "projects", projectId));
      toast({ title: "Project deleted" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error deleting project" });
    }
  };

  if (userLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pt-20">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-headline font-bold">My Projects</h1>
          <Button className="rounded-full px-6 gap-2" onClick={() => router.push("/editor")}>
            <Plus className="w-4 h-4" /> New Video
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search videos..." 
              className="pl-10" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project: any) => (
              <Card key={project.id} className="group overflow-hidden border-none shadow-md bg-card/50">
                <div className="aspect-video relative">
                  <Image
                    src={project.thumbnailUrl || `https://picsum.photos/seed/${project.id}/600/400`}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" className="rounded-full" onClick={() => router.push(`/editor?id=${project.id}`)}>
                      <Play className="w-5 h-5 fill-current" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4 flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-bold truncate max-w-[200px]">{project.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Modified {new Date(project.updatedAt?.seconds * 1000 || project.createdAt?.seconds * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/editor?id=${project.id}`)}>
                        <Edit3 className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
            <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold">No projects found</h3>
            <p className="text-muted-foreground mb-6">Start creating your first masterpiece today.</p>
            <Button asChild>
              <Link href="/editor">Create New Video</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
