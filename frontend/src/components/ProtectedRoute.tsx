'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from './Layout';

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [loading, user, router, allowedRoles]);

  // Show nothing while checking auth state
  if (loading) {
    return null;
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Not authorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <Layout>{children}</Layout>;
} 