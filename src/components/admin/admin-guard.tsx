"use client";

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { doc } from 'firebase/firestore';

const OWNER_EMAIL = "rinkukumarpaswan1796@gmail.com";

/**
 * 🛡️ MASTER GUARD: Enforces absolute clearance protocols.
 * Only the designated Owner or verified Admins can pass.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user?.uid, db]);

  const { data: profile, loading: profileLoading } = useDoc(profileRef);

  useEffect(() => {
    if (!authLoading && !profileLoading) {
      const isOwner = user?.email === OWNER_EMAIL;
      const isAdmin = profile?.isAdmin === true;

      if (!user || (!isOwner && !isAdmin)) {
        console.warn("Access Denied: Insufficient Node Clearance.");
        router.push('/dashboard');
      }
    }
  }, [user, profile, authLoading, profileLoading, router]);

  if (authLoading || profileLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#03010a]">
        <div className="text-center space-y-6">
          <div className="relative mx-auto w-20 h-20">
            <Loader2 className="w-full h-full animate-spin text-primary relative z-10" />
            <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full" />
          </div>
          <p className="text-muted-foreground animate-pulse font-headline font-black uppercase tracking-[0.4em] text-xs">Verifying Master Clearance...</p>
        </div>
      </div>
    );
  }

  const isOwner = user?.email === OWNER_EMAIL;
  const isAdmin = profile?.isAdmin === true;

  if (!isOwner && !isAdmin) return null;

  return <>{children}</>;
}
