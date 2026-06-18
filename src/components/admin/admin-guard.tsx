
'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { doc } from 'firebase/firestore';

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
      if (!user || !profile?.isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, profile, authLoading, profileLoading, router]);

  if (authLoading || profileLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse font-headline font-bold uppercase tracking-widest">Verifying Admin Clearance...</p>
        </div>
      </div>
    );
  }

  if (!profile?.isAdmin) return null;

  return <>{children}</>;
}
