
'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * AuthGuard ensures that only authenticated users can access children components.
 * It handles the loading state and redirects unauthenticated users to the login page.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login but save the attempted URL to return later
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse font-headline font-bold">Verifying Studio Access...</p>
        </div>
      </div>
    );
  }

  // If not loading and no user, the useEffect will handle redirection.
  // We return null to avoid flashing protected content.
  if (!user) return null;

  return <>{children}</>;
}
