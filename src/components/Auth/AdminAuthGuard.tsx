'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('No user found, redirecting to sign-in');
          router.push('/sign-in');
          return;
        }

        // Check if user is super admin
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          router.push('/');
          return;
        }

        if (!profile || (profile.type !== 'SUPER_ADMIN' && profile.type !== 'ADMIN')) {
          console.log('User is not an admin, redirecting to home');
          router.push('/');
          return;
        }

        console.log('User is authorized as admin');
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/sign-in');
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-600" />
      </div>
    );
  }

  return <>{children}</>;
} 